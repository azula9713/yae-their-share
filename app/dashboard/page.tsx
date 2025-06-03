"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  MoreVertical,
  Share2,
  Edit,
  Trash2,
  Copy,
  ChevronRight,
  Clock,
  Receipt,
} from "lucide-react";
import { format } from "date-fns";
import { useGetCurrentUser } from "@/hooks/user/use-user";
import { useFetchAllSplits } from "@/hooks/split/use-split-query";

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
  const uniqueParticipants = new Set();
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

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Your Splits
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {splits.length > 0
                  ? `Managing ${splits.length} group${splits.length !== 1 ? "s" : ""} with ${
                      uniqueParticipants.size
                    } people`
                  : "Create your first expense group to get started"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/create-split">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                New Split
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        {splits.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border border-slate-200 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Total Tracked
                    </p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      ${totalAmount.toFixed(0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Total Expenses
                    </p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {totalExpenses}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      People Involved
                    </p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {uniqueParticipants.size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Groups List */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-600" />
              Your Groups
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {splits.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                  <DollarSign className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No expense groups yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                  Create your first group to start tracking shared expenses with
                  friends, family, or colleagues.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/create-split">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Split
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button
                      variant="outline"
                      className="border-slate-200 dark:border-slate-800"
                    >
                      Try Demo
                    </Button>
                  </Link>
                </div>
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
                        <div
                          className="flex items-center gap-4 flex-1 cursor-pointer"
                          onClick={() => router.push(`/split/${split.splitId}`)}
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
                        </div>

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
