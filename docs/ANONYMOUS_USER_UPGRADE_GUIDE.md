# Anonymous User Upgrade System

This document explains how to upgrade anonymous users to authenticated users while retaining their data when they decide to login with SSO.

## Overview

The system allows users to:
1. Start using the app without authentication (anonymous mode)
2. Create splits and store data temporarily
3. Later upgrade to a permanent account via SSO (Google)
4. Automatically migrate all their existing data

## Key Components

### 1. Database Schema (`convex/schema.ts`)
- **Users table**: Has `isAnonymous` boolean field to distinguish user types
- **Splits table**: Links to users via `createdBy` field for easy data migration

### 2. Authentication (`convex/auth.ts`)
- Handles both Anonymous and Google OAuth providers
- Auto-upgrades anonymous users when they sign in with matching email
- Preserves user data during the upgrade process

### 3. Migration Functions (`convex/authFunctions.ts`)
- `upgradeAnonymousUser`: Prepares anonymous user for upgrade
- `migrateAnonymousUserData`: Transfers all data from anonymous to authenticated user
- `findAnonymousUserForUpgrade`: Helper to identify upgradeable anonymous users

### 4. Frontend Hooks (`hooks/user/use-anonymous-data-migration.tsx`)
- Consolidated hook for managing anonymous user lifecycle
- Type-safe integration with Convex mutations
- Automatic migration handling

### 5. UI Components (`components/common/anonymous-upgrade-prompt.tsx`)
- User-friendly upgrade prompt dialog
- Explains benefits of upgrading
- Handles the SSO flow

## Implementation Details

### Anonymous User Creation
When a user visits without authentication:
```typescript
// Automatically creates anonymous user
await signIn("anonymous");
```

### Data Association
All user data is linked via the user's custom ID:
```typescript
// Splits are created with createdBy: user.id
const split = {
  createdBy: user.id,
  // ... other split data
};
```

### Upgrade Process
1. **User triggers upgrade**: Clicks "Sign in with Google" 
2. **Auth callback**: `createOrUpdateUser` detects existing anonymous user
3. **Data migration**: Automatically transfers splits and settings
4. **Cleanup**: Removes anonymous user record

### Key Features

#### Automatic Data Migration
```typescript
// Migrates all splits from anonymous to authenticated user
const anonymousSplits = await ctx.db
  .query("splits")
  .withIndex("createdBy", (q) => q.eq("createdBy", anonymousUser.id))
  .collect();

for (const split of anonymousSplits) {
  await ctx.db.patch(split._id, {
    createdBy: authenticatedUser.id,
    updatedBy: authenticatedUser.id,
    updatedAt: new Date().toISOString(),
  });
}
```

#### Settings Preservation
```typescript
// Merges user settings, prioritizing anonymous user's customizations
await ctx.db.patch(authenticatedUserId, {
  settings: {
    ...authenticatedUser.settings,
    ...anonymousUser.settings, // Anonymous user settings take priority
  },
});
```

## Usage Examples

### 1. Dashboard Upgrade Prompt
```typescript
// Show upgrade prompt after user creates data
useEffect(() => {
  if (isAnonymous && splits.length > 0) {
    const timer = setTimeout(() => {
      showPrompt("Dashboard Access");
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [isAnonymous, splits.length, showPrompt]);
```

### 2. Feature-Gated Prompts
```typescript
// Prompt before accessing premium features
const handleAccessPremiumFeature = () => {
  if (isAnonymous) {
    showPrompt("Premium Feature Access");
    return;
  }
  // Continue with feature
};
```

### 3. User Menu Integration
```typescript
// Show upgrade option in user menu
{user?.isAnonymous ? (
  <DropdownMenuItem onClick={() => router.push("/login")}>
    <Sparkles className="mr-2 size-4" />
    <span>Save Data Permanently</span>
  </DropdownMenuItem>
) : (
  <DropdownMenuItem onClick={handleLogout}>
    <LogOut className="mr-2 size-4" />
    <span>Log out</span>
  </DropdownMenuItem>
)}
```

## Best Practices

### 1. Progressive Disclosure
- Let users start immediately without authentication
- Show upgrade prompts at natural moments (after creating valuable data)
- Don't be overly aggressive with prompts

### 2. Clear Value Proposition
- Explain benefits: "Save data permanently", "Sync across devices"
- Show what they'll lose if they don't upgrade
- Make the upgrade process feel rewarding, not mandatory

### 3. Seamless Migration
- Handle all data migration automatically
- Preserve user customizations (settings, preferences)
- Ensure no data loss during the process

### 4. Error Handling
- Graceful fallbacks if migration fails
- Clear error messages
- Retry mechanisms for transient failures

## Security Considerations

### 1. Data Validation
- Verify anonymous user ownership before migration
- Validate that the user has permission to access the data
- Ensure proper cleanup of anonymous accounts

### 2. Rate Limiting
- Prevent abuse of the anonymous account creation
- Limit the number of upgrades per email/session

### 3. Privacy
- Anonymous users should have proper data isolation
- No cross-contamination between anonymous sessions
- Proper cleanup of temporary data

## Testing Strategy

### 1. Happy Path
- Create anonymous user → Add data → Upgrade → Verify migration

### 2. Edge Cases
- Multiple anonymous users with same email
- Failed migration scenarios
- Network interruptions during upgrade

### 3. Data Integrity
- Verify all splits are migrated correctly
- Ensure settings are preserved
- Check that user relationships are maintained

## Monitoring

### 1. Metrics to Track
- Anonymous user conversion rate
- Data migration success rate
- Time from first use to upgrade
- User retention after upgrade

### 2. Error Monitoring
- Failed migrations
- Authentication errors during upgrade
- Data consistency issues

## Future Enhancements

### 1. Email Upgrade Flow
- Allow upgrade via email/password in addition to OAuth
- Email verification for anonymous users

### 2. Bulk Migration Tools
- Admin tools for handling large-scale migrations
- Data export for users who don't upgrade

### 3. Advanced Prompts
- Smart timing based on user behavior
- A/B testing for prompt effectiveness
- Personalized upgrade messaging

## Common Issues & Solutions

### Issue: "User already exists" Error
**Solution**: Check if the email already has a non-anonymous account

### Issue: Data Migration Fails
**Solution**: Implement retry logic and proper error handling

### Issue: Authentication State Confusion
**Solution**: Clear cache and refresh user queries after upgrade

### Issue: Settings Not Preserved
**Solution**: Ensure proper merge strategy in migration function

## Conclusion

This anonymous user upgrade system provides a smooth onboarding experience while ensuring data preservation. Users can start using your app immediately and upgrade when they see value, creating a natural conversion funnel that respects user choice while encouraging long-term engagement.
