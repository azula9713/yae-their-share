import { IExpense, ISplit } from "@/types/split.types";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowRight, DollarSign, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "../ui/badge";

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
  const isComplete = split.participants.length > 0 && hasExpenses;

  const getEventEmoji = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("trip") || lowerName.includes("vacation"))
      return "✈️";
    if (lowerName.includes("dinner") || lowerName.includes("restaurant"))
      return "🍽️";
    if (lowerName.includes("coffee") || lowerName.includes("cafe")) return "☕";
    if (lowerName.includes("birthday") || lowerName.includes("party"))
      return "🎉";
    if (lowerName.includes("beach") || lowerName.includes("ocean")) return "🏖️";
    if (lowerName.includes("shopping")) return "🛍️";
    return "💫";
  };

  return (
    <Link
      key={split.splitId}
      href={`/split/${split.splitId}`}
      className="block group"
    >
      <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-white to-pink-50 dark:from-slate-800 dark:to-pink-900/20 group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-2xl">{getEventEmoji(split.name)}</div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {split.name}
                </CardTitle>
                {split.date && (
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {format(new Date(split.date), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Badge
              variant={isComplete ? "default" : "secondary"}
              className={`ml-2 text-xs ${
                isComplete
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
              }`}
            >
              {isComplete ? "Ready" : "Setting up"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Participants and Expenses Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-xl flex items-center justify-center shadow-sm">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">
                    {split.participants.length}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {split.participants.length === 1 ? "friend" : "friends"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-xl flex items-center justify-center shadow-sm">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">
                    ${totalAmount.toFixed(0)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {split.expenses.length} expense
                    {split.expenses.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            {split.participants.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Progress</span>
                  <span>
                    {hasExpenses
                      ? "Ready to settle up! 🎉"
                      : "Add some expenses"}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 shadow-inner">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 shadow-sm ${
                      hasExpenses
                        ? "bg-gradient-to-r from-emerald-400 to-teal-400 w-full"
                        : "bg-gradient-to-r from-orange-400 to-pink-400 w-1/2"
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Quick Action */}
            {(() => {
              let quickActionText = "";
              if (split.participants.length === 0) {
                quickActionText = "Add friends to get started";
              } else if (hasExpenses) {
                quickActionText = "See who owes what";
              } else {
                quickActionText = "Start adding expenses";
              }
              return (
                <div className="flex items-center justify-between pt-3 border-t border-orange-100 dark:border-orange-900/30">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {quickActionText}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-orange-500 transition-colors group-hover:translate-x-1" />
                </div>
              );
            })()}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
