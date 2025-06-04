"use client";

import { format } from "date-fns";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Copy,
  DollarSign,
  Edit,
  MoreVertical,
  Receipt,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import DashHeader from "@/components/common/dash-header";
import QuickStats from "@/components/dashboard/quick-stats";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFetchAllSplits } from "@/hooks/split/use-split-query";
import { useGetCurrentUser } from "@/hooks/user/use-user";

interface UserData {
  id: string;
  email: string;
  name: string;
  picture?: string;
  loginTime: string;
  provider?: string;
  syncedAt?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: user } = useGetCurrentUser();
  const {
    data: splits = [],
    isLoading: splitsLoading,
    error: splitsError,
  } = useFetchAllSplits({ userId: user?.id! });

  const [showCopyAlert, setShowCopyAlert] = useState(false);

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

  if (splitsLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">
                Loading your dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (splitsError) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Unable to load dashboard. Please try logging in again.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate simple stats
  const totalExpenses = splits.reduce(
    (sum, split) => sum + split.expenses.length,
    0
  );
  const totalAmount = splits.reduce(
    (sum, split) =>
      sum +
      split.expenses.reduce(
        (eventSum, expense) => eventSum + expense.amount,
        0
      ),
    0
  );
  const uniqueParticipants = new Set<string>();
  splits.forEach((split) => {
    split.participants.forEach((p) => uniqueParticipants.add(p.name));
  });

  // Sort splits by most recent activity (expenses added)
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
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Copy Success Alert */}
        {showCopyAlert && (
          <Alert className="mb-6 border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-700 dark:text-emerald-300">
              Split URL copied to clipboard! Share it with your group members.
            </AlertDescription>
          </Alert>
        )}
        <DashHeader {...{ splitsLength: splits.length, uniqueParticipants }} />

        {/* Quick Stats */}
        {splits.length > 0 && (
          <QuickStats {...{totalAmount, totalExpenses, uniqueParticipants}}/>
        )}

        {/* Groups List */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-600" />
              Recent Splits
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {splits.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                  <DollarSign className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No splits yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                  Create your first split to start tracking shared expenses with
                  friends, family, or colleagues.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
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
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/split/${split.splitId}`}
                          className="flex items-center gap-4 flex-1 cursor-pointer"
                        >
                          <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-medium text-slate-900 dark:text-white">
                                {split.name}
                              </h3>
                              <div className="flex gap-2">
                                {hasExpenses && (
                                  <Badge
                                    variant="default"
                                    className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-xs"
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
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                              <div className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                <span>{split.participants.length} people</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Receipt className="h-3.5 w-3.5" />
                                <span>{split.expenses.length} expenses</span>
                              </div>
                              {hasExpenses && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3.5 w-3.5" />
                                  <span>${totalAmount.toFixed(0)} total</span>
                                </div>
                              )}
                              {split.date && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>
                                    {format(
                                      new Date(split.date),
                                      "MMM d, yyyy"
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        </Link>

                        {/* Split Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 ml-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/split/${split.splitId}`)
                              }
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Split
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCopyGroupUrl(split.splitId)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Share Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                const url = `${window.location.origin}/split/${split.splitId}`;
                                if (navigator.share) {
                                  navigator.share({
                                    title: `Their Share - ${split.name}`,
                                    text: `Check out our expense split for "${split.name}"`,
                                    url: url,
                                  });
                                } else {
                                  handleCopyGroupUrl(split.splitId);
                                }
                              }}
                            >
                              <Share2 className="h-4 w-4 mr-2" />
                              Share Split
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              // onClick={() => handleDeleteGroup(split.splitId)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Split
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
