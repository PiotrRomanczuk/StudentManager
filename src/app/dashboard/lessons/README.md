# Lessons Page Implementation

This directory contains the implementation of the lessons management page for the Student Manager application.

## Overview

The lessons page provides a comprehensive interface for viewing, filtering, and managing lessons. It includes:

- **Main Page** (`page.tsx`): The main lessons listing page with filtering and sorting
- **Table Components**: Desktop and mobile responsive table views
- **API Helpers**: Functions for fetching and managing lesson data
- **Filter Components**: UI components for filtering and sorting lessons
- **Detail Pages**: Individual lesson view and management pages

## Key Features

### 1. Lessons Listing Page (`page.tsx`)

- Displays lessons in a responsive table format
- Supports filtering by status and sorting by various fields
- Includes pagination for large datasets
- Shows different views for desktop and mobile
- Admin users can create new lessons

### 2. Table Components

- **LessonsTable.tsx**: Desktop table with full feature set
- **LessonsTableMobile.tsx**: Mobile-optimized card-based view
- Both components support sorting, filtering, and pagination

### 3. API Integration

- **fetchLessons.ts**: API helper for fetching lesson data
- **lesson-api-helpers.ts**: Comprehensive API functions for lesson management
- Supports filtering, sorting, and pagination parameters

### 4. Filter Components

- **LessonFilters.tsx**: UI component for filtering and sorting lessons
- Integrates with URL search parameters for bookmarkable filters

### 5. Individual Lesson Management

- **Detail Page** (`[slug]/page.tsx`): View individual lesson details
- **Edit Page** (`[slug]/edit/page.tsx`): Edit lesson information
- **Song Management** (`[slug]/manage-songs/page.tsx`): Manage songs assigned to lessons

## File Structure

```
lessons/
├── page.tsx                    # Main lessons listing page
├── api/
│   └── fetchLessons.ts        # API helper for fetching lessons
├── @components/
│   └── LessonFilters.tsx      # Filter and sort UI component
├── LessonsTable.tsx           # Desktop table component
├── LessonsTableMobile.tsx     # Mobile table component
├── NoLessons.tsx              # Empty state component
├── lesson-api-helpers.ts      # Comprehensive API functions
├── utils/
│   └── internal/
│       ├── date-formatters.ts # Date formatting utilities
│       └── lesson-helpers.ts  # Lesson data utilities
├── create/
│   ├── page.tsx              # Create new lesson page
│   └── actions.ts            # Server actions for lesson creation
└── [slug]/                   # Individual lesson pages
    ├── page.tsx              # Lesson detail view
    ├── edit/
    │   ├── page.tsx          # Edit lesson page
    │   ├── action.ts         # Update lesson server action
    │   └── LessonEditForm.tsx # Edit form component
    ├── manage-songs/
    │   ├── page.tsx          # Song management page
    │   ├── actions.ts        # Song management server actions
    │   ├── AddSongForm.tsx   # Add song form
    │   └── AssignedSongsList.tsx # Assigned songs list
    └── @components/
        ├── DeleteButton.tsx   # Delete lesson button
        ├── LessonError.tsx    # Error display component
        ├── LessonInformation.tsx # Lesson info display
        ├── NoLesson.tsx       # Lesson not found component
        └── SongInformation.tsx # Song info display
```

## API Integration

The lessons page integrates with the following API endpoints:

- `GET /api/lessons` - Fetch lessons with filtering and pagination
- `GET /api/lessons/[id]` - Fetch individual lesson details
- `POST /api/lessons` - Create new lesson
- `PUT /api/lessons/[id]` - Update lesson
- `DELETE /api/lessons/[id]` - Delete lesson
- `GET /api/lessons/songs` - Fetch songs for a lesson
- `POST /api/lessons/songs` - Assign song to lesson
- `DELETE /api/lessons/songs/[id]` - Remove song from lesson

## Usage

### Basic Usage

```tsx
// The main page automatically handles:
// - Fetching lessons from the API
// - Displaying them in a responsive table
// - Handling filtering and sorting
// - Managing pagination
// - Error states and loading states
```

### Filtering and Sorting

```tsx
// URL parameters control filtering and sorting:
// ?sort=date&filter=SCHEDULED
// ?sort=lesson_number&filter=COMPLETED
```

### Admin Features

- Admin users see a "Create Lesson" button
- Admin users can edit and delete lessons
- Admin users can manage songs assigned to lessons

## Responsive Design

The lessons page is fully responsive:

- **Desktop**: Full table with all columns visible
- **Mobile**: Card-based layout with essential information
- **Tablet**: Hybrid approach with responsive table

## Error Handling

The implementation includes comprehensive error handling:

- API errors are caught and displayed to users
- Loading states are shown during data fetching
- Empty states are displayed when no lessons exist
- Network errors are handled gracefully

## Performance

- Server-side rendering for initial page load
- Client-side filtering and sorting for responsiveness
- Pagination to handle large datasets
- Optimized re-renders with React best practices
