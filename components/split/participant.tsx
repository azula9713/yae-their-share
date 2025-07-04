import { PencilIcon, Receipt, RefreshCcw, Trash2 } from "lucide-react";
import { useState } from "react";

import useSplit from "@/hooks/split/use-split";
import { useGetUserSettings } from "@/hooks/user/use-user";
import { IExpense, IParticipant } from "@/types/split.types";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

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
  const { currency: currencySettings } = useGetUserSettings();

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
      return `Gets back ${currencySettings.symbol}${balance.toFixed(currencySettings.decimalPlaces ?? 2)}`;
    } else if (balance < 0) {
      return `Owes ${currencySettings.symbol}${Math.abs(balance).toFixed(currencySettings.decimalPlaces ?? 2)}`;
    } else {
      return "All settled";
    }
  };

  const getPaidText = (totalPaid: number) => {
    return `Paid: ${currencySettings.symbol}${totalPaid.toFixed(currencySettings.decimalPlaces ?? 2)}`;
  };

  return (
    <Card
      key={participant.participantId}
      className="overflow-hidden bg-gray-100/10 dark:bg-black/10"
    >
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
              <h3 className="font-semibold text-lg">{participant.name}</h3>
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

          <Badge className="" variant={getBadgeVariant(balance)}>
            {getPaidText(totalPaid)}
          </Badge>
        </div>
        <div className="flex items-center w-full justify-between mt-2">
          <span className="text-xs text-muted-foreground w-max">
            {getBalanceText(balance)}
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
      <div className="flex items-center justify-end p-2 md:p-3 w-full">
        {!updatePending && !isEditParticipantOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddExpense(participant.participantId)}
            className="h-8 gap-1"
          >
            <Receipt className="size-3.5" />
            <span>Add Expense</span>
          </Button>
        )}
      </div>
    </Card>
  );
}
