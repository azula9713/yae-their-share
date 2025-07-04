"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect } from "react";

import SubHeader from "@/components/common/sub-header";
import CreateForm from "@/components/create-split/create-form";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCurrentUser } from "@/hooks/user/use-user";

export default function CreateEventPage() {
  const { signIn } = useAuthActions();

  const { data: user, error, refetch } = useGetCurrentUser();
  const isAnonymous = user?.isAnonymous;
  const userEmail = user?.email;

  useEffect(() => {
    const anonymousSignIn = () => {
      void signIn("anonymous").finally(() => {
        refetch();
      }
      );
    };

    if (user !== undefined && !isAnonymous && !userEmail && !error) {
      anonymousSignIn();
    }
  }, [error, isAnonymous, refetch, signIn, user, userEmail]);

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
     <SubHeader/>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Split</CardTitle>
        </CardHeader>
        <CreateForm />
      </Card>
    </div>
  );
}
