// In your hook file
import { splitsCacheDB } from "@/lib/splits-cache-layer"; // Import the instance, not the class
import { useEffect } from "react";

export function useSplitsCacheManager() {
  useEffect(() => {
    const cleanupCache = async () => {
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const cutoff = Date.now() - oneWeek;

      // Use the instance, not the class
      const allEntries = await splitsCacheDB.splits.toArray();
      const oldEntries = allEntries.filter((entry) => entry.cachedAt < cutoff);

      const oldIds = oldEntries.map((entry) => entry._id);
      await splitsCacheDB.splits.bulkDelete(oldIds);
    };

    cleanupCache();
  }, []);

  const clearUserCache = async (userId: string) => {
    await splitsCacheDB.clearUserSplits(userId);
  };

  const getCacheStats = async (userId: string) => {
    const userSplits = await splitsCacheDB.splits
      .where("userId")
      .equals(userId)
      .toArray();

    const totalSplits = userSplits.length;
    const deletedSplits = userSplits.filter(
      (cached) => cached.isDeleted
    ).length;
    const cacheAge = await splitsCacheDB.getCacheAge(userId);

    return {
      totalSplits,
      activeSplits: totalSplits - deletedSplits,
      deletedSplits,
      cacheAge: cacheAge ? Math.round(cacheAge / 1000 / 60) : null,
    };
  };

  return { clearUserCache, getCacheStats };
}
