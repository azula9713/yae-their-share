import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";

import { api } from "@/convex/_generated/api";
import { ISplit } from "@/types/split.types";

export function useCreateSplit(userId?: string) {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (splitData: {
      splitId: string;
      name: string;
      date: string | undefined; // Optional date, can be undefined
      participants: Array<{ participantId: string; name: string }>;
      expenses: Array<{
        expenseId: string;
        amount: number;
        description: string;
        paidBy: string;
        splitBetween: string[];
      }>;
    }) => {
      if (!userId) {
        throw new Error("User ID is required to create a split");
      }
      return await convex.mutation(api.splits.createSplit, {
        ...splitData,
        createdBy: userId,
      });
    },

    onMutate: async (variables) => {
      if (!userId) return;
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["splits", userId] });

      // Snapshot previous value
      const previousSplits = queryClient.getQueryData(["splits", userId]);

      // Optimistically add new split
      const optimisticSplit: ISplit = {
        _id: `temp_${Date.now()}`,
        date: variables.date ?? "",
        splitId: variables.splitId,
        name: variables.name,
        participants: variables.participants,
        expenses: variables.expenses,
        isPrivate: false,
        createdBy: userId,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        ["splits", userId, false],
        (old: ISplit[] = []) => [optimisticSplit, ...old]
      );

      return { previousSplits, optimisticSplit };
    },

    onSuccess: async () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["splits", userId] });
    },

    onError: (err, variables, context) => {
      // Rollback optimistic update
      if (context?.previousSplits) {
        queryClient.setQueryData(
          ["splits", userId, false],
          context.previousSplits
        );
      }
    },
  });
}

export function useUpdateSplit(userId?: string) {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: {
      splitId: string;
      name: string;
      date: string; // Optional date, can be undefined
      participants: Array<{ participantId: string; name: string }>;
      expenses: Array<{
        expenseId: string;
        amount: number;
        description: string;
        paidBy: string;
        splitBetween: string[];
      }>;
    }) => {
      if (!userId) {
        throw new Error("User ID is required to update a split");
      }
      await convex.mutation(api.splits.updateSplit, {
        ...variables,
        splitId: variables.splitId,
        updatedBy: userId,
        isPrivate: false, // Add missing required field
      });
      return variables.splitId;
    },
    onMutate: async (variables) => {
      if (!userId) return;
      
      await queryClient.cancelQueries({ queryKey: ["splits", userId] });

      const previousSplits = queryClient.getQueryData([
        "splits",
        userId,
        false,
      ]);

      // Optimistically update
      queryClient.setQueryData(
        ["splits", userId, false],
        (old: ISplit[] = []) =>
          old.map((split) =>
            split._id === variables.splitId
              ? { ...split, ...variables, updatedAt: new Date().toISOString() }
              : split
          )
      );

      return { previousSplits };
    },

    onSuccess: async (splitId) => {
      queryClient.invalidateQueries({ queryKey: ["split", splitId] });
      queryClient.invalidateQueries({ queryKey: ["splits", userId] });
    },

    onError: (err, variables, context) => {
      if (context?.previousSplits) {
        queryClient.setQueryData(
          ["splits", userId, false],
          context.previousSplits
        );
      }
    },
  });
}

export function useDeleteSplit(userId?: string) {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (splitId: string) => {
      await convex.mutation(api.splits.deleteSplit, { splitId });
      return splitId;
    },

    onMutate: async (splitId) => {
      if (!userId) return;
      
      await queryClient.cancelQueries({ queryKey: ["splits", userId] });

      const previousSplits = queryClient.getQueryData([
        "splits",
        userId,
        false,
      ]);

      // Optimistically mark as deleted (remove from active list)
      queryClient.setQueryData(
        ["splits", userId, false],
        (old: ISplit[] = []) => old.filter((split) => split._id !== splitId)
      );

      return { previousSplits };
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["splits", userId] });
    },

    onError: (err, splitId, context) => {
      if (context?.previousSplits) {
        queryClient.setQueryData(
          ["splits", userId, false],
          context.previousSplits
        );
      }
    },
  });
}
