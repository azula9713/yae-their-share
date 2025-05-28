// hooks/useSplitsMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { splitsCacheDB } from "@/lib/splits-cache-layer";
import { ISplit } from "@/types/split.types";

export function useCreateSplit(userId: string) {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (splitData: {
      name: string;
      participants: Array<{ id: string; name: string }>;
      expenses: Array<{
        id: string;
        amount: number;
        description: string;
        paidBy: string;
        splitBetween: string[];
      }>;
    }) => {
      return await convex.mutation(api.splits.createSplit, {
        ...splitData,
        createdBy: userId as any,
      });
    },

    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["splits", userId] });

      // Snapshot previous value
      const previousSplits = queryClient.getQueryData(["splits", userId]);

      // Optimistically add new split
      const optimisticSplit: ISplit = {
        _id: `temp_${Date.now()}`,
        date: new Date().toISOString(),
        id: crypto.randomUUID(),
        name: variables.name,
        participants: variables.participants,
        expenses: variables.expenses,
        createdBy: userId,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        ["splits", userId, false],
        (old: ISplit[] = []) => [optimisticSplit, ...old]
      );

      return { previousSplits, optimisticSplit };
    },

    onSuccess: async (convexId) => {
      // Get the actual created split and update cache
      const actualSplit = await convex.query(api.splits.getSplitById, {
        id: convexId,
      });
      await splitsCacheDB.cacheSplit(userId, actualSplit);

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

export function useUpdateSplit(userId: string) {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: {
      id: string;
      name: string;
      participants: Array<{ id: string; name: string }>;
      expenses: Array<{
        id: string;
        amount: number;
        description: string;
        paidBy: string;
        splitBetween: string[];
      }>;
    }) => {
      await convex.mutation(api.splits.updateSplit, {
        ...variables,
        id: variables.id as any,
        updatedBy: userId as any,
      });
      return variables.id;
    },

    onMutate: async (variables) => {
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
            split._id === variables.id
              ? { ...split, ...variables, updatedAt: new Date().toISOString() }
              : split
          )
      );

      return { previousSplits };
    },

    onSuccess: async (splitId) => {
      // Update cache with fresh data
      const updatedSplit = await convex.query(api.splits.getSplitById, {
        id: splitId as any,
      });
      await splitsCacheDB.cacheSplit(userId, updatedSplit);

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

export function useDeleteSplit(userId: string) {
  const convex = useConvex();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (splitId: string) => {
      await convex.mutation(api.splits.deleteSplit, { id: splitId as any });
      return splitId;
    },

    onMutate: async (splitId) => {
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

    onSuccess: async (splitId) => {
      // Update cache
      await splitsCacheDB.markSplitDeleted(splitId);
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
