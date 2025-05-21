"use client";

import { useState } from "react";
import AddExpenseDialog from "@/components/add-expense-dialog";
import { IExpense, IParticipant } from "@/types/split.types";
import Participant from "./participant";

interface ParticipantsListProps {
  participants: IParticipant[];
  expenses: IExpense[];
  removeParticipant: (id: string) => void;
  editParticipant: (id: string, name: string) => void;
  addExpense: (expense: Omit<IExpense, "id">) => void;
}

export default function ParticipantsList({
  participants,
  expenses,
  addExpense,
}: Readonly<ParticipantsListProps>) {
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(
    null
  );
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const handleExpenseAdded = (expense: Omit<IExpense, "id">) => {
    addExpense(expense);
    setIsAddExpenseOpen(false);
    setSelectedParticipant(null);
  };

  

  return (
    <div className="space-y-4">
      {participants.map((participant) => {
        return (
          <Participant
            {...{
              participant,
              expenses,
              setIsAddExpenseOpen,
              setSelectedParticipant,
            }}
            key={participant.id}
          />
        );
      })}

      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onAdd={handleExpenseAdded}
        participants={participants}
        defaultPaidBy={selectedParticipant ?? undefined}
      />
    </div>
  );
}
