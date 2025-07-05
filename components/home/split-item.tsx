import { format } from "date-fns";
import { Calendar, ChevronRight, DollarSign, Users } from "lucide-react";
import Link from "next/link";

import { IExpense, ISplit } from "@/types/split.types";

type Props = {
  split: ISplit;
};

export default function SplitItem({ split }: Readonly<Props>) {
  const totalAmount = split.expenses.reduce(
    (sum: number, expense: IExpense) => sum + expense.amount,
    0
  );

  const hasExpenses = split.expenses.length > 0;

  return (
    <Link
      key={split.splitId}
      href={`/split/${split.splitId}`}
      className="block group"
    >
      <div className="border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-muted transition-colors">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-muted flex items-center justify-center size-10">
            <DollarSign className="size-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{split.name}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="mr-1 size-3.5" />
                <span>{split.participants.length}</span>
              </div>
              {split.date && (
                <div className="flex items-center">
                  <Calendar className="mr-1 size-3.5" />
                  <span>{format(new Date(split.date), "MMM d")}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasExpenses && (
            <div className="text-right hidden sm:block">
              <div className="font-medium">${totalAmount.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">
                {split.expenses.length} expense
                {split.expenses.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}
          <ChevronRight className="size-5 text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
}
