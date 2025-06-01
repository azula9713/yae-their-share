import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { IExpense, IParticipant } from "@/types/split.types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PencilIcon, Receipt, RefreshCcw, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import useSplit from "@/hooks/split/use-split";
import ParticipantExpense from "./participant-expense";

type Props = {
  participant: IParticipant;
  expenses: IExpense[];
  setSelectedParticipant: (id: string) => void;
  setIsAddExpenseOpen: (open: boolean) => void;
  eventId: string;
};

export default function Participant({
  participant,
  expenses,
  setSelectedParticipant,
  setIsAddExpenseOpen,
  eventId,
}: Readonly<Props>) {
  const { removeParticipant, editParticipant, updatePending } = useSplit({
    splitId: eventId,
  });
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

  const { totalPaid, balance } = getParticipantSummary(
    participant.participantId
  );

  const participantExpenses = expenses.filter(
    (e) => e.paidBy === participant.participantId
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

  return (
    <Card key={participant.participantId} className="overflow-hidden">
      <div className="p-2 md:p-4 border-b">
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center justify-start space-x-0.5">
            {isEditParticipantOpen ? (
              <Input
                type="text"
                defaultValue={participant.name}
                onBlur={(e) => {
                  editParticipant(
                    participant.participantId,
                    e.target.value.trim()
                  );
                  setIsEditParticipantOpen(false);
                }}
                className="w-max"
              />
            ) : (
              <h3 className="font-medium">{participant.name}</h3>
            )}

            {updatePending && (
              // animated sync icon
              <RefreshCcw className="size-4 animate-spin text-green-500 ml-2" />
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
              onClick={() => removeParticipant(participant.participantId)}
              className="size-8 p-0"
            >
              <Trash2 className="size-4 text-red-700" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
          {(!updatePending && !isEditParticipantOpen) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddExpense(participant.participantId)}
              className="h-8 gap-1"
            >
              <Receipt className="h-3.5 w-3.5" />
              <span>Add Expense</span>
            </Button>
          )}
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
              <ParticipantExpense
                {...{ expense, participant, eventId }}
                key={expense.expenseId}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
