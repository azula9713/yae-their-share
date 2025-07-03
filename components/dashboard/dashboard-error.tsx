import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

export default function DashboardError() {
  const router = useRouter();
  return (
    <div className="text-center">
      <p className="text-muted-foreground">
        Unable to load dashboard. Please try logging in again.
      </p>
      <Button
        onClick={() => router.push("/login")}
        className="mt-4"
      >
        Go to Login
      </Button>
    </div>
  );
}
