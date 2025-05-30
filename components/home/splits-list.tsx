"use client";

import { Button } from "../ui/button";
import SplitItem from "./split-item";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { useFetchAllSplits } from "@/hooks/split/use-split-query";

export default function SplitsList() {
  const user = useQuery(api.authFunctions.currentUser);

  const userId = user?.id;

  const {
    data: splits = [],
    isLoading,
    error,
    refetch,
  } = useFetchAllSplits({
    userId: userId!,
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Splits</h2>
        <p className="text-muted-foreground">Loading your adventures...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Splits</h2>
        <p className="text-red-500">
          Error loading your adventures. Please try again later.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-16">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Recent Splits
              </CardTitle>
              <Badge
                variant="outline"
                className="text-sm bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-300"
              >
                {splits.length} split
                {splits.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Access your latest adventures and see how you shared the costs
              with friends.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {splits.slice(0, 6).map((split) => {
              return <SplitItem key={split.splitId} split={split} />;
            })}
          </div>

          {splits.length > 6 && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                size="sm"
                className="border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-300"
              >
                View All Adventures ({splits.length})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
