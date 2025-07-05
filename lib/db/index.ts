import Dexie, { Table } from "dexie";
import { ISplit, IParticipant, IExpense } from "@/types/split.types";

// Extended interfaces for local storage with sync metadata
export interface ILocalSplit extends ISplit {
  lastSyncedAt?: number;
  pendingSync?: boolean;
  locallyModified?: boolean;
  syncVersion?: number;
  conflictData?: ISplit; // Store conflicting data for resolution
}

export interface ISyncOperation {
  id?: number;
  operationType: "create" | "update" | "delete";
  entityType: "split";
  entityId: string; // splitId
  data?: Partial<ILocalSplit>;
  timestamp: number;
  retryCount: number;
  error?: string;
  completed: boolean;
}

export interface ISyncMetadata {
  id?: number;
  key: string;
  value: string | number | boolean;
  updatedAt: number;
}

// Dexie database class
export class TheirShareDB extends Dexie {
  splits!: Table<ILocalSplit>;
  syncOperations!: Table<ISyncOperation>;
  syncMetadata!: Table<ISyncMetadata>;

  constructor() {
    super("TheirShareDB");

    this.version(1).stores({
      splits:
        "++_id, splitId, createdBy, isDeleted, lastSyncedAt, pendingSync, locallyModified",
      syncOperations: "++id, entityId, operationType, timestamp, completed",
      syncMetadata: "++id, key",
    });

    // Add hooks for automatic sync operation creation
    this.splits.hook("creating", (primKey, obj, trans) => {
      obj.locallyModified = true;
      obj.pendingSync = true;
      obj.lastSyncedAt = Date.now();
    });

    this.splits.hook("updating", (modifications, primKey, obj, trans) => {
      (modifications as any).locallyModified = true;
      (modifications as any).pendingSync = true;
      (modifications as any).lastSyncedAt = Date.now();
    });

    this.splits.hook("deleting", (primKey, obj, trans) => {
      // Mark as deleted instead of actually deleting to preserve for sync
      this.splits.update(primKey, {
        isDeleted: true,
        locallyModified: true,
        pendingSync: true,
        lastSyncedAt: Date.now(),
      });
      trans.abort(); // Prevent actual deletion
    });
  }
}

// Create database instance
export const db = new TheirShareDB();

// Database utilities
export const dbUtils = {
  // Clear all data (for development/testing)
  async clearAll() {
    await db.transaction(
      "rw",
      [db.splits, db.syncOperations, db.syncMetadata],
      async () => {
        await db.splits.clear();
        await db.syncOperations.clear();
        await db.syncMetadata.clear();
      }
    );
  },

  // Get sync metadata
  async getSyncMetadata(
    key: string
  ): Promise<string | number | boolean | null> {
    const metadata = await db.syncMetadata.where("key").equals(key).first();
    return metadata?.value ?? null;
  },

  // Set sync metadata
  async setSyncMetadata(key: string, value: string | number | boolean) {
    await db.syncMetadata.put({
      key,
      value,
      updatedAt: Date.now(),
    });
  },

  // Get pending sync operations
  async getPendingSyncOperations(): Promise<ISyncOperation[]> {
    return await db.syncOperations
      .where("completed")
      .equals(0)
      .sortBy("timestamp");
  },

  // Add sync operation
  async addSyncOperation(
    operation: Omit<
      ISyncOperation,
      "id" | "timestamp" | "retryCount" | "completed"
    >
  ) {
    await db.syncOperations.add({
      ...operation,
      timestamp: Date.now(),
      retryCount: 0,
      completed: false,
    });
  },

  // Mark sync operation as completed
  async completeSyncOperation(operationId: number) {
    await db.syncOperations.update(operationId, { completed: true });
  },

  // Update sync operation error
  async updateSyncOperationError(operationId: number, error: string) {
    const operation = await db.syncOperations.get(operationId);
    if (operation) {
      await db.syncOperations.update(operationId, {
        error,
        retryCount: operation.retryCount + 1,
      });
    }
  },
};
