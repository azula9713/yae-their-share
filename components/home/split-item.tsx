import { ISplit } from "@/types/split.types";
import Link from "next/link";
import React from "react";

type Props = {
  split: ISplit;
};

export default function SplitItem({ split }: Props) {
  return (
    <Link key={split.id} href={`/split/${split.id}`} className="block">
      <div className="border rounded-lg p-4 hover:border-primary transition-colors">
        <h3 className="font-medium">{split.name}</h3>
        {split.date && (
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(split.date).toLocaleDateString()}
          </p>
        )}
        <div className="flex justify-between mt-2 text-sm">
          <span>{split.participants.length} participants</span>
          <span>{split.expenses.length} expenses</span>
        </div>
      </div>
    </Link>
  );
}
