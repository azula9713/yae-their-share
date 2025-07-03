import { CheckCircle } from "lucide-react";

import { Alert, AlertDescription } from "../ui/alert";


export default function CopyAlert() {
  return (
    <Alert className="mb-6 border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20">
      <CheckCircle className="text-emerald-600 size-4" />
      <AlertDescription className="text-emerald-700 dark:text-emerald-300">
        Split URL copied to clipboard! Share it with your group members.
      </AlertDescription>
    </Alert>
  );
}
