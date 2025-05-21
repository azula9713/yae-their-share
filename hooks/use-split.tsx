import { IExpense, IParticipant, ISplit } from "@/types/split.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  eventId: string;
};

export default function useSplit({ eventId }: Readonly<Props>) {
  const [split, setSplit] = useState<ISplit | null>(null);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Load split data from localStorage
    try {
      const events = JSON.parse(
        localStorage.getItem("theirShareEvents") ?? "[]"
      );
      const currentSplit = events.find((e: ISplit) => e.id === eventId);

      if (!currentSplit) {
        console.error("ISplit not found:", eventId);
        router.push("/?error=split-not-found");
        return;
      }
      setSplit(currentSplit);
    } catch (error) {
      console.error("Error loading split:", error);
      router.push("/?error=loading-error");
    }
  }, [eventId, router]);

  const saveSplit = (updatedSplit: ISplit) => {
    // Update split in localStorage
    const events = JSON.parse(localStorage.getItem("theirShareEvents") ?? "[]");
    const updatedEvents = events.map((e: ISplit) =>
      e.id === updatedSplit.id ? updatedSplit : e
    );

    localStorage.setItem("theirShareEvents", JSON.stringify(updatedEvents));
    setSplit(updatedSplit);
  };

  const addExpense = (expense: Omit<IExpense, "id">) => {
    if (!split) return;

    const newExpense: IExpense = {
      ...expense,
      id: Date.now().toString(),
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
      e.id === id ? { ...e, ...updatedExpense } : e
    );

    const updatedEvent = {
      ...split,
      expenses: updatedExpenses,
    };

    saveSplit(updatedEvent);
  };

  const removeExpense = (id: string) => {
    if (!split) return;

    const updatedExpenses = split.expenses.filter((e) => e.id !== id);

    const updatedEvent = {
      ...split,
      expenses: updatedExpenses,
    };

    saveSplit(updatedEvent);
  };

  const addParticipant = (name: string) => {
    if (!split) return;

    const newParticipant: IParticipant = {
      id: Date.now().toString(),
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
      p.id === id ? { ...p, name } : p
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
    const updatedParticipants = split.participants.filter((p) => p.id !== id);

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
