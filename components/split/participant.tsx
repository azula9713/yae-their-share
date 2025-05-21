import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { IExpense, IParticipant } from "@/types/split.types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PencilIcon, Receipt, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import useSplit from "@/hooks/use-split";

type Props = {
  participant: IParticipant;
  expenses: IExpense[];
  setSelectedParticipant: (id: string) => void;
  setIsAddExpenseOpen: (open: boolean) => void;
};

export default function Participant({
  participant,
  expenses,
  setSelectedParticipant,
  setIsAddExpenseOpen,
}: Readonly<Props>) {
  const { removeParticipant, editParticipant } = useSplit();

  const [isEditParticipantOpen, setIsEditParticipantOpen] = useState(false);

  const handleAddExpense = (participantId: string) => {
    setSelectedParticipant(participantId);
    setIsAddExpenseOpen(true);
  };

  const getParticipantSummary = (participantId: string) => {
    let totalPaid = 0;
    let totalOwed = 0;

    expenses.forEach((expense) => {
      // Add what this participant paid
      if (expense.paidBy === participantId) {
        totalPaid += expense.amount;
      }

      // Calculate what this participant owes
      if (expense.splitBetween.includes(participantId)) {
        const splitAmount = expense.amount / expense.splitBetween.length;
        totalOwed += splitAmount;
      }
    });

    const balance = totalPaid - totalOwed;
    return { totalPaid, totalOwed, balance };
  };

  const { totalPaid, balance } = getParticipantSummary(participant.id);

  const participantExpenses = expenses.filter(
    (e) => e.paidBy === participant.id
  );

  const getBadgeVariant = (balance: number) => {
    if (balance > 0) {
      return "default";
    } else if (balance < 0) {
      return "destructive";
    } else {
      return "outline";
    }
  };

  const getBalanceText = (balance: number) => {
    if (balance > 0) {
      return `Gets back $${balance.toFixed(2)}`;
    } else if (balance < 0) {
      return `Owes $${Math.abs(balance).toFixed(2)}`;
    } else {
      return "All settled";
    }
  };

  // Calculate total paid and owed for each participant

  return (
    <Card key={participant.id} className="overflow-hidden">
      <div className="p-2 md:p-4 border-b">
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center justify-start space-x-0.5">
            {isEditParticipantOpen ? (
              <Input
                type="text"
                defaultValue={participant.name}
                onBlur={(e) => {
                  editParticipant(participant.id, e.target.value);
                  setIsEditParticipantOpen(false);
                }}
                className="w-max"
              />
            ) : (
              <h3 className="font-medium">{participant.name}</h3>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditParticipantOpen(true);
              }}
              className="size-8 p-0"
            >
              <PencilIcon className="size-4 text-muted-foreground" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeParticipant(participant.id)}
              className="size-8 p-0"
            >
              <Trash2 className="size-4 text-red-700" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddExpense(participant.id)}
            className="h-8 gap-1"
          >
            <Receipt className="h-3.5 w-3.5" />
            <span>Add Expense</span>
          </Button>
        </div>
        <div className="flex items-center w-full justify-between mt-2">
          <Badge className="" variant={getBadgeVariant(balance)}>
            {getBalanceText(balance)}
          </Badge>
          <span className="text-xs text-muted-foreground w-max">
            Paid: ${totalPaid.toFixed(2)}
          </span>
        </div>
      </div>

      {participantExpenses.length > 0 && (
        <CardContent className="p-0">
          <div className="divide-y">
            {participantExpenses.map((expense) => (
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
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
