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

  // Get split status
  const hasExpenses = split.expenses.length > 0;

  return (
    <Link
      key={split.splitId}
      href={`/split/${split.splitId}`}
      className="block group"
    >
      <div className="border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center size-10">
            <DollarSign className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900 dark:text-white">
              {split.name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
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
              <div className="font-medium text-slate-900 dark:text-white">
                ${totalAmount.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {split.expenses.length} expense
                {split.expenses.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}
          <ChevronRight className="size-5 text-slate-400" />
        </div>
      </div>
    </Link>
  );
}
