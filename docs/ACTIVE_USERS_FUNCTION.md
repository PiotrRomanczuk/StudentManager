# Active Users Function

This document describes the `getActiveUsers` function that retrieves all users with `isActive` set to `true`.

## Function Overview

The `getActiveUsers` function is located in `src/utils/auth-helpers.ts` and provides a secure way to retrieve all active users from the database.

## Function Signature

```typescript
export async function getActiveUsers(): Promise<Profile[]>;
```

## Features

- **Admin-only access**: Only users with admin privileges can access this function
- **Authentication required**: Users must be authenticated to use this function
- **Error handling**: Comprehensive error handling with specific error messages
- **Type safety**: Returns properly typed Profile objects

## Usage

### Direct Function Call

```typescript
import { getActiveUsers } from "@/utils/auth-helpers";

try {
  const activeUsers = await getActiveUsers();
  console.log("Active users:", activeUsers);
} catch (error) {
  console.error("Error:", error.message);
}
```

### API Endpoint

The function is also available via API endpoint:

```
GET /api/auth/admin/active-users
```

**Response format:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": "uuid-here",
      "email": "user@example.com",
      "isActive": true,
      "isAdmin": false,
      "isStudent": true,
      "isTeacher": false,
      "canEdit": false,
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "bio": "User bio",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

## Error Handling

The function throws specific errors that can be caught and handled:

- **Authentication required**: User is not authenticated (401)
- **Admin access required**: User is not an admin (403)
- **Error fetching active users**: Database error (500)

## Security

- Requires authentication
- Requires admin privileges
- Server-side validation ensures only admins can access user data
- Uses Supabase RLS (Row Level Security) for additional protection

## Database Schema

The function queries the `profiles` table with the following relevant columns:

- `user_id`: UUID of the user
- `email`: User's email address
- `isActive`: Boolean flag indicating if user is active (default: true)
- `isAdmin`: Boolean flag indicating admin status
- `isStudent`: Boolean flag indicating student status
- `isTeacher`: Boolean flag indicating teacher status
- `canEdit`: Boolean flag indicating edit permissions
- `firstName`: User's first name
- `lastName`: User's last name
- `username`: User's username
- `bio`: User's biography
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

## Testing

The function includes comprehensive tests covering:

- Successful retrieval of active users
- Authentication error handling
- Admin access validation
- Database error handling

Run tests with:

```bash
npm test -- src/__tests__/auth/getActiveUsers.test.ts
npm test -- src/__tests__/api/auth/active-users.test.ts
```

## Example Implementation

```typescript
// In a React component
import { useEffect, useState } from "react";

function ActiveUsersList() {
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchActiveUsers() {
      try {
        const response = await fetch("/api/auth/admin/active-users");
        const data = await response.json();

        if (data.success) {
          setActiveUsers(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Failed to fetch active users");
      } finally {
        setLoading(false);
      }
    }

    fetchActiveUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Active Users ({activeUsers.length})</h2>
      <ul>
        {activeUsers.map((user) => (
          <li key={user.id}>
            {user.firstName} {user.lastName} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
```
