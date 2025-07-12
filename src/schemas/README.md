# Schema Documentation

This directory contains comprehensive Zod schemas for all entities in the StudentManager application. These schemas provide type safety, validation, and consistent data structures across the application.

## Overview

The schemas are organized into the following categories:

- **Common Schemas**: Shared enums, patterns, and utilities
- **Core Entity Schemas**: Main business entities (Songs, Lessons, Tasks, etc.)
- **Legacy Schemas**: Existing schemas maintained for backward compatibility

## Schema Structure

### CommonSchema.ts

Contains shared enums, validation patterns, and utility functions used across all schemas.

**Key Components:**

- `DifficultyLevelEnum`: beginner, intermediate, advanced
- `MusicKeyEnum`: All musical keys (C, C#, D, etc.)
- `FileTypeEnum`: audio, video, pdf, image, document
- Validation patterns: UUID, Email, URL, Date, Time
- Utility functions for validation and formatting

### SongSchema.ts

Comprehensive schema for song management with validation, filtering, and search capabilities.

**Key Features:**

- Full CRUD operations (Create, Read, Update, Delete)
- Search and filtering capabilities
- Import/Export functionality
- Statistics and analytics
- Lesson integration

**Main Schemas:**

- `SongSchema`: Core song validation
- `SongInputSchema`: For creating new songs
- `SongUpdateSchema`: For updating existing songs
- `SongFilterSchema`: For filtering songs
- `SongSearchSchema`: For searching songs
- `SongStatsSchema`: For song statistics

### LessonSchema.ts

Schema for lesson management with student-teacher relationships and song assignments.

**Key Features:**

- Lesson scheduling and management
- Student-teacher relationships
- Song assignments with learning status
- Profile integration

**Main Schemas:**

- `LessonSchema`: Core lesson validation
- `LessonInputSchema`: For creating new lessons
- `LessonWithProfilesSchema`: Lesson with user profiles
- `LessonSongSchema`: Song assignments within lessons

### TaskSchema.ts

Schema for task management with priority levels, categories, and assignee tracking.

**Key Features:**

- Task priority and status management
- Category-based organization
- Assignee tracking
- Due date management
- Tags and external links

**Main Schemas:**

- `TaskSchema`: Core task validation
- `TaskInputSchema`: For creating new tasks
- `TaskUpdateSchema`: For updating tasks
- `TaskWithAssigneeSchema`: Task with assignee profiles
- `TaskFilterSchema`: For filtering tasks
- `TaskSortSchema`: For sorting tasks

### AssignmentSchema.ts

Schema for student assignments with teacher-student relationships.

**Key Features:**

- Assignment creation and tracking
- Due date management
- Status calculation
- Teacher-student relationships

**Main Schemas:**

- `AssignmentSchema`: Core assignment validation
- `AssignmentInputSchema`: For creating assignments
- `AssignmentUpdateSchema`: For updating assignments
- `AssignmentWithProfilesSchema`: Assignment with user profiles

### UserSchema.ts

Schema for user management with role-based permissions and authentication.

**Key Features:**

- User registration and authentication
- Role-based permissions (student, teacher, admin)
- Profile management
- Password management

**Main Schemas:**

- `UserSchema`: Core user validation
- `UserInputSchema`: For creating users
- `UserUpdateSchema`: For updating users
- `UserRegistrationSchema`: For user registration
- `UserAuthSchema`: For authentication
- `UserPasswordChangeSchema`: For password changes

### UserFavoriteSchema.ts

Schema for user favorite songs management.

**Key Features:**

- Favorite song tracking
- User-song relationships
- Search and filtering

**Main Schemas:**

- `UserFavoriteSchema`: Core favorite validation
- `UserFavoriteInputSchema`: For creating favorites
- `UserFavoriteWithSongSchema`: Favorite with song details

## Usage Examples

### Basic Validation

```typescript
import { SongInputSchema, LessonSchema } from "@/schemas";

// Validate song input
const songData = {
  title: "Wonderwall",
  author: "Oasis",
  level: "intermediate",
  key: "C",
  ultimate_guitar_link: "https://www.ultimate-guitar.com/wonderwall",
};

const validatedSong = SongInputSchema.parse(songData);
```

### Form Validation

```typescript
import { UserRegistrationSchema } from "@/schemas";

// Validate registration form
const formData = {
  email: "user@example.com",
  password: "securepassword123",
  firstName: "John",
  lastName: "Doe",
};

const validatedUser = UserRegistrationSchema.parse(formData);
```

### API Response Validation

```typescript
import { SongSchema, APIResponseSchema } from "@/schemas";

// Validate API response
const apiResponse = {
  data: songData,
  status: 200,
  message: "Song created successfully",
};

const validatedResponse = APIResponseSchema.parse(apiResponse);
```

### Filtering and Sorting

```typescript
import { SongFilterSchema, TaskSortSchema } from "@/schemas";

// Validate filter parameters
const filterParams = {
  level: "beginner",
  key: "C",
  search: "guitar",
};

const validatedFilter = SongFilterSchema.parse(filterParams);

// Validate sort parameters
const sortParams = {
  field: "created_at",
  direction: "desc",
};

const validatedSort = TaskSortSchema.parse(sortParams);
```

## Validation Patterns

### UUID Validation

```typescript
import { validateUUID } from "@/schemas";

const isValid = validateUUID("123e4567-e89b-12d3-a456-426614174000");
```

### Email Validation

```typescript
import { validateEmail } from "@/schemas";

const isValid = validateEmail("user@example.com");
```

### Date Validation

```typescript
import { validateDate } from "@/schemas";

const isValid = validateDate("2024-01-15T10:30:00Z");
```

## Error Handling

All schemas provide detailed error messages for validation failures:

```typescript
import { SongInputSchema } from "@/schemas";

try {
  const song = SongInputSchema.parse(invalidData);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log("Validation errors:", error.errors);
    // Error format:
    // [
    //   {
    //     code: "invalid_type",
    //     expected: "string",
    //     received: "undefined",
    //     path: ["title"],
    //     message: "Title is required"
    //   }
    // ]
  }
}
```

## Type Safety

All schemas export TypeScript types for use throughout the application:

```typescript
import type { Song, Lesson, Task, User } from "@/schemas";

function processSong(song: Song) {
  // TypeScript will provide full type safety
  console.log(song.title, song.author, song.level);
}
```

## Best Practices

1. **Always validate input data** using the appropriate schema
2. **Use TypeScript types** for better development experience
3. **Handle validation errors** gracefully with user-friendly messages
4. **Use specific schemas** for different operations (Input, Update, Filter, etc.)
5. **Leverage common patterns** from CommonSchema for consistency
6. **Test validation logic** to ensure data integrity

## Migration Guide

When updating existing code to use these schemas:

1. Replace manual validation with schema validation
2. Update TypeScript interfaces to use schema types
3. Update API endpoints to use schema validation
4. Update form components to use schema validation
5. Update error handling to use Zod error format

## Contributing

When adding new schemas:

1. Follow the existing naming conventions
2. Include comprehensive validation rules
3. Export TypeScript types
4. Add usage examples
5. Update this documentation
6. Include tests for the new schema
