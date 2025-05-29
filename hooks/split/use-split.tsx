import { api } from "@/convex/_generated/api";
import { IExpense, IParticipant, ISplit } from "@/types/split.types";
import { useConvex } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  splitId: string;
};

export default function useSplit({ splitId }: Readonly<Props>) {
  const [split, setSplit] = useState<ISplit | null>(null);
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
      setSplit(currentSplit);
    } catch (error) {
      console.error("Error loading split:", error);
      router.push("/?error=loading-error");
    }
  };

  useEffect(() => {
    // Load split data when component mounts
    // getCurrentSplit();
    if (splitId) getCurrentSplit();
  }, [splitId, router]);

  const saveSplit = (updatedSplit: ISplit) => {
    // Update split in localStorage
    const events = JSON.parse(localStorage.getItem("theirShareEvents") ?? "[]");
    const updatedEvents = events.map((e: ISplit) =>
      e.splitId === updatedSplit.splitId ? updatedSplit : e
    );

    localStorage.setItem("theirShareEvents", JSON.stringify(updatedEvents));
    setSplit(updatedSplit);
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
      participantId: Date.now().toString(),
      name,
    };

    const updatedEvent = {
      ...split,
      participants: [...split.participants, newParticipant],
    };

    saveSplit(updatedEvent);
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
    split,
    setSplit,
  };
}
