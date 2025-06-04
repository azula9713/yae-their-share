import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

export default function DashboardError() {
  const router = useRouter();
  return (
    <div className="text-center">
      <p className="text-slate-600 dark:text-slate-400">
        Unable to load dashboard. Please try logging in again.
      </p>
      <Button
        onClick={() => router.push("/login")}
        className="mt-4 bg-emerald-600 hover:bg-emerald-700"
      >
        Go to Login
      </Button>
    </div>
  );
}
