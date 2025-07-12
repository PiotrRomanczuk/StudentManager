# Lesson API Routes Documentation

This document provides comprehensive documentation for all lesson-related API routes in the StudentManager application.

## Base URL

All lesson API routes are prefixed with `/api/lessons`

## Authentication

All routes require authentication. Include the user's session cookie in requests.

## Routes Overview

### Core Lesson Management

#### 1. GET /api/lessons

**Description**: Retrieve all lessons with optional filtering and sorting

**Query Parameters**:

- `userId` (optional): Filter lessons by student or teacher ID
- `sort` (optional): Sort field (`date`, `lesson_number`, `created_at`)
- `filter` (optional): Filter by status (`SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `RESCHEDULED`)

**Response**:

```json
{
  "lessons": [
    {
      "id": "uuid",
      "student_id": "uuid",
      "teacher_id": "uuid",
      "title": "Lesson Title",
      "notes": "Lesson notes",
      "date": "2024-01-15T10:00:00Z",
      "time": "10:00",
      "status": "SCHEDULED",
      "profile": {
        "email": "student@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "teacher_profile": {
        "email": "teacher@example.com",
        "firstName": "Jane",
        "lastName": "Smith"
      }
    }
  ]
}
```

#### 2. POST /api/lessons

**Description**: Create a new lesson

**Request Body**:

```json
{
  "student_id": "uuid",
  "teacher_id": "uuid",
  "title": "Lesson Title",
  "notes": "Lesson notes",
  "date": "2024-01-15T10:00:00Z",
  "time": "10:00",
  "status": "SCHEDULED"
}
```

**Response**: Created lesson object

#### 3. GET /api/lessons/[id]

**Description**: Retrieve a specific lesson by ID

**Response**: Single lesson object with profile information

#### 4. PUT /api/lessons/[id]

**Description**: Update a specific lesson

**Request Body**: Partial lesson data
**Response**: Updated lesson object

#### 5. DELETE /api/lessons/[id]

**Description**: Delete a specific lesson

**Response**: `{ "success": true }`

### Lesson Songs Management

#### 6. GET /api/lessons/songs

**Description**: Retrieve songs assigned to lessons

**Query Parameters**:

- `lessonId` (required): Lesson ID to filter by
- `songId` (optional): Specific song ID
- `studentId` (optional): Student ID filter

**Response**:

```json
{
  "lessonSongs": [
    {
      "id": "uuid",
      "lesson_id": "uuid",
      "song_id": "uuid",
      "song_status": "started",
      "student_id": "uuid",
      "song": {
        "title": "Song Title",
        "author": "Artist",
        "level": "intermediate",
        "key": "C"
      },
      "lesson": {
        "title": "Lesson Title",
        "date": "2024-01-15T10:00:00Z",
        "status": "SCHEDULED"
      }
    }
  ]
}
```

#### 7. POST /api/lessons/songs

**Description**: Assign a song to a lesson

**Request Body**:

```json
{
  "lesson_id": "uuid",
  "song_id": "uuid",
  "song_status": "started",
  "student_id": "uuid"
}
```

**Response**: Created lesson song assignment

#### 8. GET /api/lessons/songs/[id]

**Description**: Retrieve a specific lesson song assignment

**Response**: Single lesson song assignment with full details

#### 9. PUT /api/lessons/songs/[id]

**Description**: Update song status in a lesson

**Request Body**:

```json
{
  "song_status": "mastered"
}
```

**Response**: Updated lesson song assignment

#### 10. DELETE /api/lessons/songs/[id]

**Description**: Remove a song from a lesson

**Response**: `{ "success": true }`

### Advanced Search and Filtering

#### 11. GET /api/lessons/search

**Description**: Advanced search with multiple filters

**Query Parameters**:

- `q` (optional): Search query for title and notes
- `status` (optional): Filter by lesson status
- `studentId` (optional): Filter by student ID
- `teacherId` (optional): Filter by teacher ID
- `dateFrom` (optional): Filter by start date
- `dateTo` (optional): Filter by end date
- `sortBy` (optional): Sort field (`title`, `date`, `created_at`, `updated_at`, `lesson_number`)
- `sortOrder` (optional): Sort direction (`asc`, `desc`)
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response**:

```json
{
  "lessons": [...],
  "total": 50,
  "limit": 20,
  "offset": 0,
  "hasMore": true
}
```

### Statistics and Analytics

#### 12. GET /api/lessons/stats

**Description**: Get lesson statistics and analytics

**Query Parameters**:

- `userId` (optional): Filter stats by user
- `dateFrom` (optional): Start date for stats
- `dateTo` (optional): End date for stats

**Response**:

```json
{
  "total": 150,
  "byStatus": {
    "SCHEDULED": 45,
    "IN_PROGRESS": 12,
    "COMPLETED": 85,
    "CANCELLED": 5,
    "RESCHEDULED": 3
  },
  "monthly": [
    {
      "month": "2024-01",
      "count": 25
    }
  ],
  "lessonsWithSongs": 120,
  "avgLessonsPerStudent": 8.5,
  "upcoming": 15,
  "completedThisMonth": 12,
  "dateRange": {
    "from": "2024-01-01T00:00:00Z",
    "to": "2024-12-31T23:59:59Z"
  }
}
```

### Bulk Operations

#### 13. POST /api/lessons/bulk

**Description**: Create multiple lessons at once

**Request Body**:

```json
{
  "lessons": [
    {
      "student_id": "uuid",
      "teacher_id": "uuid",
      "title": "Lesson 1",
      "date": "2024-01-15T10:00:00Z"
    },
    {
      "student_id": "uuid",
      "teacher_id": "uuid",
      "title": "Lesson 2",
      "date": "2024-01-16T10:00:00Z"
    }
  ]
}
```

**Response**:

```json
{
  "created": [...],
  "errors": [...],
  "total": 2,
  "success": 2,
  "failed": 0
}
```

#### 14. PUT /api/lessons/bulk

**Description**: Update multiple lessons at once

**Request Body**:

```json
{
  "updates": [
    {
      "id": "uuid",
      "title": "Updated Title",
      "status": "COMPLETED"
    }
  ]
}
```

**Response**: Similar to POST with updated lessons

#### 15. DELETE /api/lessons/bulk

**Description**: Delete multiple lessons at once

**Request Body**:

```json
{
  "lessonIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Response**:

```json
{
  "deleted": ["uuid1", "uuid2"],
  "errors": [...],
  "total": 3,
  "success": 2,
  "failed": 1
}
```

### Data Export

#### 16. GET /api/lessons/export

**Description**: Export lessons data in various formats

**Query Parameters**:

- `format` (optional): Export format (`json`, `csv`) - default: `json`
- `userId` (optional): Filter by user
- `status` (optional): Filter by status
- `dateFrom` (optional): Start date filter
- `dateTo` (optional): End date filter
- `includeSongs` (optional): Include song assignments (`true`/`false`)
- `includeProfiles` (optional): Include user profiles (`true`/`false`)

**Response**: File download with exported data

## Error Handling

All routes return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

Common HTTP status codes:

- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (e.g., song already assigned)
- `500`: Internal Server Error

## Permissions

- **Students**: Can view their own lessons and assigned songs
- **Teachers**: Can view, create, update, and delete lessons for their students
- **Admins**: Full access to all lesson operations

## Rate Limiting

- Bulk operations limited to 100 items per request
- Search results limited to 100 items per page
- Export limited to 1000 lessons per request

## Data Validation

All routes use Zod schemas for validation:

- `LessonInputSchema`: For creating lessons
- `LessonSchema`: For lesson data validation
- `LessonSongSchema`: For song assignments
- `LessonStatusEnum`: For status validation

## Examples

### Create a lesson with songs

```bash
# 1. Create lesson
POST /api/lessons
{
  "student_id": "student-uuid",
  "teacher_id": "teacher-uuid",
  "title": "Guitar Basics",
  "date": "2024-01-15T10:00:00Z",
  "time": "10:00"
}

# 2. Assign songs to lesson
POST /api/lessons/songs
{
  "lesson_id": "lesson-uuid",
  "song_id": "song-uuid",
  "song_status": "started",
  "student_id": "student-uuid"
}
```

### Search lessons with filters

```bash
GET /api/lessons/search?q=guitar&status=SCHEDULED&dateFrom=2024-01-01&sortBy=date&sortOrder=asc&limit=10
```

### Export lesson data

```bash
GET /api/lessons/export?format=csv&includeSongs=true&includeProfiles=true&status=COMPLETED
```

### Bulk create lessons

```bash
POST /api/lessons/bulk
{
  "lessons": [
    {
      "student_id": "student-uuid",
      "teacher_id": "teacher-uuid",
      "title": "Week 1",
      "date": "2024-01-15T10:00:00Z"
    },
    {
      "student_id": "student-uuid",
      "teacher_id": "teacher-uuid",
      "title": "Week 2",
      "date": "2024-01-22T10:00:00Z"
    }
  ]
}
```
