# Sync Engine Documentation

## Overview

The sync engine provides a local-first data architecture for TheirShare, using IndexedDB via Dexie to store data locally and automatically synchronizing with your Convex backend. This ensures fast user interactions while maintaining data consistency across devices.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Sync Engine   │    │   Convex API    │
│                 │    │                 │    │                 │
│ Components use  │────│ Local-first     │────│ Cloud storage   │
│ hooks for data  │    │ IndexedDB       │    │ Authoritative   │
│                 │    │ + Background    │    │ source          │
│                 │    │ sync            │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Key Features

- **Local-first**: All operations work offline and sync when online
- **Real-time sync**: Background synchronization every 5 seconds (configurable)
- **Conflict resolution**: Configurable strategies for handling conflicts
- **Optimistic updates**: Immediate UI updates with background sync
- **Error handling**: Retry logic and error recovery
- **Development tools**: Debug utilities and data management

## Installation & Setup

### 1. Prerequisites

The sync engine is already integrated into your project. Make sure you have:

- Dexie installed (already done)
- Convex backend set up
- NEXT_PUBLIC_CONVEX_URL environment variable

### 2. Provider Setup

The `SyncProvider` is already added to your app in `providers/providers.tsx`:

```tsx
<SyncProvider
  convexUrl={process.env.NEXT_PUBLIC_CONVEX_URL!}
  syncIntervalMs={5000}
  conflictResolution="server-wins"
>
  {children}
</SyncProvider>
```

### 3. Using the Hooks

```tsx
import { useSync, useSplits, useSplit } from "@/hooks/use-sync";
import { useSync as useSyncProvider } from "@/providers/sync-provider";

function MyComponent() {
  const { syncEngine } = useSyncProvider();
  const { splits, loading, createSplit, updateSplit, deleteSplit } = useSplits(
    syncEngine,
    userId
  );

  // Your component logic
}
```

## API Reference

### SyncProvider Props

```tsx
interface SyncProviderProps {
  convexUrl: string; // Required: Convex deployment URL
  syncIntervalMs?: number; // Optional: Sync interval (default: 5000ms)
  maxRetries?: number; // Optional: Max retry attempts (default: 3)
  batchSize?: number; // Optional: Sync batch size (default: 10)
  conflictResolution?:
    | "server-wins" // Optional: Conflict resolution strategy
    | "client-wins" // (default: 'server-wins')
    | "manual";
}
```

### useSplits Hook

```tsx
const {
  splits, // ILocalSplit[] - All splits for user
  loading, // boolean - Loading state
  error, // string | null - Error message
  createSplit, // (data) => Promise<void> - Create new split
  updateSplit, // (id, updates) => Promise<void> - Update split
  deleteSplit, // (id) => Promise<void> - Delete split
  getSplitById, // (id) => Promise<ILocalSplit | null> - Get single split
  refresh, // () => Promise<void> - Refresh data
} = useSplits(syncEngine, userId);
```

### useSplit Hook

```tsx
const {
  split, // ILocalSplit | null - Single split data
  loading, // boolean - Loading state
  error, // string | null - Error message
  updateSplit, // (updates) => Promise<void> - Update split
  addParticipant, // (participant) => Promise<void> - Add participant
  removeParticipant, // (id) => Promise<void> - Remove participant
  addExpense, // (expense) => Promise<void> - Add expense
  updateExpense, // (id, updates) => Promise<void> - Update expense
  removeExpense, // (id) => Promise<void> - Remove expense
  refresh, // () => Promise<void> - Refresh data
} = useSplit(syncEngine, splitId);
```

### Sync Status

```tsx
const { status, forceSync } = useSyncProvider();

// status contains:
// - isOnline: boolean
// - lastSyncTime: number | null
// - pendingOperations: number
// - isSyncing: boolean
// - error: string | null
```

## Components

### Sync Status Indicator

Shows current sync status in the header:

```tsx
import { SyncIndicator } from "@/components/sync/sync-status";

<SyncIndicator />;
```

### Sync Status Panel

Detailed sync information for settings:

```tsx
import { SyncStatusPanel } from "@/components/sync/sync-status";

<SyncStatusPanel />;
```

### Sync Settings

Complete sync management interface:

```tsx
import { SyncSettings } from "@/components/settings/sync-settings";

<SyncSettings />;
```

## Data Flow

### Creating a Split

1. User creates split via `createSplit()`
2. Data immediately stored in IndexedDB
3. UI updates instantly (optimistic update)
4. Sync operation queued
5. Background sync pushes to Convex
6. Local data marked as synced

### Updating a Split

1. User updates split via `updateSplit()`
2. Local data updated immediately
3. UI reflects changes instantly
4. Sync operation queued
5. Background sync pushes changes
6. Conflict resolution if needed

### Offline Behavior

1. All operations work normally when offline
2. Changes stored locally with `pendingSync: true`
3. UI shows sync status indicators
4. When online, all pending changes sync automatically
5. Users can continue working seamlessly

## Conflict Resolution

### Server Wins (Default)

- Server data overwrites local changes
- Simple and predictable
- Good for most use cases

### Client Wins

- Local changes overwrite server data
- Use when local user is authoritative
- May cause data loss for other users

### Manual

- Conflicts stored for user resolution
- Most complex but most flexible
- Requires custom conflict resolution UI

## Visual Indicators

The sync engine provides visual feedback:

- **Yellow dot**: Changes pending sync
- **Offline icon**: No internet connection
- **Syncing badge**: Currently syncing
- **Conflict badge**: Conflicts need resolution
- **Error state**: Sync failures

## Database Management

### Development Tools

Access via browser console:

```javascript
// Clear all local data
await dbManagement.clearAllData();

// Get database statistics
const stats = await dbManagement.getStats();

// Export data for backup
const backup = await dbManagement.exportData();

// Add test data (development only)
await devUtils.addTestData();

// Debug database state
await devUtils.debugDatabaseState();
```

### Troubleshooting

Common issues and solutions:

#### Sync Gets Stuck

```javascript
await dbManagement.resetPendingSync();
```

#### Resolve All Conflicts

```javascript
await dbManagement.resolveConflictsWithServer();
```

#### Clean Up Old Operations

```javascript
await dbManagement.cleanupOldSyncOperations();
```

### Data Export/Import

Export your data:

```javascript
const data = await dbManagement.exportData();
// Creates downloadable JSON file
```

Import data:

```javascript
await dbManagement.importData(backupData);
// Restores from backup
```

## Performance Considerations

### Sync Frequency

- Default: 5 seconds
- Adjust based on your needs
- Lower = more real-time, higher bandwidth
- Higher = less bandwidth, less real-time

### Batch Size

- Default: 10 operations per sync
- Increase for better performance with many changes
- Decrease for more frequent small syncs

### Index Strategy

- IndexedDB indexes on commonly queried fields
- `splitId`, `createdBy`, `isDeleted`, `pendingSync`
- Optimizes common query patterns

## Security Considerations

- All data validation happens on Convex backend
- Local data is not encrypted (browser security)
- Sync operations respect Convex authentication
- No sensitive data should be stored in sync metadata

## Migration & Versioning

### Database Schema Updates

When updating the database schema:

1. Increment version in `TheirShareDB`
2. Add migration logic in constructor
3. Test with existing data

```typescript
this.version(2)
  .stores({
    // Updated schema
  })
  .upgrade((trans) => {
    // Migration logic
  });
```

### Sync Protocol Changes

When changing sync protocol:

1. Version your sync operations
2. Handle both old and new formats
3. Graceful degradation for older clients

## Best Practices

### For Developers

1. **Always use hooks**: Don't access database directly in components
2. **Handle loading states**: Show loading indicators during sync
3. **Show sync status**: Keep users informed about sync state
4. **Test offline**: Ensure app works without internet
5. **Export before major changes**: Always backup data

### For Users

1. **Keep app open**: Let background sync complete
2. **Check sync status**: Look for pending indicators
3. **Export data**: Regular backups recommended
4. **Report conflicts**: Manual resolution may be needed

## Debugging

### Browser Console Access

The sync engine exposes debugging tools:

```javascript
// Available in browser console
dbManagement.getStats();
devUtils.debugDatabaseState();

// Check sync status
syncEngine.getStatus();

// Force sync
syncEngine.performSync();
```

### Logging

The sync engine logs all operations:

- ✅ Successful operations
- ❌ Failed operations
- 🔄 Sync start/complete
- 📱 Offline status changes

Check browser console for detailed logs.

## Extending the Sync Engine

### Adding New Entity Types

1. Extend database schema in `lib/db/index.ts`
2. Add sync operations in `sync-engine.ts`
3. Create corresponding hooks
4. Update conflict resolution logic

### Custom Conflict Resolution

Implement custom conflict resolution:

```typescript
async resolveConflict(local: ILocalSplit, server: ISplit): Promise<void> {
  // Your custom logic here
  // e.g., merge data, show UI, etc.
}
```

### Additional Sync Strategies

- **Real-time sync**: WebSocket integration
- **Incremental sync**: Delta-based updates
- **Selective sync**: Sync only specific data
- **P2P sync**: Direct device-to-device sync

## FAQ

**Q: Does the app work offline?**
A: Yes, all features work offline. Changes sync when connection is restored.

**Q: What happens if I make changes on multiple devices?**
A: The sync engine handles conflicts based on your chosen resolution strategy.

**Q: How much data is stored locally?**
A: Only your data is stored locally. Storage usage is shown in settings.

**Q: Can I disable sync?**
A: The app is designed to be local-first. You can pause sync but not disable it completely.

**Q: What if sync fails repeatedly?**
A: Check your internet connection and use the troubleshooting tools in settings.

## Support

For issues or questions:

1. Check browser console for errors
2. Use debug tools in sync settings
3. Export data as backup
4. Check network connectivity
5. Try troubleshooting tools

The sync engine is designed to be robust and self-healing, but these tools can help resolve edge cases.
