"use client";

import { format } from "date-fns";
import { use } from "react";

import AddParticipantDialog from "@/components/add-participant-dialog";
import SubHeader from "@/components/common/sub-header";
import ExpenseDialog from "@/components/expense-dialog";
import Participants from "@/components/split/participants";
import Summary from "@/components/split/summary";
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

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <SubHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading split data...</p>
            <p className="text-sm text-muted-foreground mt-2">
              ISplit ID: {splitId}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <SubHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500">Error loading split data.</p>
            <p className="text-sm text-muted-foreground mt-2">
              ISplit ID: {splitId}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!split) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <SubHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-red-500">Split not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-2 md:px-4 py-8">
      <SubHeader />
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{split.name}</h1>
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
    </div>
  );
}
