# Students Page Components

This directory contains the components for the students page, split into smaller, more manageable pieces for better maintainability and reusability.

## Component Structure

### Core Components

- **`StudentsCard.tsx`** - Main card wrapper that contains the table
- **`StudentsTable.tsx`** - Table component that renders the student data
- **`SortableHeader.tsx`** - Individual sortable table headers
- **`StudentRow.tsx`** - Individual student table rows
- **`EmptyState.tsx`** - Component shown when no students are found

### Utility Files

- **`types.ts`** - TypeScript interfaces and types
- **`constants.ts`** - Constants and utility functions
- **`data-service.ts`** - Data fetching logic
- **`index.ts`** - Barrel export file for clean imports

## Usage

The main page (`page.tsx`) imports all components from the index file:

```typescript
import {
  StudentsPageProps,
  fetchProfiles,
  StudentsCard,
  EmptyState,
} from "./components";
```

## Benefits of This Structure

1. **Separation of Concerns** - Each component has a single responsibility
2. **Reusability** - Components can be easily reused in other parts of the application
3. **Testability** - Each component can be tested independently
4. **Maintainability** - Smaller components are easier to understand and modify
5. **Type Safety** - Centralized types ensure consistency across components

## Component Hierarchy

```
Page
└── StudentsCard
    └── StudentsTable
        ├── SortableHeader (for each column)
        └── StudentRow (for each student)
```

## Testing

Each component can be tested independently. See `__tests__/StudentsTable.test.tsx` for an example of how to test the components.
