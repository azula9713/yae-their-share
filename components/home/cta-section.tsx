import Link from "next/link";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function CTASection() {
  return (
    <div className="text-center">
      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50 dark:bg-slate-900">
        <CardContent className="pt-6 pb-8 px-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Ready to get started?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Join thousands who trust Their Share for transparent, fair expense
            management.
          </p>
          <Link href="/create-split">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Create Your First Group
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
