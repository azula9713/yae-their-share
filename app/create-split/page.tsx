"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import CreateForm from "@/components/create-split/create-form";

export default function CreateEventPage() {
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
