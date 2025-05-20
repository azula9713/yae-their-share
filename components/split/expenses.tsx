import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import ExpensesList from "../expenses-list";
import { ISplit } from "@/types/split.types";
import { Plus } from "lucide-react";

type Props = {
    split: ISplit;
    removeExpense: (id: string) => void;
    setIsAddExpenseOpen: (open: boolean) => void;
};

export default function Expenses({
    split,
    removeExpense,
    setIsAddExpenseOpen,
}: Readonly<Props>) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <CardTitle>Expenses</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => setIsAddExpenseOpen(true)}
          disabled={split.participants.length < 1}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        <ExpensesList
          expenses={split.expenses}
          participants={split.participants}
          onRemove={removeExpense}
        />
      </CardContent>
    </Card>
  );
}
