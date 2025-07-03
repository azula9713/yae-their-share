import { DollarSign, Receipt, Users } from "lucide-react";

import StatData from "./stat-data";

type Props = {
  totalAmount: number;
  totalExpenses: number;
  uniqueParticipants: Set<string>;
};

export default function QuickStats({
  totalAmount,
  totalExpenses,
  uniqueParticipants,
}: Readonly<Props>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatData
        {...{
          icon: (
            <DollarSign className="text-emerald-600 dark:text-emerald-400 size-5" />
          ),
          title: "Total Splits",
          value: totalAmount.toFixed(0),
        }}
      />

      <StatData
        {...{
          icon: (
            <Receipt className="text-blue-600 dark:text-blue-400 size-5" />
          ),
          title: "Total Expenses",
          value: totalExpenses,
        }}
      />

      <StatData
        {...{
          icon: (
            <Users className="text-purple-600 dark:text-purple-400 size-5" />
          ),
          title: "People Involved",
          value: uniqueParticipants.size,
        }}
      />
    </div>
  );
}
