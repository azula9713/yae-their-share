"use client";

import type React from "react";

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
import type { Expense, Participant } from "@/app/split/[id]/page";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (expense: Omit<Expense, "id">) => void;
  participants: Participant[];
  defaultPaidBy?: string;
}

export default function AddExpenseDialog({
  open,
  onOpenChange,
  onAdd,
  participants,
  defaultPaidBy,
}: AddExpenseDialogProps) {
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

  const handleSplitToggle = (participantId: string, checked: boolean) => {
    if (checked) {
      setSplitBetween([...splitBetween, participantId]);
    } else {
      setSplitBetween(splitBetween.filter((id) => id !== participantId));
    }
  };

  const handleSplitAll = () => {
    setSplitBetween(participants.map((p) => p.id));
  };

  const handleClearSplit = () => {
    setSplitBetween([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
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
                    <SelectItem key={participant.id} value={participant.id}>
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
                    key={participant.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`participant-${participant.id}`}
                      checked={splitBetween.includes(participant.id)}
                      onCheckedChange={(checked) =>
                        handleSplitToggle(participant.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`participant-${participant.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {participant.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
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
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
