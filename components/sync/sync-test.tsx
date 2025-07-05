import React from "react";
import { useSplits } from "@/hooks/use-sync";
import { useSync } from "@/providers/sync-provider";

export function SyncTestComponent() {
  const { syncEngine, currentUser, status } = useSync();
  const { splits, loading, error, createSplit } = useSplits(
    syncEngine,
    currentUser?.id
  );

  const handleCreateTestSplit = async () => {
    if (!currentUser?.id) {
      alert("Please log in first");
      return;
    }

    try {
      await createSplit({
        splitId: `test-${Date.now()}`,
        name: "Test Split",
        participants: [
          { participantId: "p1", name: "Test User 1" },
          { participantId: "p2", name: "Test User 2" },
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
        createdBy: currentUser.id,
      });

      alert("Split created successfully!");
    } catch (error) {
      alert(`Failed to create split: ${error}`);
    }
  };

  if (!currentUser) {
    return (
      <div className="p-4 border rounded">
        <h3 className="font-bold mb-2">Sync Test - Not Logged In</h3>
        <p>Please log in to test the sync engine</p>
        <div className="mt-2 text-sm text-gray-600">
          <p>Status: {status.isOnline ? "Online" : "Offline"}</p>
          <p>Pending: {status.pendingOperations}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Sync Test - Logged In</h3>
      <p>User: {currentUser.name || currentUser.id}</p>

      <div className="mt-2 text-sm text-gray-600">
        <p>Status: {status.isOnline ? "Online" : "Offline"}</p>
        <p>Pending: {status.pendingOperations}</p>
        <p>
          Last Sync:{" "}
          {status.lastSyncTime
            ? new Date(status.lastSyncTime).toLocaleTimeString()
            : "Never"}
        </p>
        {status.isSyncing && <p className="text-blue-600">Syncing...</p>}
        {status.error && <p className="text-red-600">Error: {status.error}</p>}
      </div>

      <div className="mt-4">
        <button
          onClick={handleCreateTestSplit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Test Split
        </button>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold">Your Splits ({splits.length})</h4>
        {loading && <p>Loading splits...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        <div className="mt-2 max-h-40 overflow-y-auto">
          {splits.map((split) => (
            <div key={split.splitId} className="p-2 border-b text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{split.name}</span>
                <div className="flex items-center gap-2 text-xs">
                  {split.pendingSync && (
                    <span className="text-yellow-600">⏳ Pending</span>
                  )}
                  {split.locallyModified && (
                    <span className="text-orange-600">📝 Modified</span>
                  )}
                  {split.conflictData && (
                    <span className="text-red-600">⚠️ Conflict</span>
                  )}
                </div>
              </div>
              <div className="text-gray-600">
                {split.participants.length} participants,{" "}
                {split.expenses.length} expenses
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
