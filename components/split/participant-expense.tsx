import useSplit from "@/hooks/split/use-split";
import { IExpense, IParticipant } from "@/types/split.types";
import { PencilIcon, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import ExpenseDialog from "../expense-dialog";

type Props = {
  expense: IExpense;
  participant: IParticipant;
  eventId: string;
};

export default function ParticipantExpense({
  expense,
  participant,
  eventId,
}: Readonly<Props>) {
  const { removeParticipant, editExpense, split } = useSplit({
    splitId: eventId,
  });

  const [isEditParticipantOpen, setIsEditParticipantOpen] = useState(false);

  const handleExpenseEdited = (editedExpense: Omit<IExpense, "id">) => {
    editExpense(expense.id, editedExpense);
    setIsEditParticipantOpen(false);
  };

  return (
    <div key={expense.id} className="p-3 bg-muted/30">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{expense.description}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Split between {expense.splitBetween.length} people
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="font-medium">${expense.amount.toFixed(2)}</p>
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0"
            onClick={() => {
              setIsEditParticipantOpen(true);
            }}
          >
            <PencilIcon className="size-4 text-muted-foreground" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeParticipant(participant.id)}
            className="size-8 p-0 bg-red-500"
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      </div>

      <ExpenseDialog
        open={isEditParticipantOpen}
        onOpenChange={setIsEditParticipantOpen}
        onAdd={handleExpenseEdited}
        participants={split?.participants ?? []}
        defaultPaidBy={expense.paidBy}
        isEdit
        expenseToEdit={expense}
      />
    </div>
  );
}
