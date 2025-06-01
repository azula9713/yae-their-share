"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import ParticipantsList from "./participants-list";
import { ISplit } from "@/types/split.types";
import { Plus } from "lucide-react";

type Props = {
  split: ISplit;
  setIsAddParticipantOpen: (open: boolean) => void;
};

export default function Participants({
  split,
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
          <Plus className="size-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        <ParticipantsList
          {...{
            participants: split.participants,
            expenses: split.expenses,
            splitId: split.splitId,
          }}
        />
      </CardContent>
    </Card>
  );
}
