"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ISplit } from "@/types/split.types";
import SplitItem from "./split-item";

export default function SplitsList() {
  const [splits, setSplits] = useState<ISplit[]>([]);

  useEffect(() => {
    try {
      const storedEvents: ISplit[] = JSON.parse(
        localStorage.getItem("theirShareEvents") || "[]"
      );
      setSplits(storedEvents);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  }, []);

  if (splits.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Your Splits</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {splits.map((split) => (
          <SplitItem {...{ split }} key={split.id} />
        ))}

        {splits.length > 4 && (
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
