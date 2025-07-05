# Quick Start: Migrating to Local-First Sync

This guide shows how to migrate an existing component from direct Convex calls to the local-first sync engine.

## Before: Direct Convex Usage

```tsx
// Old approach - direct Convex calls
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function SplitsComponent({ userId }: { userId: string }) {
  // Direct Convex queries - slow, requires internet
  const splits = useQuery(api.splits.getSplitsByUserId, { userId });
  const createSplit = useMutation(api.splits.createSplit);
  const updateSplit = useMutation(api.splits.updateSplit);
  const deleteSplit = useMutation(api.splits.deleteSplit);

  const handleCreateSplit = async (splitData: any) => {
    // Slow - waits for server response
    await createSplit(splitData);
  };

  const handleUpdateSplit = async (splitId: string, updates: any) => {
    // Blocks UI until server responds
    await updateSplit({ splitId, ...updates });
  };

  if (splits === undefined) {
    return <div>Loading...</div>; // Frequent loading states
  }

  return (
    <div>
      {splits.map((split) => (
        <div key={split._id}>
          {split.name}
          <button
            onClick={() =>
              handleUpdateSplit(split.splitId, { name: "Updated" })
            }
          >
            Update
          </button>
        </div>
      ))}
      <button
        onClick={() =>
          handleCreateSplit({
            /* data */
          })
        }
      >
        Create Split
      </button>
    </div>
  );
}
```

## After: Local-First with Sync Engine

```tsx
// New approach - local-first with sync
import { useSplits } from "@/hooks/use-sync";
import { useSync } from "@/providers/sync-provider";

function SplitsComponent({ userId }: { userId: string }) {
  const { syncEngine } = useSync();

  // Local-first - instant responses, works offline
  const { splits, loading, error, createSplit, updateSplit, deleteSplit } =
    useSplits(syncEngine, userId);

  const handleCreateSplit = async (splitData: any) => {
    // Instant UI update, syncs in background
    await createSplit({
      splitId: `split-${Date.now()}`,
      name: splitData.name,
      participants: [],
      expenses: [],
      createdBy: userId,
    });
  };

  const handleUpdateSplit = async (splitId: string, updates: any) => {
    // Immediate UI update, background sync
    await updateSplit(splitId, updates);
  };

  // Only shows loading on initial load, not on updates
  if (loading && splits.length === 0) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {splits.map((split) => {
        // Visual indicators for sync status
        const isPending = split.pendingSync || split.locallyModified;
        const hasConflict = split.conflictData;

        return (
          <div key={split._id} className={isPending ? "opacity-75" : ""}>
            {split.name}
            {isPending && <span className="text-yellow-500">⏳</span>}
            {hasConflict && <span className="text-red-500">⚠️</span>}
            {!navigator.onLine && <span className="text-gray-500">📱</span>}

            <button
              onClick={() =>
                handleUpdateSplit(split.splitId, { name: "Updated" })
              }
            >
              Update
            </button>
          </div>
        );
      })}
      <button onClick={() => handleCreateSplit({ name: "New Split" })}>
        Create Split
      </button>
    </div>
  );
}
```

## Key Differences

| Aspect          | Direct Convex            | Local-First Sync        |
| --------------- | ------------------------ | ----------------------- |
| **Speed**       | Slow (network roundtrip) | Instant (local storage) |
| **Offline**     | Doesn't work             | Fully functional        |
| **Loading**     | Frequent loading states  | Minimal loading         |
| **UX**          | Blocking operations      | Optimistic updates      |
| **Conflicts**   | Not handled              | Automatic resolution    |
| **Reliability** | Network dependent        | Always works            |

## Step-by-Step Migration

### 1. Add Sync Provider

Already done in your `providers/providers.tsx`:

```tsx
<SyncProvider convexUrl={process.env.NEXT_PUBLIC_CONVEX_URL!}>
  {children}
</SyncProvider>
```

### 2. Replace Convex Hooks

```tsx
// Replace this:
const splits = useQuery(api.splits.getSplitsByUserId, { userId });
const createSplit = useMutation(api.splits.createSplit);

// With this:
const { syncEngine } = useSync();
const { splits, createSplit } = useSplits(syncEngine, userId);
```

### 3. Update Data Operations

```tsx
// Old - blocking
await createSplitMutation({ splitId, name, participants, expenses, createdBy });

// New - instant
await createSplit({ splitId, name, participants, expenses, createdBy });
```

### 4. Add Visual Indicators

```tsx
// Show sync status
{
  split.pendingSync && <Badge>Syncing...</Badge>;
}
{
  split.conflictData && <Badge variant="destructive">Conflict</Badge>;
}
{
  !navigator.onLine && <Badge variant="secondary">Offline</Badge>;
}
```

### 5. Handle Errors Gracefully

```tsx
if (error) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Failed to load splits: {error}
        <Button onClick={refresh} variant="outline" size="sm">
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}
```

## Common Patterns

### Single Split Component

```tsx
function SplitPage({ splitId }: { splitId: string }) {
  const { syncEngine } = useSync();
  const { split, loading, error, addParticipant, addExpense, updateSplit } =
    useSplit(syncEngine, splitId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!split) return <div>Split not found</div>;

  return (
    <div>
      <h1>{split.name}</h1>
      {/* Split details with instant updates */}
    </div>
  );
}
```

### Participant Management

```tsx
function ParticipantsList({ splitId }: { splitId: string }) {
  const { syncEngine } = useSync();
  const { split, addParticipant, removeParticipant } = useSplit(
    syncEngine,
    splitId
  );

  const handleAddParticipant = async (name: string) => {
    await addParticipant({
      participantId: `p-${Date.now()}`,
      name,
    });
    // UI updates instantly, syncs in background
  };

  const handleRemoveParticipant = async (participantId: string) => {
    await removeParticipant(participantId);
    // Immediate removal from UI
  };

  return (
    <div>
      {split?.participants.map((participant) => (
        <div key={participant.participantId}>
          {participant.name}
          <Button
            onClick={() => handleRemoveParticipant(participant.participantId)}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}
```

### Expense Management

```tsx
function ExpensesList({ splitId }: { splitId: string }) {
  const { syncEngine } = useSync();
  const { split, addExpense, updateExpense, removeExpense } = useSplit(
    syncEngine,
    splitId
  );

  const handleAddExpense = async (expenseData: any) => {
    await addExpense({
      expenseId: `e-${Date.now()}`,
      ...expenseData,
    });
  };

  return (
    <div>
      {split?.expenses.map((expense) => (
        <div key={expense.expenseId}>
          {expense.description}: ${expense.amount}
          {/* Instant updates on edit */}
        </div>
      ))}
    </div>
  );
}
```

## Testing Offline Functionality

1. **Simulate Offline**: Use browser dev tools to simulate offline
2. **Create Data**: Add splits, participants, expenses
3. **Go Online**: Watch automatic sync
4. **Check Conflicts**: Test with multiple devices

## Performance Tips

1. **Batch Operations**: Multiple changes in quick succession are batched
2. **Debounced Sync**: Rapid changes don't cause excessive sync requests
3. **Selective Loading**: Only load data you need
4. **Memory Management**: React hooks handle cleanup automatically

## Monitoring Sync Health

Add sync status to your UI:

```tsx
function AppHeader() {
  const { status } = useSync();

  return (
    <header>
      <h1>TheirShare</h1>
      <SyncIndicator />
      {status.pendingOperations > 0 && (
        <Badge>{status.pendingOperations} pending</Badge>
      )}
    </header>
  );
}
```

## Troubleshooting Migration

### Common Issues

1. **Old queries still running**: Remove all `useQuery` calls for migrated data
2. **Double updates**: Don't mix old and new patterns
3. **Loading states**: Update loading logic for local-first approach
4. **Error handling**: Adapt error handling for sync errors vs. query errors

### Debug Tools

```tsx
// In any component
const { syncEngine } = useSync();

useEffect(() => {
  // Log sync status
  syncEngine?.onStatusChange(console.log);
}, [syncEngine]);
```

This local-first approach provides a much better user experience with instant responses, offline functionality, and automatic conflict resolution while maintaining data consistency across devices.
