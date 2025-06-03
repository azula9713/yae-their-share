"use client";

import { format } from "date-fns";
import { CheckCircle } from "lucide-react";
import { use, useState } from "react";

import AddParticipantDialog from "@/components/add-participant-dialog";
import ShareMenu from "@/components/common/share-menu";
import ExpenseDialog from "@/components/expense-dialog";
import Participants from "@/components/split/participants";
import Summary from "@/components/split/summary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSplit from "@/hooks/split/use-split";

export default function EventPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  // Unwrap params using React.use()
  const unwrappedParams = params instanceof Promise ? use(params) : params;
  const splitId = unwrappedParams.id;

  const {
    split,
    isLoading,
    error,
    isAddParticipantOpen,
    setIsAddParticipantOpen,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    addExpense,
    addParticipant,
    editParticipant,
    removeParticipant,
  } = useSplit({ splitId });

  const [showCopyAlert, setShowCopyAlert] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading split data...</p>
          <p className="text-sm text-muted-foreground mt-2">
            ISplit ID: {splitId}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500">Error loading split data.</p>
          <p className="text-sm text-muted-foreground mt-2">
            ISplit ID: {splitId}
          </p>
        </div>
      </div>
    );
  }

  if (!split) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-red-500">Split not found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Copy URL Success Alert */}
      {showCopyAlert && (
        <Alert className="mb-6 border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20">
          <CheckCircle className="size-4 text-emerald-600" />
          <AlertDescription className="text-emerald-700 dark:text-emerald-300">
            URL copied to clipboard! Share it with your group members.
          </AlertDescription>
        </Alert>
      )}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">{split.name}</h1>

          {/* share */}
          <ShareMenu {...{ splitId, setShowCopyAlert }} />
        </div>

        {split.date && (
          <p className="text-muted-foreground">
            {format(new Date(split.date), "MMMM d, yyyy")}
          </p>
        )}
      </div>

      <Tabs defaultValue="participants">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="participants">Participants</TabsTrigger>
          {/* <TabsTrigger value="expenses">Expenses</TabsTrigger> */}
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="participants" className="mt-6">
          <Participants
            {...{
              split,
              addExpense,
              removeParticipant,
              editParticipant,
              setIsAddParticipantOpen,
            }}
          />
        </TabsContent>
        {/* <TabsContent value="expenses" className="mt-6">
          <Expenses {...{ split, removeExpense, setIsAddExpenseOpen }} />
        </TabsContent> */}
        <TabsContent value="summary" className="mt-6">
          <Summary {...{ split }} />
        </TabsContent>
      </Tabs>

      <AddParticipantDialog
        open={isAddParticipantOpen}
        onOpenChange={setIsAddParticipantOpen}
        onAdd={addParticipant}
      />

      <ExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onAdd={addExpense}
        participants={split.participants}
      />
    </>
  );
}
