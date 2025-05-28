import { ISplit } from "@/types/split.types";
import Dexie, { Table } from "dexie";

export interface CachedSplit {
  _id: string;
  userId: string; // For user-specific caching
  data: ISplit;
  cachedAt: number;
  isDeleted: boolean;
}

export class SplitsCacheDB extends Dexie {
  splits!: Table<CachedSplit>;

  constructor() {
    super("SplitCacheDB");
    this.version(1).stores({
      splits: "_id, userId, cachedAt, isDeleted",
    });
  }

  async cacheSplit(userId: string, split: ISplit): Promise<void> {
    await this.splits.put({
      _id: split._id,
      userId,
      data: split,
      cachedAt: Date.now(),
      isDeleted: split.isDeleted ?? false,
    });
  }

  async getCachedSplits(userId: string, includeDeleted = false): Promise<ISplit[]> {
    let query = this.splits.where('userId').equals(userId);
    
    if (!includeDeleted) {
      query = query.and(cached => !cached.isDeleted);
    }
    
    const cached = await query.toArray();
    return cached.map(item => item.data);
  }

  async getCachedSplit(splitId: string): Promise<ISplit | null> {
    const cached = await this.splits.get(splitId);
    return cached ? cached.data : null;
  }

  async clearUserSplits(userId: string): Promise<void> {
    await this.splits.where('userId').equals(userId).delete();
  }

  async getCacheAge(userId: string): Promise<number | null> {
    const allUserSplits = await this.splits.where('userId').equals(userId).toArray();
    
    if (allUserSplits.length === 0) return null;
    
    // Find the most recent cache entry
    const latest = allUserSplits.reduce(
      (prev, current) => prev.cachedAt > current.cachedAt ? prev : current,
      allUserSplits[0]
    );
    
    return Date.now() - latest.cachedAt;
  }

  async markSplitDeleted(splitId: string): Promise<void> {
    const cached = await this.splits.get(splitId);
    if (cached) {
      await this.splits.update(splitId, {
        isDeleted: true,
        data: { ...cached.data, isDeleted: true, deletedAt: new Date().toISOString() }
      });
    }
  }
}

export const splitsCacheDB = new SplitsCacheDB();