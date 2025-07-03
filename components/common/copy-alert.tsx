import { CheckCircle } from "lucide-react";

import { Alert, AlertDescription } from "../ui/alert";


export default function CopyAlert() {
  return (
    <Alert className="mb-6 border-primary/20 bg-primary/5">
      <CheckCircle className="text-primary size-4" />
      <AlertDescription className="text-primary">
        Split URL copied to clipboard! Share it with your group members.
      </AlertDescription>
    </Alert>
  );
}
