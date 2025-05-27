"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import SplitItem from "./split-item";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SplitsList() {
  const user = useQuery(api.authFunctions.currentUser);

  const fetchedSplits = useQuery(api.splits.getSplitsByUserId, {
    userId: user?.id as string,
  });

  if (!user) return null;

  if (!fetchedSplits || fetchedSplits.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Splits</h2>
        <p className="text-muted-foreground">You have no splits yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Your Splits</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {fetchedSplits.map((split) => (
          <SplitItem {...{ split }} key={split.id} />
        ))}

        {fetchedSplits.length > 4 && (
          <Link href="/splits" className="block">
            <Button variant="link" className="text-center" size="sm">
              View All Splits
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
