"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import CopyAlert from "@/components/common/copy-alert";
import DashHeader from "@/components/common/dash-header";
import AllSplits from "@/components/dashboard/all-splits";
import QuickStats from "@/components/dashboard/quick-stats";
import { Button } from "@/components/ui/button";
import { useFetchAllSplits } from "@/hooks/split/use-split-query";
import { useGetCurrentUser } from "@/hooks/user/use-user";

export default function DashboardPage() {
  const router = useRouter();
  const { data: user } = useGetCurrentUser();
  const {
    data: splits = [],
    isLoading: splitsLoading,
    error: splitsError,
  } = useFetchAllSplits({ userId: user?.id! });

  const [showCopyAlert, setShowCopyAlert] = useState(false);

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
  const totalAmount = splits.length;
  const uniqueParticipants = new Set<string>();
  splits.forEach((split) => {
    split.participants.forEach((p) => uniqueParticipants.add(p.name));
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {showCopyAlert && <CopyAlert />}
        <DashHeader {...{ splitsLength: splits.length, uniqueParticipants }} />

        {splits.length > 0 && (
          <QuickStats {...{ totalAmount, totalExpenses, uniqueParticipants }} />
        )}

        {/* Groups List */}
        <AllSplits {...{ splits, setShowCopyAlert }} />
      </div>
    </div>
  );
}
