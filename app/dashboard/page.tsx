"use client";

import { useEffect, useState } from "react";

import {
  AnonymousUpgradePrompt,
  useAnonymousUpgradePrompt,
} from "@/components/common/anonymous-upgrade-prompt";
import CopyAlert from "@/components/common/copy-alert";
import DashHeader from "@/components/common/dash-header";
import AllSplits from "@/components/dashboard/all-splits";
import DashboardError from "@/components/dashboard/dashboard-error";
import DashboardLoading from "@/components/dashboard/dashboard-loading";
import QuickStats from "@/components/dashboard/quick-stats";
import { useFetchAllSplits } from "@/hooks/split/use-split-query";
import { useGetCurrentUser } from "@/hooks/user/use-user";
import {
  getTotalExpenses,
  getUniqueParticipants,
} from "@/utils/dashboard/dashboard-stats";

export default function DashboardPage() {
  const { data: user } = useGetCurrentUser();
  const {
    data: splits = [],
    isLoading: splitsLoading,
    error: splitsError,
  } = useFetchAllSplits({ userId: user?.id });

  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const { isOpen, showPrompt, hidePrompt, isAnonymous } = useAnonymousUpgradePrompt();

  const totalExpenses = getTotalExpenses(splits);
  const totalAmount = splits.length;
  const uniqueParticipants = getUniqueParticipants(splits);

  // Show upgrade prompt for anonymous users with data after 3 seconds
  useEffect(() => {
    if (isAnonymous && splits.length > 0) {
      const timer = setTimeout(() => {
        showPrompt();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAnonymous, splits.length, showPrompt]);

  if (splitsLoading) {
    return <DashboardLoading />;
  }

  if (splitsError) {
    return <DashboardError />;
  }

  return (
    <>
      {showCopyAlert && <CopyAlert />}
      
      <AnonymousUpgradePrompt
        isOpen={isOpen}
        onClose={hidePrompt}
        title="Save Your Expense Data"
        description="You have created expense splits! Sign in to save them permanently and access the full dashboard."
        feature="Full Dashboard Access"
      />

      <DashHeader {...{ splitsLength: splits.length, uniqueParticipants }} />

      {splits.length > 0 && (
        <QuickStats {...{ totalAmount, totalExpenses, uniqueParticipants }} />
      )}

      <AllSplits {...{ splits, setShowCopyAlert }} />
    </>
  );
}
