"use client";

import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";

export default function ErrorMessage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (!error) return null;

  const errorMessages = {
    "split-not-found": "The split you were looking for could not be found.",
    "loading-error": "There was an error loading the split data.",
    default: "An error occurred. Please try again.",
  };

  const message =
    errorMessages[error as keyof typeof errorMessages] || errorMessages.default;

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}