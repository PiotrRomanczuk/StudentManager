# Dashboard Error Handling System

This directory contains a comprehensive error handling system for the dashboard, providing consistent and user-friendly error pages across the application.

## Components

### DashboardErrorSite

The main error component that displays different types of errors with appropriate styling and actions.

**Features:**

- 6 different error types (auth, network, permission, data, server, unknown)
- Automatic error type detection
- Customizable actions and navigation
- Error tracking with unique IDs
- Responsive design
- Loading states for retry actions

**Usage:**

```tsx
import { DashboardErrorSite } from "./@components/DashboardErrorSite";

// Basic usage
<DashboardErrorSite
  error="Failed to load songs"
  errorType="data"
/>

// Advanced usage with custom actions
<DashboardErrorSite
  error="Network connection failed"
  errorType="network"
  statusCode={503}
  retryAction={async () => {
    // Custom retry logic
    await refetchData();
  }}
  showHomeButton={true}
  showBackButton={true}
  backUrl="/dashboard/songs"
  additionalInfo="This error occurred while trying to fetch song data."
  errorId="NETWORK-ERR-123"
/>
```

### Error Utilities

Utility functions to help with error handling and type detection.

**Functions:**

- `determineErrorType(error, statusCode)` - Automatically determines error type
- `generateErrorId()` - Creates unique error IDs for tracking
- `getAdditionalInfo(errorType, error)` - Provides contextual help based on error type
- `createErrorConfig(error, statusCode, errorId)` - Creates complete error configuration
- `handleCommonErrors(error, context)` - Handles common error scenarios

**Usage:**

```tsx
import { handleCommonErrors } from "./@components/error-utils";

try {
  // Some operation that might fail
  await fetchData();
} catch (error) {
  const errorConfig = handleCommonErrors(error, "Failed to load songs");
  return <DashboardErrorSite {...errorConfig} />;
}
```

## Error Types

### 1. Authentication Error (`auth`)

- **When to use:** User needs to sign in or authentication failed
- **Visual style:** Orange theme
- **Actions:** Sign In, Sign Up
- **Status codes:** 401

### 2. Network Error (`network`)

- **When to use:** Connection issues, timeouts, server unavailable
- **Visual style:** Blue theme
- **Actions:** Try Again, Check Connection
- **Status codes:** 503, 504

### 3. Permission Error (`permission`)

- **When to use:** User lacks required permissions
- **Visual style:** Red theme
- **Actions:** Go Home, Contact Admin
- **Status codes:** 403

### 4. Data Error (`data`)

- **When to use:** Data not found, loading failures
- **Visual style:** Purple theme
- **Actions:** Try Again, Refresh Page
- **Status codes:** 404

### 5. Server Error (`server`)

- **When to use:** Internal server errors
- **Visual style:** Gray theme
- **Actions:** Try Again, Go Home
- **Status codes:** 500, 502

### 6. Unknown Error (`unknown`)

- **When to use:** Generic error handling
- **Visual style:** Gray theme
- **Actions:** Try Again, Go Home
- **Status codes:** Any other

## Integration Examples

### Replacing Existing ErrorComponent

**Before:**

```tsx
import { ErrorComponent } from "./@components/ErrorComponent";

return <ErrorComponent error="Failed to load data" />;
```

**After:**

```tsx
import { DashboardErrorSite } from "./@components/DashboardErrorSite";
import { handleCommonErrors } from "./@components/error-utils";

const errorConfig = handleCommonErrors(error, "Failed to load data");
return <DashboardErrorSite {...errorConfig} />;
```

### API Error Handling

```tsx
async function fetchSongs() {
  try {
    const response = await fetch("/api/songs");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    const errorConfig = handleCommonErrors(error, "Failed to fetch songs");
    return <DashboardErrorSite {...errorConfig} />;
  }
}
```

### Authentication Error Handling

```tsx
import { DashboardErrorSite } from "./@components/DashboardErrorSite";

if (!user) {
  return (
    <DashboardErrorSite
      error="Please sign in to view your dashboard"
      errorType="auth"
      statusCode={401}
    />
  );
}
```

## Best Practices

1. **Use the utility functions** for automatic error type detection
2. **Provide meaningful error messages** that help users understand what went wrong
3. **Include error IDs** for debugging and support
4. **Add contextual information** when possible
5. **Test different error scenarios** using the error examples page
6. **Keep error messages user-friendly** while providing technical details for debugging

## Testing

Visit `/dashboard/error-examples` to see all error types in action and test the error handling system.

## Migration Guide

To migrate from the old `ErrorComponent`:

1. Replace imports:

   ```tsx
   // Old
   import { ErrorComponent } from "./@components/ErrorComponent";

   // New
   import { DashboardErrorSite } from "./@components/DashboardErrorSite";
   ```

2. Update component usage:

   ```tsx
   // Old
   <ErrorComponent error="Error message" />

   // New
   <DashboardErrorSite error="Error message" />
   ```

3. For more advanced usage, use the utility functions:

   ```tsx
   import { handleCommonErrors } from "./@components/error-utils";

   const errorConfig = handleCommonErrors(error, "Context");
   return <DashboardErrorSite {...errorConfig} />;
   ```
