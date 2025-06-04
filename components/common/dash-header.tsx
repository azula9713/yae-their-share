import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "../ui/button";

type Props = {
  splitsLength: number;
  uniqueParticipants: Set<string>;
};

export default function DashHeader({
  splitsLength,
  uniqueParticipants,
}: Readonly<Props>) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Your Splits
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {(() => {
              const groupLabel = splitsLength !== 1 ? "s" : "";
              return splitsLength > 0
                ? `Managing ${splitsLength} group${groupLabel} with ${uniqueParticipants.size} people`
                : "Let's start by creating your first split!";
            })()}
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
  );
}
