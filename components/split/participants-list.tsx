"use client";

import { useState } from "react";
import ExpenseDialog from "@/components/expense-dialog";
import { IExpense, IParticipant } from "@/types/split.types";
import Participant from "./participant";
import useSplit from "@/hooks/use-split";

interface ParticipantsListProps {
  participants: IParticipant[];
  expenses: IExpense[];
  eventId: string;
}

export default function ParticipantsList({
  participants,
  expenses,
  eventId,
}: 
Readonly<ParticipantsListProps>) {
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(
    null
  );
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const { addExpense } = useSplit({eventId});

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
              eventId,
            }}
            key={participant.id}
          />
        );
      })}

      <ExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onAdd={handleExpenseAdded}
        participants={participants}
        defaultPaidBy={selectedParticipant ?? undefined}
      />
    </div>
  );
}
