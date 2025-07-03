import { format } from "date-fns";
import {
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  Lock,
  Receipt,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ISplit } from "@/types/split.types";

import ShareMenu from "../common/share-menu";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";



type Props = {
  splits: ISplit[];
  setShowCopyAlert: (show: boolean) => void;
};

export default function AllSplits({ splits, setShowCopyAlert }: Props) {
  const router = useRouter();

  const handleCopyGroupUrl = async (eventId: string) => {
    try {
      const url = `${window.location.origin}/split/${eventId}`;
      await navigator.clipboard.writeText(url);
      setShowCopyAlert(true);
      setTimeout(() => setShowCopyAlert(false), 3000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const sortedEvents = [...splits].sort((a, b) => {
    const aLastActivity =
      a.expenses.length > 0
        ? Math.max(...a.expenses.map((e) => Number.parseInt(e.expenseId)))
        : 0;
    const bLastActivity =
      b.expenses.length > 0
        ? Math.max(...b.expenses.map((e) => Number.parseInt(e.expenseId)))
        : 0;
    return bLastActivity - aLastActivity;
  });

  return (
    <Card className="border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="text-primary size-5" />
          Recent Splits
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {splits.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center rounded-full bg-muted mb-4 size-16">
              <DollarSign className="text-primary size-8" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              No splits yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first split to start tracking shared expenses with
              friends, family, or colleagues.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {sortedEvents.map((split) => {
              const totalAmount = split.expenses.reduce(
                (sum, expense) => sum + expense.amount,
                0
              );
              const hasExpenses = split.expenses.length > 0;
              const hasParticipants = split.participants.length > 0;

              return (
                <div
                  key={split.splitId}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/split/${split.splitId}`}
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                    >
                      <div className="rounded-full bg-muted flex items-center justify-center size-12">
                        <DollarSign className="text-primary size-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium">
                            {split.name}
                          </h3>
                          <div className="flex gap-2">
                            {hasExpenses && (
                              <Badge
                                variant="default"
                                className="bg-primary/10 text-primary hover:bg-primary/10 border-0 text-xs"
                              >
                                Active
                              </Badge>
                            )}
                            {!hasParticipants && (
                              <Badge variant="outline" className="text-xs">
                                Setup needed
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="size-3.5" />
                            <span>{split.participants.length} people</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Receipt className="size-3.5" />
                            <span>{split.expenses.length} expenses</span>
                          </div>
                          {hasExpenses && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="size-3.5" />
                              <span>${totalAmount.toFixed(0)} total</span>
                            </div>
                          )}
                          {split.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="size-3.5" />
                              <span>
                                {format(new Date(split.date), "MMM d, yyyy")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="text-muted-foreground size-5" />
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0 ml-2"
                      // onClick={(e) => e.stopPropagation()}
                    >
                      <Lock className="size-4" />
                      <span className="sr-only">Lock Split</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0 ml-2"
                      // onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="size-4" />
                      <span className="sr-only">Make Private</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0 mx-2"
                      // onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Delete Split</span>
                    </Button>
                    <ShareMenu
                      {...{ splitId: split.splitId, setShowCopyAlert }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
