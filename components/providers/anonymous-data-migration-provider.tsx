"use client";

import { useAnonymousDataMigration } from "@/hooks/user/use-anonymous-data-migration";

// This component runs the anonymous data migration hook globally
export function AnonymousDataMigrationProvider() {
  useAnonymousDataMigration();
  return null;
}
