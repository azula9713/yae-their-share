
import { Card, CardContent } from "../ui/card";

type Props = {
  icon: React.ReactNode;
  title: string;
  value: number | string;
};

export default function StatData({ icon, title, value }: Readonly<Props>) {
  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted flex items-center justify-center size-10">
            {/* <DollarSign className="text-emerald-600 dark:text-emerald-400 size-5" /> */}
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {title}
            </p>
            <p className="text-xl font-bold">
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
