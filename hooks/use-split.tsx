import { IExpense, IParticipant, ISplit } from '@/types/split.types';
import { useState } from 'react';


export default function useSplit() {

    const [split, setSplit] = useState<ISplit | null>(null);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);


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
        removeParticipant,
        addExpense,
        removeExpense,
        saveSplit,
        setIsAddParticipantOpen,
        setIsAddExpenseOpen,
        isAddParticipantOpen,
        isAddExpenseOpen,
        split,
        setSplit,
    }
}