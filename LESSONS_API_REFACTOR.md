# Lessons API Refactor Summary

This document summarizes the changes made to refactor the lessons functionality to use API endpoints similar to how songs are structured.

## Changes Made

### 1. Created API Endpoints

#### `/api/lessons/route.ts` - Main lessons endpoint
- **GET**: Fetches lessons with filtering and sorting
- Supports query parameters: `userId`, `sort`, `filter`
- Returns lessons with profile information for both student and teacher
- Includes proper authentication and authorization checks

#### `/api/lessons/[id]/route.ts` - Individual lesson endpoint
- **GET**: Fetches a specific lesson by ID
- **PUT**: Updates lesson details (title, notes, date, time, status)
- **DELETE**: Deletes a lesson
- All methods include authentication and authorization checks
- Only admins and teachers can modify/delete lessons

#### `/api/lessons/create/route.ts` - Create lesson endpoint
- **POST**: Creates a new lesson
- Uses the `increment_lesson_number` RPC function to auto-assign lesson numbers
- Includes all the same validation as the original server action
- Requires admin or teacher permissions

### 2. Created Helper Functions

#### `src/app/dashboard/lessons/api/fetchLessons.ts`
- `fetchLessonsData()`: Fetches lessons with optional filtering and sorting
- `fetchLessonData()`: Fetches a single lesson by ID
- Similar structure to the songs `fetchSongsData` function
- Handles API errors and returns proper responses

### 3. Updated Pages to Use APIs

#### Main Lessons Page (`src/app/dashboard/lessons/page.tsx`)
- Replaced direct Supabase queries with API calls
- Uses `fetchLessonsData()` and `fetchProfilesData()` helper functions
- Added proper error handling with try-catch blocks
- Maintains the same functionality but now goes through APIs

#### Individual Lesson Page (`src/app/dashboard/lessons/[slug]/page.tsx`)
- Replaced direct Supabase queries with `fetchLessonData()` API call
- Uses profile data from the API response instead of separate queries
- Added proper error handling

### 4. Updated Server Actions

#### Create Lesson (`src/app/dashboard/lessons/create/actions.ts`)
- Replaced direct Supabase operations with API call to `/api/lessons/create`
- Maintains the same form data handling
- Uses cookies for authentication

#### Update Lesson (`src/app/dashboard/lessons/[slug]/edit/action.ts`)
- Replaced direct Supabase operations with API call to `/api/lessons/[id]`
- Uses PUT method for updates
- Includes all form fields including status

#### Delete Lesson (`src/app/dashboard/lessons/[slug]/actions.ts`)
- Replaced direct Supabase operations with API call to `/api/lessons/[id]`
- Uses DELETE method
- Simplified error handling

## Benefits of This Refactor

1. **Consistent Architecture**: Lessons now follow the same pattern as songs
2. **Better Separation of Concerns**: Business logic is centralized in API routes
3. **Improved Error Handling**: Centralized error handling in API endpoints
4. **Authentication/Authorization**: Consistent auth checks across all endpoints
5. **Reusability**: API endpoints can be used by other parts of the application
6. **Maintainability**: Easier to modify database queries in one place

## API Endpoints Summary

```
GET    /api/lessons                 - List lessons with filtering
GET    /api/lessons/[id]           - Get specific lesson
PUT    /api/lessons/[id]           - Update lesson
DELETE /api/lessons/[id]           - Delete lesson
POST   /api/lessons/create         - Create new lesson
```

## Authentication & Authorization

All endpoints require:
- Valid user session (checked via Supabase auth)
- For write operations (POST, PUT, DELETE): User must have `admin` or `teacher` role

## Data Flow

### Before (Direct Supabase):
`Page Component` → `Server Action` → `Supabase Client` → `Database`

### After (API-based):
`Page Component` → `API Helper` → `API Route` → `Supabase Client` → `Database`

This matches the pattern used by the songs functionality and provides better structure and maintainability.