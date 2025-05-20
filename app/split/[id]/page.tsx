"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddParticipantDialog from "@/components/add-participant-dialog";
import AddExpenseDialog from "@/components/add-expense-dialog";
import { ISplit } from "@/types/split.types";
import useSplit from "@/hooks/use-split";
import SubHeader from "@/components/common/sub-header";
import Participants from "@/components/split/participants";
import Expenses from "@/components/split/expenses";
import Summary from "@/components/split/summary";

export default function EventPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  // Unwrap params using React.use()
  const unwrappedParams = params instanceof Promise ? use(params) : params;
  const eventId = unwrappedParams.id;

  const router = useRouter();

  const {
    split,
    setSplit,
    isAddParticipantOpen,
    setIsAddParticipantOpen,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    addExpense,
    removeExpense,
    addParticipant,
    removeParticipant,
  } = useSplit();

  useEffect(() => {
    // Load split data from localStorage
    try {
      const events = JSON.parse(
        localStorage.getItem("theirShareEvents") || "[]"
      );
      const currentSplit = events.find((e: ISplit) => e.id === eventId);

      if (!currentSplit) {
        console.error("ISplit not found:", eventId);
        router.push("/?error=split-not-found");
        return;
      }

      setSplit(currentSplit);
    } catch (error) {
      console.error("Error loading split:", error);
      router.push("/?error=loading-error");
    }
  }, [eventId, router]);

  if (!split) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
       <SubHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading split data...</p>
            <p className="text-sm text-muted-foreground mt-2">
              ISplit ID: {eventId}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="participants" className="mt-6">
          <Participants {...{split, addExpense, removeParticipant, setIsAddParticipantOpen}} />
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
         <Expenses {...{split, removeExpense, setIsAddExpenseOpen}} />
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <Summary {...{split}} />
        </TabsContent>
      </Tabs>

      <AddParticipantDialog
        open={isAddParticipantOpen}
        onOpenChange={setIsAddParticipantOpen}
        onAdd={addParticipant}
      />

      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onAdd={addExpense}
        participants={split.participants}
      />
    </div>
  );
}
