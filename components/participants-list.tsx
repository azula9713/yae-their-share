"use client";

import type { Participant, Expense } from "@/app/split/[id]/page";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddExpenseDialog from "@/components/add-expense-dialog";

interface ParticipantsListProps {
  participants: Participant[];
  expenses: Expense[];
  onRemove: (id: string) => void;
  onAddExpense: (expense: Omit<Expense, "id">) => void;
}

export default function ParticipantsList({
  participants,
  expenses,
  onRemove,
  onAddExpense,
}: ParticipantsListProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(
    null
  );
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const handleAddExpense = (participantId: string) => {
    setSelectedParticipant(participantId);
    setIsAddExpenseOpen(true);
  };

  const handleExpenseAdded = (expense: Omit<Expense, "id">) => {
    onAddExpense(expense);
    setIsAddExpenseOpen(false);
    setSelectedParticipant(null);
  };

  // Calculate total paid and owed for each participant
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

  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No participants added yet. Add participants to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {participants.map((participant) => {
        const { totalPaid, balance } = getParticipantSummary(participant.id);
        const participantExpenses = expenses.filter(
          (e) => e.paidBy === participant.id
        );

        return (
          <Card key={participant.id} className="overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b">
              <div>
                <h3 className="font-medium">{participant.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      balance > 0
                        ? "default"
                        : balance < 0
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {balance > 0
                      ? `Gets back $${balance.toFixed(2)}`
                      : balance < 0
                      ? `Owes $${Math.abs(balance).toFixed(2)}`
                      : "All settled"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Paid: ${totalPaid.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddExpense(participant.id)}
                  className="h-8 gap-1"
                >
                  <Receipt className="h-3.5 w-3.5" />
                  <span>Add Expense</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(participant.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </div>

            {participantExpenses.length > 0 && (
              <CardContent className="p-0">
                <div className="divide-y">
                  {participantExpenses.map((expense) => (
                    <div key={expense.id} className="p-3 bg-muted/30">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">
                            {expense.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Split between {expense.splitBetween.length} people
                          </p>
                        </div>
                        <p className="font-medium">
                          ${expense.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onAdd={handleExpenseAdded}
        participants={participants}
        defaultPaidBy={selectedParticipant || undefined}
      />
    </div>
  );
}
