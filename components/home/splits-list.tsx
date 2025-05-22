"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import SplitItem from "./split-item";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SplitsList() {
  const splits = useQuery(api.splits.get) ;

  if (!splits || splits.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Your Splits</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {splits.map((split) => (
          <SplitItem {...{ split }} key={split.id} />
        ))}

        {splits.length! > 4 && (
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
