"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IExpense, IParticipant } from "@/types/split.types";

interface ExpensesListProps {
  expenses: IExpense[];
  participants: IParticipant[];
  onRemove: (id: string) => void;
}

export default function ExpensesList({
  expenses,
  participants,
  onRemove,
}: Readonly<ExpensesListProps>) {
  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Add participants first before adding expenses.
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No expenses added yet. Add expenses to track who paid for what.
      </div>
    );
  }

  // Helper function to get participant name by id
  const getParticipantName = (id: string) => {
    const participant = participants.find((p) => p.participantId === id);
    return participant ? participant.name : "Unknown";
  };

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <Card key={expense.expenseId}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{expense.description}</h3>
                <p className="text-2xl font-semibold mt-1">
                  ${expense.amount.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Paid by: {getParticipantName(expense.paidBy)}
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium">Split between:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {expense.splitBetween.map((id) => (
                      <span
                        key={id}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {getParticipantName(id)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(expense.expenseId)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="size-4 text-muted-foreground" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
