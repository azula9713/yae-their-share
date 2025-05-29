"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CreateForm from "@/components/create-split/create-form";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect } from "react";

export default function CreateEventPage() {
  const { signIn } = useAuthActions();

  const user = useQuery(api.authFunctions.currentUser);
  const isAnonymous = user?.isAnonymous;
  const userEmail = user?.email;

  useEffect(() => {
    const anonymousSignIn = () => {
      void signIn("anonymous");
    };

    if (user !== undefined && !isAnonymous && !userEmail) {
      console.log(
        "User is not anonymous and has no email, signing in anonymously."
      );
      anonymousSignIn();
    }
  }, [user]);

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-sm mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to home
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Split</CardTitle>
        </CardHeader>
        <CreateForm />
      </Card>
    </div>
  );
}
