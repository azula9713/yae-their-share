"use client";

import { useState } from "react";
import ExpenseDialog from "@/components/expense-dialog";
import { IExpense, IParticipant } from "@/types/split.types";
import Participant from "./participant";
import useSplit from "@/hooks/split/use-split";

interface ParticipantsListProps {
  participants: IParticipant[];
  expenses: IExpense[];
  splitId: string;
}

export default function ParticipantsList({
  participants,
  expenses,
  splitId,
}: Readonly<ParticipantsListProps>) {
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(
    null
  );
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const { addExpense } = useSplit({ splitId: splitId });

  const handleExpenseAdded = (expense: Omit<IExpense, "expenseId">) => {
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
              eventId: splitId,
            }}
            key={participant.participantId}
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
