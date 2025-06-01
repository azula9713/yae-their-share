"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { IExpense, IParticipant } from "@/types/split.types";

interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (expense: Omit<IExpense, "expenseId">) => void;
  participants: IParticipant[];
  defaultPaidBy?: string;
  isEdit?: boolean;
  expenseToEdit?: IExpense;
}

export default function ExpenseDialog({
  open,
  onOpenChange,
  onAdd,
  participants,
  defaultPaidBy,
  isEdit = false,
  expenseToEdit = {
    expenseId: "",
    description: "",
    amount: 0,
    paidBy: "",
    splitBetween: [],
  },
}: Readonly<ExpenseDialogProps>) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState<string[]>([]);

  // Set default paidBy when dialog opens or defaultPaidBy changes
  useEffect(() => {
    if (open && defaultPaidBy) {
      setPaidBy(defaultPaidBy);

      // Also add this participant to the split by default
      if (!splitBetween.includes(defaultPaidBy)) {
        setSplitBetween([...splitBetween, defaultPaidBy]);
      }
    }
  }, [open, defaultPaidBy, splitBetween]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setDescription("");
      setAmount("");
      setPaidBy("");
      setSplitBetween([]);
    }
  }, [open]);

  useEffect(() => {
    if (isEdit && expenseToEdit) {
      setDescription(expenseToEdit.description);
      setAmount(expenseToEdit.amount.toString());
      setPaidBy(expenseToEdit.paidBy);
      setSplitBetween(expenseToEdit.splitBetween);
    }
  }, [isEdit, expenseToEdit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !description.trim() ||
      !amount ||
      !paidBy ||
      splitBetween.length === 0
    ) {
      return;
    }

    const parsedAmount = Number.parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    onAdd({
      description: description.trim(),
      amount: parsedAmount,
      paidBy,
      splitBetween,
    });
  };

  const addParticipantToSplit = (participantId: string) => {
    setSplitBetween([...splitBetween, participantId]);
  };

  const removeParticipantFromSplit = (participantId: string) => {
    setSplitBetween(splitBetween.filter((id) => id !== participantId));
  };

  const handleSplitAll = () => {
    setSplitBetween(participants.map((p) => p.participantId));
  };

  const handleClearSplit = () => {
    setSplitBetween([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Expense" : "Add Expense"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this expense for?"
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="paid-by">Paid By</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger id="paid-by">
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((participant) => (
                    <SelectItem key={participant.participantId} value={participant.participantId}>
                      {participant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Split Between</Label>
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSplitAll}
                  >
                    All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearSplit}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <div className="border rounded-md p-3 space-y-2">
                {participants.map((participant) => (
                  <div
                    key={participant.participantId}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`participant-${participant.participantId}`}
                      checked={splitBetween.includes(participant.participantId)}
                      onCheckedChange={(checked) =>
                        checked
                          ? addParticipantToSplit(participant.participantId)
                          : removeParticipantFromSplit(participant.participantId)
                      }
                    />
                    <Label
                      htmlFor={`participant-${participant.participantId}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {participant.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !description.trim() ||
                !amount ||
                !paidBy ||
                splitBetween.length === 0
              }
            >
              {isEdit ? "Save Changes" : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
