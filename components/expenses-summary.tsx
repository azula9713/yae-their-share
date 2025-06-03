import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { IExpense, IParticipant } from "@/types/split.types";

interface SummaryProps {
  expenses: IExpense[];
  participants: IParticipant[];
}

interface Debt {
  from: string;
  to: string;
  amount: number;
}

export default function ExpensesSummary({
  expenses,
  participants,
}: Readonly<SummaryProps>) {
  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Add participants first to see the summary.
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No expenses added yet. Add expenses to see who owes whom.
      </div>
    );
  }

  // Calculate balances for each participant
  const balances = new Map<string, number>();

  // Initialize balances to 0
  participants.forEach((p) => {
    balances.set(p.participantId, 0);
  });

  // Calculate what each person paid and what they owe
  expenses.forEach((expense) => {
    // Add the full amount to the person who paid
    const paidBy = expense.paidBy;
    balances.set(paidBy, (balances.get(paidBy) ?? 0) + expense.amount);

    // Subtract the split amount from each person who owes
    const splitAmount = expense.amount / expense.splitBetween.length;
    expense.splitBetween.forEach((personId) => {
      balances.set(personId, (balances.get(personId) ?? 0) - splitAmount);
    });
  });

  // Calculate who owes whom
  const debts: Debt[] = [];

  // Create arrays of positive and negative balances
  const positiveBalances: [string, number][] = [];
  const negativeBalances: [string, number][] = [];

  balances.forEach((balance, personId) => {
    if (balance > 0.01) {
      // Using 0.01 to handle floating point errors
      positiveBalances.push([personId, balance]);
    } else if (balance < -0.01) {
      negativeBalances.push([personId, balance]);
    }
  });

  // Sort balances by absolute value (largest first)
  positiveBalances.sort((a, b) => b[1] - a[1]);
  negativeBalances.sort((a, b) => a[1] - b[1]);

  // Match creditors with debtors
  while (positiveBalances.length > 0 && negativeBalances.length > 0) {
    const [creditorId, creditorBalance] = positiveBalances[0];
    const [debtorId, debtorBalance] = negativeBalances[0];

    const amount = Math.min(creditorBalance, -debtorBalance);

    if (amount > 0.01) {
      // Only add if the amount is significant
      debts.push({
        from: debtorId,
        to: creditorId,
        amount: Number.parseFloat(amount.toFixed(2)),
      });
    }

    // Update balances
    positiveBalances[0][1] -= amount;
    negativeBalances[0][1] += amount;

    // Remove zero balances
    if (positiveBalances[0][1] < 0.01) {
      positiveBalances.shift();
    }

    if (negativeBalances[0][1] > -0.01) {
      negativeBalances.shift();
    }
  }

  // Helper function to get participant name by id
  const getParticipantName = (id: string) => {
    const participant = participants.find((p) => p.participantId === id);
    return participant ? participant.name : "Unknown";
  };

  return (
    <div className="space-y-4">
      {debts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Everyone is settled up! No payments needed.
        </div>
      ) : (
        debts.map((debt, index) => (
          <Card key={debt.from + debt.to + index} className="shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {getParticipantName(debt.from)}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <ArrowRight className="size-4 mx-2" />
                </div>
                <div className="font-medium">{getParticipantName(debt.to)}</div>
              </div>
              <div className="text-center mt-2">
                <span className="text-xl font-bold text-primary">
                  ${debt.amount.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
