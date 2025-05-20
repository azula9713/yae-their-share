import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import ParticipantsList from "../participants-list";
import { IExpense, ISplit } from "@/types/split.types";
import { Plus } from "lucide-react";

type Props = {
  split: ISplit;
  addExpense: (expense: Omit<IExpense, "id">) => void;
  removeParticipant: (id: string) => void;
  setIsAddParticipantOpen: (open: boolean) => void;
};

export default function Participants({
  split,
  addExpense,
  removeParticipant,
  setIsAddParticipantOpen,
}: Readonly<Props>) {
  return (
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
          participants={split.participants}
          expenses={split.expenses}
          onRemove={removeParticipant}
          onAddExpense={addExpense}
        />
      </CardContent>
    </Card>
  );
}
