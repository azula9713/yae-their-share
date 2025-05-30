import { api } from "@/convex/_generated/api";
import { IExpense, IParticipant, ISplit } from "@/types/split.types";
import { useConvex, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUpdateSplit } from "./use-split-mutations";
import { useCachedSplit } from "./use-cached-splits";

type Props = {
  splitId: string;
};

export default function useSplit({ splitId }: Readonly<Props>) {
  const user = useQuery(api.authFunctions.currentUser);
  const updateSplitMutation = useUpdateSplit(user?.id!);
  const { isPending: updatePending, isError: updateError } =
    updateSplitMutation;

  const { data: split, error, isLoading } = useCachedSplit(splitId);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const router = useRouter();
  const convex = useConvex();

  const getCurrentSplit = async () => {
    try {
      // Fetch split data from Convex
      const currentSplit = await convex.query(api.splits.getSplitById, {
        splitId: splitId,
      });

      if (!currentSplit) {
        console.error("ISplit not found:", splitId);
        router.push("/?error=split-not-found");
        return;
      }
    } catch (error) {
      console.error("Error loading split:", error);
      router.push("/?error=loading-error");
    }
  };

  useEffect(() => {
    if (splitId) getCurrentSplit();
  }, [splitId, router]);

  const saveSplit = (updatedSplit: ISplit) => {
    //remove _creationTime field from updatedSplit
    const {
      _creationTime,
      _id,
      createdBy,
      createdAt,
      ...sanitizedUpdatedSplit
    } = updatedSplit;
    updateSplitMutation.mutate(
      { ...sanitizedUpdatedSplit },
      {
        onSuccess: () => {
          console.log("Split updated successfully:", updatedSplit);
        },
        onError: (error) => {
          console.error("Error updating split:", error);
        },
      }
    );
  };

  const addExpense = (expense: Omit<IExpense, "id">) => {
    if (!split) return;

    const newExpense: IExpense = {
      ...expense,
      expenseId: Date.now().toString(),
    };

    const updatedEvent = {
      ...split,
      expenses: [...split.expenses, newExpense],
    };

    saveSplit(updatedEvent);
    setIsAddExpenseOpen(false);
  };

  const editExpense = (id: string, updatedExpense: Omit<IExpense, "id">) => {
    if (!split) return;

    const updatedExpenses = split.expenses.map((e) =>
      e.expenseId === id ? { ...e, ...updatedExpense } : e
    );

    const updatedEvent = {
      ...split,
      expenses: updatedExpenses,
    };

    saveSplit(updatedEvent);
  };

  const removeExpense = (id: string) => {
    if (!split) return;

    const updatedExpenses = split.expenses.filter((e) => e.expenseId !== id);

    const updatedEvent = {
      ...split,
      expenses: updatedExpenses,
    };

    saveSplit(updatedEvent);
  };

  const addParticipant = (name: string) => {
    if (!split) return;

    const newParticipant: IParticipant = {
      participantId: crypto.randomUUID(),
      name,
    };

    const updatedSplit = {
      ...split,
      participants: [...split.participants, newParticipant],
    };

    saveSplit(updatedSplit);
    setIsAddParticipantOpen(false);
  };

  const editParticipant = (id: string, name: string) => {
    if (!split) return;

    const updatedParticipants = split.participants.map((p) =>
      p.participantId === id ? { ...p, name } : p
    );

    const updatedEvent = {
      ...split,
      participants: updatedParticipants,
    };

    saveSplit(updatedEvent);
  };

  const removeParticipant = (id: string) => {
    if (!split) return;

    // Remove participant
    const updatedParticipants = split.participants.filter(
      (p) => p.participantId !== id
    );

    // Remove expenses paid by this participant
    const updatedExpenses = split.expenses.filter((e) => e.paidBy !== id);

    // Remove this participant from split lists
    const finalExpenses = updatedExpenses.map((expense) => ({
      ...expense,
      splitBetween: expense.splitBetween.filter((pid) => pid !== id),
    }));

    const updatedEvent = {
      ...split,
      participants: updatedParticipants,
      expenses: finalExpenses,
    };

    saveSplit(updatedEvent);
  };

  return {
    split,
    isLoading,
    updatePending,
    updateError,
    error,
    addParticipant,
    editParticipant,
    removeParticipant,
    addExpense,
    editExpense,
    removeExpense,
    saveSplit,
    setIsAddParticipantOpen,
    setIsAddExpenseOpen,
    isAddParticipantOpen,
    isAddExpenseOpen,
  };
}
