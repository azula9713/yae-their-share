
import { Card, CardContent } from "../ui/card";

type Props = {
  icon: React.ReactNode;
  title: string;
  value: number | string;
};

export default function StatData({ icon, title, value }: Readonly<Props>) {
  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            {/* <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> */}
            {icon}
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
