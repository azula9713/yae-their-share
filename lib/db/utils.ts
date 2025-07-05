import { db, dbUtils } from "@/lib/db";

// Database management utilities for development and maintenance

export const dbManagement = {
  // Clear all local data (useful for testing/development)
  async clearAllData() {
    try {
      await dbUtils.clearAll();
      console.log("✅ All local data cleared");
    } catch (error) {
      console.error("❌ Failed to clear data:", error);
      throw error;
    }
  },

  // Get database statistics
  async getStats() {
    try {
      const [splitsCount, syncOpsCount, metadataCount] = await Promise.all([
        db.splits.count(),
        db.syncOperations.count(),
        db.syncMetadata.count(),
      ]);

      const pendingSyncOps = await db.syncOperations
        .where("completed")
        .equals(0)
        .count();

      const locallyModifiedSplits = await db.splits
        .where("locallyModified")
        .equals(1)
        .count();

      return {
        splits: {
          total: splitsCount,
          locallyModified: locallyModifiedSplits,
        },
        syncOperations: {
          total: syncOpsCount,
          pending: pendingSyncOps,
        },
        metadata: metadataCount,
      };
    } catch (error) {
      console.error("Failed to get database stats:", error);
      throw error;
    }
  },

  // Export data for backup
  async exportData() {
    try {
      const [splits, syncOps, metadata] = await Promise.all([
        db.splits.toArray(),
        db.syncOperations.toArray(),
        db.syncMetadata.toArray(),
      ]);

      return {
        splits,
        syncOperations: syncOps,
        metadata,
        exportedAt: new Date().toISOString(),
        version: "1.0",
      };
    } catch (error) {
      console.error("Failed to export data:", error);
      throw error;
    }
  },

  // Import data from backup (use with caution)
  async importData(data: any) {
    try {
      await db.transaction(
        "rw",
        [db.splits, db.syncOperations, db.syncMetadata],
        async () => {
          // Clear existing data
          await Promise.all([
            db.splits.clear(),
            db.syncOperations.clear(),
            db.syncMetadata.clear(),
          ]);

          // Import new data
          if (data.splits?.length > 0) {
            await db.splits.bulkAdd(data.splits);
          }
          if (data.syncOperations?.length > 0) {
            await db.syncOperations.bulkAdd(data.syncOperations);
          }
          if (data.metadata?.length > 0) {
            await db.syncMetadata.bulkAdd(data.metadata);
          }
        }
      );

      console.log("✅ Data imported successfully");
    } catch (error) {
      console.error("❌ Failed to import data:", error);
      throw error;
    }
  },

  // Cleanup old sync operations
  async cleanupOldSyncOperations(daysOld = 7) {
    try {
      const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;

      const oldOperations = await db.syncOperations
        .where("timestamp")
        .below(cutoffTime)
        .and((op) => op.completed === true)
        .toArray();

      if (oldOperations.length > 0) {
        const ids = oldOperations.map((op) => op.id!);
        await db.syncOperations.bulkDelete(ids);
        console.log(
          `✅ Cleaned up ${oldOperations.length} old sync operations`
        );
      }

      return oldOperations.length;
    } catch (error) {
      console.error("Failed to cleanup old sync operations:", error);
      throw error;
    }
  },

  // Reset pending sync flags (use if sync gets stuck)
  async resetPendingSync() {
    try {
      const pendingSplits = await db.splits
        .where("pendingSync")
        .equals(1)
        .toArray();

      for (const split of pendingSplits) {
        await db.splits.update(split._id!, {
          pendingSync: false,
          locallyModified: false,
        });
      }

      console.log(`✅ Reset ${pendingSplits.length} pending sync flags`);
      return pendingSplits.length;
    } catch (error) {
      console.error("Failed to reset pending sync flags:", error);
      throw error;
    }
  },

  // Resolve conflicts by accepting server version
  async resolveConflictsWithServer() {
    try {
      const allSplits = await db.splits.toArray();
      const conflictedSplits = allSplits.filter(
        (split) => split.conflictData !== undefined
      );

      for (const split of conflictedSplits) {
        if (split.conflictData) {
          await db.splits.update(split._id!, {
            ...split.conflictData,
            conflictData: undefined,
            pendingSync: false,
            locallyModified: false,
            lastSyncedAt: Date.now(),
          });
        }
      }

      console.log(
        `✅ Resolved ${conflictedSplits.length} conflicts with server data`
      );
      return conflictedSplits.length;
    } catch (error) {
      console.error("Failed to resolve conflicts:", error);
      throw error;
    }
  },
};

// Development utilities (only available in development)
export const devUtils = {
  // Add test data for development
  async addTestData() {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("Test data can only be added in development mode");
    }

    const testSplit = {
      _id: "",
      splitId: `test-${Date.now()}`,
      name: "Test Split",
      date: new Date().toISOString(),
      participants: [
        { participantId: "p1", name: "Alice" },
        { participantId: "p2", name: "Bob" },
      ],
      expenses: [
        {
          expenseId: "e1",
          amount: 100,
          description: "Test Expense",
          paidBy: "p1",
          splitBetween: ["p1", "p2"],
        },
      ],
      createdBy: "test-user",
      isPrivate: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pendingSync: false,
      locallyModified: false,
      lastSyncedAt: Date.now(),
    };

    await db.splits.add(testSplit);
    console.log("✅ Test data added");
  },

  // Log database state for debugging
  async debugDatabaseState() {
    const stats = await dbManagement.getStats();
    console.log("📊 Database State:", stats);

    const pendingOps = await dbUtils.getPendingSyncOperations();
    console.log("⏳ Pending Sync Operations:", pendingOps);

    const lastSync = await dbUtils.getSyncMetadata("lastSyncTime");
    console.log(
      "🕒 Last Sync:",
      lastSync ? new Date(lastSync as number) : "Never"
    );
  },
};

// Global access for debugging in browser console
if (typeof window !== "undefined") {
  (window as any).dbManagement = dbManagement;
  (window as any).devUtils = devUtils;
}
