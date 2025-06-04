import { ISplit } from "@/types/split.types";

export function getTotalExpenses(splits: ISplit[] = []) {
  const totalExpenses = splits.reduce(
    (sum, split) => sum + split.expenses.length,
    0
  );

  return totalExpenses;
}

export const getUniqueParticipants = (splits: ISplit[] = []) => {
  const uniqueParticipants = new Set<string>();
  splits.forEach((split) => {
    split.participants.forEach((p) => uniqueParticipants.add(p.name));
  });
  return uniqueParticipants;
};
