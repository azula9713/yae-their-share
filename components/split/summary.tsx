import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ISplit } from "@/types/split.types";
import ExpensesSummary from "../expenses-summary";

type Props = {
    split:ISplit
};

export default function Summary({split}: Readonly<Props>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Who Owes Whom</CardTitle>
      </CardHeader>
      <CardContent>
        <ExpensesSummary expenses={split.expenses} participants={split.participants} />
      </CardContent>
    </Card>
  );
}
