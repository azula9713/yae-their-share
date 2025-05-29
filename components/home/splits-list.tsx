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
import { Heart } from "lucide-react";
import { Badge } from "../ui/badge";
import { useSplitsCacheManager } from "@/hooks/split/use-split-cache-manager";
import { useCachedSplits } from "@/hooks/split/use-cached-splits";

export default function SplitsList() {
  const user = useQuery(api.authFunctions.currentUser);

  const userId = user?.id;

  useSplitsCacheManager();

  const {
    data: splits = [],
    isLoading,
    error,
    refetch,
  } = useCachedSplits({
    userId: userId!,
    includeDeleted: false,
    maxAge: 5 * 60 * 1000, // 5 minutes
    staleWhileRevalidate: true,
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

  if (!splits || splits.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Splits</h2>
        <p className="text-muted-foreground">You have no splits yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-16">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Heart className="h-6 w-6 text-orange-500" />
              Your Shared Moments
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Continue the memories you&apos;re making together
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="text-sm bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-300"
          >
            {splits.length} adventure
            {splits.length !== 1 ? "s" : ""}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {splits.slice(0, 6).map((split) => {
              return <SplitItem key={split.id} split={split} />;
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
