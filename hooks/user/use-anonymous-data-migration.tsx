import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useMigrateAnonymousUserData } from "@/hooks/user/use-anonymous-upgrade";
import { useGetCurrentUser } from "@/hooks/user/use-user";

interface AnonymousUser {
  _id: string;
  id: string;
  isAnonymous: boolean;
}

// This hook manages the migration of anonymous user data when a user upgrades to authenticated
export function useAnonymousDataMigration() {
  const { data: user } = useGetCurrentUser();
  const { mutate: migrateData } = useMigrateAnonymousUserData();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check if we need to migrate data after authentication
    const handlePostAuthMigration = async () => {
      // Look for stored anonymous user data in session storage
      const storedAnonymousData = sessionStorage.getItem('anonymousUserMigration');
      
      console.log("Checking for stored anonymous data:", storedAnonymousData);
      console.log("Current user:", user);
      
      if (storedAnonymousData && user && !user.isAnonymous) {
        try {
          const { anonymousUserId, anonymousUserCustomId: _anonymousUserCustomId } = JSON.parse(storedAnonymousData);
          
          console.log("Found stored anonymous data, triggering migration:", {
            anonymousUserId,
            authenticatedUserId: user._id,
            userInfo: user
          });

          // Trigger the migration
          migrateData(
            {
              anonymousUserId: anonymousUserId,
              authenticatedUserId: user._id,
            },
            {
              onSuccess: (result) => {
                console.log("Data migration completed successfully:", result);
                // Clear the stored data
                sessionStorage.removeItem('anonymousUserMigration');
                // Invalidate all queries to refresh data
                queryClient.invalidateQueries();
                
                // Show success message
                alert(`Migration completed! ${result.migratedSplitsCount} splits migrated.`);
              },
              onError: (error) => {
                console.error("Data migration failed:", error);
                sessionStorage.removeItem('anonymousUserMigration');
                alert("Data migration failed. Please contact support if this issue persists.");
              }
            }
          );
        } catch (error) {
          console.error("Error parsing stored anonymous data:", error);
          sessionStorage.removeItem('anonymousUserMigration');
        }
      }
    };

    if (user) {
      handlePostAuthMigration();
    }
  }, [user, migrateData, queryClient]);

  // Function to store anonymous user data before authentication
  const storeAnonymousDataForMigration = (anonymousUser: AnonymousUser) => {
    if (anonymousUser?.isAnonymous) {
      const migrationData = {
        anonymousUserId: anonymousUser._id,
        anonymousUserCustomId: anonymousUser.id,
        timestamp: Date.now()
      };
      
      sessionStorage.setItem('anonymousUserMigration', JSON.stringify(migrationData));
      console.log("Stored anonymous user data for migration:", migrationData);
    }
  };

  return {
    storeAnonymousDataForMigration
  };
}
