"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react"; // Add this import for React.use()
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus } from "lucide-react";
import { format } from "date-fns";
import ParticipantsList from "@/components/participants-list";
import ExpensesList from "@/components/expenses-list";
import Summary from "@/components/summary";
import AddParticipantDialog from "@/components/add-participant-dialog";
import AddExpenseDialog from "@/components/add-expense-dialog";

export interface Participant {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // participant id
  splitBetween: string[]; // array of participant ids
}

export interface Event {
  id: string;
  name: string;
  date: string | null;
  participants: Participant[];
  expenses: Expense[];
}

export default function EventPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  // Unwrap params using React.use()
  const unwrappedParams = params instanceof Promise ? use(params) : params;
  const eventId = unwrappedParams.id;

  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  useEffect(() => {
    // Load event data from localStorage
    try {
      const events = JSON.parse(
        localStorage.getItem("theirShareEvents") || "[]"
      );
      const currentEvent = events.find((e: Event) => e.id === eventId);

      if (!currentEvent) {
        console.error("Event not found:", eventId);
        router.push("/?error=event-not-found");
        return;
      }

      setEvent(currentEvent);
    } catch (error) {
      console.error("Error loading event:", error);
      router.push("/?error=loading-error");
    }
  }, [eventId, router]);

  const saveEvent = (updatedEvent: Event) => {
    // Update event in localStorage
    const events = JSON.parse(localStorage.getItem("theirShareEvents") || "[]");
    const updatedEvents = events.map((e: Event) =>
      e.id === updatedEvent.id ? updatedEvent : e
    );

    localStorage.setItem("theirShareEvents", JSON.stringify(updatedEvents));
    setEvent(updatedEvent);
  };

  const addParticipant = (name: string) => {
    if (!event) return;

    const newParticipant: Participant = {
      id: Date.now().toString(),
      name,
    };

    const updatedEvent = {
      ...event,
      participants: [...event.participants, newParticipant],
    };

    saveEvent(updatedEvent);
    setIsAddParticipantOpen(false);
  };

  const removeParticipant = (id: string) => {
    if (!event) return;

    // Remove participant
    const updatedParticipants = event.participants.filter((p) => p.id !== id);

    // Remove expenses paid by this participant
    const updatedExpenses = event.expenses.filter((e) => e.paidBy !== id);

    // Remove this participant from split lists
    const finalExpenses = updatedExpenses.map((expense) => ({
      ...expense,
      splitBetween: expense.splitBetween.filter((pid) => pid !== id),
    }));

    const updatedEvent = {
      ...event,
      participants: updatedParticipants,
      expenses: finalExpenses,
    };

    saveEvent(updatedEvent);
  };

  const addExpense = (expense: Omit<Expense, "id">) => {
    if (!event) return;

    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };

    const updatedEvent = {
      ...event,
      expenses: [...event.expenses, newExpense],
    };

    saveEvent(updatedEvent);
    setIsAddExpenseOpen(false);
  };

  const removeExpense = (id: string) => {
    if (!event) return;

    const updatedExpenses = event.expenses.filter((e) => e.id !== id);

    const updatedEvent = {
      ...event,
      expenses: updatedExpenses,
    };

    saveEvent(updatedEvent);
  };

  if (!event) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="flex items-center text-sm mb-6 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to home
        </Link>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading event data...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Event ID: {eventId}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-sm mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to home
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        {event.date && (
          <p className="text-muted-foreground">
            {format(new Date(event.date), "MMMM d, yyyy")}
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
          <Card>
            <CardHeader className="flex flex-row items-center">
              <CardTitle>Participants</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => setIsAddParticipantOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              <ParticipantsList
                participants={event.participants}
                expenses={event.expenses}
                onRemove={removeParticipant}
                onAddExpense={addExpense}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <CardTitle>Expenses</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => setIsAddExpenseOpen(true)}
                disabled={event.participants.length < 1}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              <ExpensesList
                expenses={event.expenses}
                participants={event.participants}
                onRemove={removeExpense}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Who Owes Whom</CardTitle>
            </CardHeader>
            <CardContent>
              <Summary
                expenses={event.expenses}
                participants={event.participants}
              />
            </CardContent>
          </Card>
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
        participants={event.participants}
      />
    </div>
  );
}
