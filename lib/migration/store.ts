import { IMigrationData } from "@/types/migration.types";

export const MIGRATION_STORAGE_KEY = "anonymousUserMigration";

export const migrationStorage = {
  store: (data: IMigrationData) => {
    try {
      sessionStorage.setItem(MIGRATION_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to store migration data:", error);
    }
  },

  retrieve: (): IMigrationData | null => {
    try {
      const data = sessionStorage.getItem(MIGRATION_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn("Failed to retrieve migration data:", error);
      return null;
    }
  },

  clear: () => {
    try {
      sessionStorage.removeItem(MIGRATION_STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear migration data:", error);
    }
  },
};
