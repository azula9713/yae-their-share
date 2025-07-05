import { useEffect, useState, useCallback, useRef } from "react";
import { SyncEngine, ISyncStatus, ISyncConfig } from "@/lib/db/sync-engine";
import { ILocalSplit } from "@/lib/db";
import { ISplit, IParticipant, IExpense } from "@/types/split.types";

// Hook for managing sync engine
export function useSyncEngine(config: ISyncConfig) {
  const [syncEngine] = useState(() => new SyncEngine(config));
  const [status, setStatus] = useState<ISyncStatus>({
    isOnline: true,
    lastSyncTime: null,
    pendingOperations: 0,
    isSyncing: false,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const initializeSync = async () => {
      try {
        await syncEngine.start();
        if (mounted) {
          const initialStatus = await syncEngine.getStatus();
          setStatus(initialStatus);
        }
      } catch (error) {
        console.error("Failed to initialize sync engine:", error);
        if (mounted) {
          setStatus((prev) => ({ ...prev, error: String(error) }));
        }
      }
    };

    // Set up status listener
    const unsubscribe = syncEngine.onStatusChange((newStatus) => {
      if (mounted) {
        setStatus(newStatus);
      }
    });

    initializeSync();

    return () => {
      mounted = false;
      unsubscribe();
      syncEngine.stop();
    };
  }, [syncEngine]);

  const forceSync = useCallback(async () => {
    try {
      await syncEngine.performSync();
    } catch (error) {
      console.error("Force sync failed:", error);
    }
  }, [syncEngine]);

  return {
    syncEngine,
    status,
    forceSync,
  };
}

// Hook for splits data with local-first approach
export function useSplits(syncEngine: SyncEngine | null, userId?: string) {
  const [splits, setSplits] = useState<ILocalSplit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSplits = useCallback(async () => {
    if (!syncEngine) return;

    try {
      setLoading(true);
      const allSplits = await syncEngine.getAllSplits(userId);
      setSplits(allSplits);
      setError(null);
    } catch (err) {
      setError(String(err));
      console.error("Failed to load splits:", err);
    } finally {
      setLoading(false);
    }
  }, [syncEngine, userId]);

  useEffect(() => {
    refreshSplits();
  }, [refreshSplits]);

  const createSplit = useCallback(
    async (splitData: {
      splitId: string;
      name: string;
      participants: IParticipant[];
      expenses: IExpense[];
      createdBy: string;
      date?: string;
      isPrivate?: boolean;
    }) => {
      if (!syncEngine) throw new Error("Sync engine not available");

      const split: Omit<ISplit, "_id" | "_creationTime"> = {
        splitId: splitData.splitId,
        name: splitData.name,
        participants: splitData.participants,
        expenses: splitData.expenses,
        createdBy: splitData.createdBy,
        date: splitData.date || new Date().toISOString(),
        isPrivate: splitData.isPrivate || false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: splitData.createdBy,
      };

      await syncEngine.createSplit(split);
      await refreshSplits();
    },
    [syncEngine, refreshSplits]
  );

  const updateSplit = useCallback(
    async (splitId: string, updates: Partial<ISplit>) => {
      if (!syncEngine) throw new Error("Sync engine not available");

      await syncEngine.updateSplit(splitId, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      await refreshSplits();
    },
    [syncEngine, refreshSplits]
  );

  const deleteSplit = useCallback(
    async (splitId: string) => {
      if (!syncEngine) throw new Error("Sync engine not available");

      await syncEngine.deleteSplit(splitId);
      await refreshSplits();
    },
    [syncEngine, refreshSplits]
  );

  const getSplitById = useCallback(
    async (splitId: string) => {
      if (!syncEngine) return null;
      return await syncEngine.getSplitById(splitId);
    },
    [syncEngine]
  );

  return {
    splits,
    loading,
    error,
    createSplit,
    updateSplit,
    deleteSplit,
    getSplitById,
    refresh: refreshSplits,
  };
}

// Hook for a specific split
export function useSplit(syncEngine: SyncEngine | null, splitId: string) {
  const [split, setSplit] = useState<ILocalSplit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSplit = useCallback(async () => {
    if (!syncEngine || !splitId) return;

    try {
      setLoading(true);
      const splitData = await syncEngine.getSplitById(splitId);
      setSplit(splitData || null);
      setError(null);
    } catch (err) {
      setError(String(err));
      console.error("Failed to load split:", err);
    } finally {
      setLoading(false);
    }
  }, [syncEngine, splitId]);

  useEffect(() => {
    refreshSplit();
  }, [refreshSplit]);

  const updateSplit = useCallback(
    async (updates: Partial<ISplit>) => {
      if (!syncEngine || !splitId)
        throw new Error("Sync engine or splitId not available");

      await syncEngine.updateSplit(splitId, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      await refreshSplit();
    },
    [syncEngine, splitId, refreshSplit]
  );

  const addParticipant = useCallback(
    async (participant: IParticipant) => {
      if (!split) return;

      const updatedParticipants = [...split.participants, participant];
      await updateSplit({ participants: updatedParticipants });
    },
    [split, updateSplit]
  );

  const removeParticipant = useCallback(
    async (participantId: string) => {
      if (!split) return;

      const updatedParticipants = split.participants.filter(
        (p) => p.participantId !== participantId
      );
      // Also remove the participant from all expenses
      const updatedExpenses = split.expenses
        .map((expense) => ({
          ...expense,
          splitBetween: expense.splitBetween.filter(
            (id) => id !== participantId
          ),
          paidBy:
            expense.paidBy === participantId
              ? split.participants[0]?.participantId || ""
              : expense.paidBy,
        }))
        .filter((expense) => expense.splitBetween.length > 0); // Remove expenses with no participants

      await updateSplit({
        participants: updatedParticipants,
        expenses: updatedExpenses,
      });
    },
    [split, updateSplit]
  );

  const addExpense = useCallback(
    async (expense: IExpense) => {
      if (!split) return;

      const updatedExpenses = [...split.expenses, expense];
      await updateSplit({ expenses: updatedExpenses });
    },
    [split, updateSplit]
  );

  const updateExpense = useCallback(
    async (expenseId: string, updates: Partial<IExpense>) => {
      if (!split) return;

      const updatedExpenses = split.expenses.map((expense) =>
        expense.expenseId === expenseId ? { ...expense, ...updates } : expense
      );
      await updateSplit({ expenses: updatedExpenses });
    },
    [split, updateSplit]
  );

  const removeExpense = useCallback(
    async (expenseId: string) => {
      if (!split) return;

      const updatedExpenses = split.expenses.filter(
        (expense) => expense.expenseId !== expenseId
      );
      await updateSplit({ expenses: updatedExpenses });
    },
    [split, updateSplit]
  );

  return {
    split,
    loading,
    error,
    updateSplit,
    addParticipant,
    removeParticipant,
    addExpense,
    updateExpense,
    removeExpense,
    refresh: refreshSplit,
  };
}

// Hook for sync status indicator
export function useSyncStatus(syncEngine: SyncEngine | null) {
  const [status, setStatus] = useState<ISyncStatus>({
    isOnline: true,
    lastSyncTime: null,
    pendingOperations: 0,
    isSyncing: false,
    error: null,
  });

  useEffect(() => {
    if (!syncEngine) return;

    let mounted = true;

    const updateStatus = async () => {
      try {
        const currentStatus = await syncEngine.getStatus();
        if (mounted) {
          setStatus(currentStatus);
        }
      } catch (error) {
        console.error("Failed to get sync status:", error);
      }
    };

    const unsubscribe = syncEngine.onStatusChange((newStatus) => {
      if (mounted) {
        setStatus(newStatus);
      }
    });

    updateStatus();

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [syncEngine]);

  return status;
}
