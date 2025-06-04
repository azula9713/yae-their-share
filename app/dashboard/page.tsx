"use client";

import { useState } from "react";

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
  } = useFetchAllSplits({ userId: user?.id! });

  const [showCopyAlert, setShowCopyAlert] = useState(false);

  const totalExpenses = getTotalExpenses(splits);
  const totalAmount = splits.length;
  const uniqueParticipants = getUniqueParticipants(splits);

  if (splitsLoading) {
    return <DashboardLoading />;
  }

  if (splitsError) {
    return <DashboardError />;
  }

  return (
    <>
      {showCopyAlert && <CopyAlert />}
      <DashHeader {...{ splitsLength: splits.length, uniqueParticipants }} />

      {splits.length > 0 && (
        <QuickStats {...{ totalAmount, totalExpenses, uniqueParticipants }} />
      )}

      <AllSplits {...{ splits, setShowCopyAlert }} />
    </>
  );
}
