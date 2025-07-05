import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { db, dbUtils, ISyncOperation, ILocalSplit } from "./index";
import { ISplit } from "@/types/split.types";

export interface ISyncConfig {
  convexUrl: string;
  syncIntervalMs?: number;
  maxRetries?: number;
  batchSize?: number;
  conflictResolution?: "server-wins" | "client-wins" | "manual";
}

export interface ISyncStatus {
  isOnline: boolean;
  lastSyncTime: number | null;
  pendingOperations: number;
  isSyncing: boolean;
  error: string | null;
}

export class SyncEngine {
  private convex: ConvexHttpClient;
  private config: Required<ISyncConfig>;
  private syncInterval: NodeJS.Timeout | null = null;
  private currentSyncPromise: Promise<void> | null = null;
  private listeners: Set<(status: ISyncStatus) => void> = new Set();
  private userId: string | null = null;

  constructor(config: ISyncConfig) {
    this.convex = new ConvexHttpClient(config.convexUrl);
    this.config = {
      syncIntervalMs: 5000, // 5 seconds
      maxRetries: 3,
      batchSize: 10,
      conflictResolution: "server-wins",
      ...config,
    };
  }

  // Set user ID for authenticated operations
  setUserId(userId: string | null) {
    this.userId = userId;

    // If user is logged out, stop sync and clear local data
    if (!userId) {
      this.stop();
    }
  }

  // Clear user-specific data when logging out
  async clearUserData() {
    if (this.userId) {
      // Remove splits for this user
      const userSplits = await db.splits
        .where("createdBy")
        .equals(this.userId)
        .toArray();

      const splitIds = userSplits.map((split) => split._id!);
      await db.splits.bulkDelete(splitIds);

      // Clear pending operations for this user
      const pendingOps = await db.syncOperations.toArray();
      const userOpIds = pendingOps
        .filter((op) => {
          // Check if operation belongs to this user's data
          return op.data?.createdBy === this.userId;
        })
        .map((op) => op.id!);

      if (userOpIds.length > 0) {
        await db.syncOperations.bulkDelete(userOpIds);
      }
    }

    this.userId = null;
  }

  // Start the sync engine
  async start() {
    console.log("🔄 Starting sync engine...");

    // Initial sync
    await this.performSync();

    // Set up periodic sync
    this.syncInterval = setInterval(() => {
      if (this.isOnline()) {
        this.performSync();
      }
    }, this.config.syncIntervalMs);

    // Listen for online/offline events
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.performSync());
      window.addEventListener("offline", () => this.notifyListeners());
    }

    console.log("✅ Sync engine started");
  }

  // Stop the sync engine
  stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    console.log("🛑 Sync engine stopped");
  }

  // Check if online
  private isOnline(): boolean {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  }

  // Add status listener
  onStatusChange(listener: (status: ISyncStatus) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Get current sync status
  async getStatus(): Promise<ISyncStatus> {
    const pendingOps = await dbUtils.getPendingSyncOperations();
    const lastSyncTime = (await dbUtils.getSyncMetadata("lastSyncTime")) as
      | number
      | null;

    return {
      isOnline: this.isOnline(),
      lastSyncTime,
      pendingOperations: pendingOps.length,
      isSyncing: this.currentSyncPromise !== null,
      error: null,
    };
  }

  // Notify all listeners of status change
  private async notifyListeners() {
    const status = await this.getStatus();
    this.listeners.forEach((listener) => listener(status));
  }

  // Main sync function
  async performSync(): Promise<void> {
    if (this.currentSyncPromise) {
      return this.currentSyncPromise;
    }

    this.currentSyncPromise = this._performSyncInternal();

    try {
      await this.currentSyncPromise;
    } finally {
      this.currentSyncPromise = null;
      await this.notifyListeners();
    }
  }

  private async _performSyncInternal(): Promise<void> {
    if (!this.isOnline()) {
      console.log("📱 Offline, skipping sync");
      return;
    }

    try {
      console.log("🔄 Starting sync...");

      // Step 1: Push local changes to server
      await this.pushLocalChanges();

      // Step 2: Pull server changes to local
      await this.pullServerChanges();

      // Step 3: Update last sync time
      await dbUtils.setSyncMetadata("lastSyncTime", Date.now());

      console.log("✅ Sync completed successfully");
    } catch (error) {
      console.error("❌ Sync failed:", error);
      throw error;
    }
  }

  // Push local changes to server
  private async pushLocalChanges(): Promise<void> {
    const pendingOps = await dbUtils.getPendingSyncOperations();

    for (const operation of pendingOps.slice(0, this.config.batchSize)) {
      try {
        await this.processSyncOperation(operation);
        if (operation.id) {
          await dbUtils.completeSyncOperation(operation.id);
        }
      } catch (error) {
        console.error(`Failed to sync operation ${operation.id}:`, error);
        if (operation.id && operation.retryCount < this.config.maxRetries) {
          await dbUtils.updateSyncOperationError(operation.id, String(error));
        }
      }
    }
  }

  // Process individual sync operation
  private async processSyncOperation(operation: ISyncOperation): Promise<void> {
    const { operationType, entityId, data } = operation;

    switch (operationType) {
      case "create":
        if (data) {
          await this.convex.mutation(api.splits.createSplit, {
            splitId: data.splitId!,
            name: data.name!,
            date: data.date,
            participants: data.participants!,
            expenses: data.expenses!,
            createdBy: data.createdBy!,
          });
        }
        break;

      case "update":
        if (data) {
          await this.convex.mutation(api.splits.updateSplit, {
            splitId: data.splitId!,
            name: data.name!,
            date: data.date!,
            participants: data.participants!,
            expenses: data.expenses!,
            updatedBy: data.updatedBy!,
            updatedAt: data.updatedAt!,
            isPrivate: data.isPrivate!,
            isDeleted: data.isDeleted,
            deletedAt: data.deletedAt,
          });
        }
        break;

      case "delete":
        await this.convex.mutation(api.splits.deleteSplit, {
          splitId: entityId,
        });
        break;
    }

    // Mark local item as synced
    const localSplit = await db.splits
      .where("splitId")
      .equals(entityId)
      .first();
    if (localSplit) {
      await db.splits.update(localSplit._id!, {
        pendingSync: false,
        locallyModified: false,
        lastSyncedAt: Date.now(),
      });
    }
  }

  // Pull server changes to local
  private async pullServerChanges(): Promise<void> {
    try {
      // Only sync if we have a user ID
      if (!this.userId) {
        console.log("No user ID set, skipping server pull");
        return;
      }

      // Get user's splits from server
      const serverSplits = (await this.convex.query(
        api.splits.getSplitsByUserId,
        { userId: this.userId }
      )) as ISplit[];

      for (const serverSplit of serverSplits) {
        await this.mergeServerSplit(serverSplit);
      }
    } catch (error) {
      console.error("Failed to pull server changes:", error);
      throw error;
    }
  }

  // Merge server split with local data
  private async mergeServerSplit(serverSplit: ISplit): Promise<void> {
    const localSplit = await db.splits
      .where("splitId")
      .equals(serverSplit.splitId)
      .first();

    if (!localSplit) {
      // New split from server, add to local
      const localSplitData: ILocalSplit = {
        ...serverSplit,
        pendingSync: false,
        locallyModified: false,
        lastSyncedAt: Date.now(),
        syncVersion: 1,
      };
      await db.splits.add(localSplitData);
      return;
    }

    // Handle conflict resolution
    if (localSplit.locallyModified && !localSplit.pendingSync) {
      // Local changes that haven't been synced yet
      await this.resolveConflict(localSplit, serverSplit);
    } else if (!localSplit.locallyModified) {
      // No local changes, safe to update with server data
      await db.splits.update(localSplit._id!, {
        ...serverSplit,
        pendingSync: false,
        locallyModified: false,
        lastSyncedAt: Date.now(),
        syncVersion: (localSplit.syncVersion || 0) + 1,
      });
    }
  }

  // Resolve conflicts between local and server data
  private async resolveConflict(
    localSplit: ILocalSplit,
    serverSplit: ISplit
  ): Promise<void> {
    switch (this.config.conflictResolution) {
      case "server-wins":
        await db.splits.update(localSplit._id!, {
          ...serverSplit,
          pendingSync: false,
          locallyModified: false,
          lastSyncedAt: Date.now(),
          syncVersion: (localSplit.syncVersion || 0) + 1,
        });
        break;

      case "client-wins":
        // Keep local data, mark for re-sync
        await db.splits.update(localSplit._id!, {
          pendingSync: true,
          lastSyncedAt: Date.now(),
        });
        await dbUtils.addSyncOperation({
          operationType: "update",
          entityType: "split",
          entityId: localSplit.splitId,
          data: localSplit,
        });
        break;

      case "manual":
        // Store conflict for manual resolution
        await db.splits.update(localSplit._id!, {
          conflictData: serverSplit,
          lastSyncedAt: Date.now(),
        });
        break;
    }
  }

  // Local operations that trigger sync
  async createSplit(
    splitData: Omit<ISplit, "_id" | "_creationTime">
  ): Promise<string> {
    const localSplit: ILocalSplit = {
      ...splitData,
      _id: "", // Will be set by Dexie
      pendingSync: true,
      locallyModified: true,
      lastSyncedAt: Date.now(),
      syncVersion: 1,
    };

    const id = await db.splits.add(localSplit);

    // Add sync operation
    await dbUtils.addSyncOperation({
      operationType: "create",
      entityType: "split",
      entityId: splitData.splitId,
      data: localSplit,
    });

    // Trigger immediate sync if online
    if (this.isOnline()) {
      this.performSync();
    }

    return String(id);
  }

  async updateSplit(splitId: string, updates: Partial<ISplit>): Promise<void> {
    const localSplit = await db.splits.where("splitId").equals(splitId).first();
    if (!localSplit) {
      throw new Error(`Split ${splitId} not found locally`);
    }

    const updatedData = {
      ...updates,
      pendingSync: true,
      locallyModified: true,
      lastSyncedAt: Date.now(),
      updatedAt: new Date().toISOString(),
      syncVersion: (localSplit.syncVersion || 0) + 1,
    };

    await db.splits.update(localSplit._id!, updatedData);

    // Add sync operation
    await dbUtils.addSyncOperation({
      operationType: "update",
      entityType: "split",
      entityId: splitId,
      data: { ...localSplit, ...updatedData },
    });

    // Trigger immediate sync if online
    if (this.isOnline()) {
      this.performSync();
    }
  }

  async deleteSplit(splitId: string): Promise<void> {
    const localSplit = await db.splits.where("splitId").equals(splitId).first();
    if (!localSplit) {
      throw new Error(`Split ${splitId} not found locally`);
    }

    // Soft delete
    await db.splits.update(localSplit._id!, {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
      pendingSync: true,
      locallyModified: true,
      lastSyncedAt: Date.now(),
    });

    // Add sync operation
    await dbUtils.addSyncOperation({
      operationType: "delete",
      entityType: "split",
      entityId: splitId,
    });

    // Trigger immediate sync if online
    if (this.isOnline()) {
      this.performSync();
    }
  }

  // Query methods for local data
  async getAllSplits(userId?: string): Promise<ILocalSplit[]> {
    let query = db.splits.where("isDeleted").notEqual(1);

    if (userId) {
      query = query.and((split) => split.createdBy === userId);
    }

    return await query.toArray();
  }

  async getSplitById(splitId: string): Promise<ILocalSplit | undefined> {
    return await db.splits.where("splitId").equals(splitId).first();
  }

  async getDeletedSplits(userId?: string): Promise<ILocalSplit[]> {
    let query = db.splits.where("isDeleted").equals(1);

    if (userId) {
      query = query.and((split) => split.createdBy === userId);
    }

    return await query.toArray();
  }
}
