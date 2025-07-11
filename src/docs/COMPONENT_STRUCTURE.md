# Component Structure Standards

## Overview

This document defines the standardized component structure for the StudentManager application to ensure consistency, maintainability, and scalability.

## Directory Structure

```
src/
├── components/
│   ├── ui/                    # Global UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layout/                # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   ├── common/                # Shared business components
│   │   ├── LoadingComponent.tsx
│   │   ├── ErrorComponent.tsx
│   │   ├── SearchBar.tsx
│   │   └── ...
│   ├── forms/                 # Form components and utilities
│   │   ├── FormField.tsx
│   │   ├── FormValidation.tsx
│   │   └── ...
│   └── features/              # Feature-specific components
│       ├── auth/
│       │   ├── LoginForm.tsx
│       │   └── SignupForm.tsx
│       ├── dashboard/
│       │   ├── DashboardCard.tsx
│       │   └── DashboardStats.tsx
│       ├── songs/
│       │   ├── SongCard.tsx
│       │   └── SongList.tsx
│       ├── lessons/
│       │   ├── LessonCard.tsx
│       │   └── LessonForm.tsx
│       └── assignments/
│           ├── AssignmentCard.tsx
│           └── AssignmentForm.tsx
├── app/
│   ├── dashboard/
│   │   ├── songs/
│   │   │   ├── @components/   # Route-specific components
│   │   │   │   ├── SongTable.tsx
│   │   │   │   └── SongFilters.tsx
│   │   │   └── page.tsx
│   │   └── lessons/
│   │       ├── @components/   # Route-specific components
│   │       │   ├── LessonTable.tsx
│   │       │   └── LessonFilters.tsx
│   │       └── page.tsx
│   └── auth/
│       ├── @components/       # Auth-specific components
│       │   ├── AuthForm.tsx
│       │   └── AuthLayout.tsx
│       └── page.tsx
```

## Component Classification Rules

### 1. Global Components (`src/components/`)

**UI Components** (`src/components/ui/`):

- Pure UI primitives with no business logic
- Reusable across the entire application
- Examples: Button, Input, Card, Modal, etc.

**Layout Components** (`src/components/layout/`):

- Page layout and navigation components
- Examples: Sidebar, Navbar, Footer, etc.

**Common Components** (`src/components/common/`):

- Shared business logic components
- Used across multiple features
- Examples: LoadingComponent, ErrorComponent, SearchBar, etc.

**Form Components** (`src/components/forms/`):

- Form-related components and utilities
- Form validation, field components, etc.

### 2. Feature Components (`src/components/features/`)

- Business logic components specific to a feature
- Can be reused across different routes within the same feature
- Examples: SongCard, LessonForm, AssignmentList, etc.

### 3. Route Components (`src/app/*/@components/`)

- Components specific to a single route
- Only used within that route
- Examples: SongTable for `/dashboard/songs`, LessonFilters for `/dashboard/lessons`

## Naming Conventions

### File Names

- Use PascalCase for component files: `SongCard.tsx`
- Use camelCase for utility files: `songUtils.ts`
- Use kebab-case for CSS files: `song-card.module.css`

### Component Names

- Use PascalCase for component names: `SongCard`
- Use descriptive names that indicate the component's purpose
- Avoid generic names like `Component` or `Item`

### Directory Names

- Use kebab-case for directory names: `song-management/`
- Use descriptive names that indicate the feature or purpose

## Import Patterns

### Global Components

```typescript
// UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Layout components
import { Sidebar } from "@/components/layout/Sidebar";

// Common components
import { LoadingComponent } from "@/components/common/LoadingComponent";
```

### Feature Components

```typescript
// Feature-specific components
import { SongCard } from "@/components/features/songs/SongCard";
import { LessonForm } from "@/components/features/lessons/LessonForm";
```

### Route Components

```typescript
// Route-specific components
import { SongTable } from "./@components/SongTable";
import { LessonFilters } from "./@components/LessonFilters";
```

## Migration Guidelines

### When to Move a Component

1. **To Global Components**:

   - Used across multiple features
   - No feature-specific business logic
   - Pure UI or utility components

2. **To Feature Components**:

   - Used within a specific feature domain
   - Contains feature-specific business logic
   - Could be reused across routes within the same feature

3. **To Route Components**:
   - Only used within a single route
   - Route-specific layout or logic
   - Not reusable outside the route

### Migration Checklist

- [ ] Identify component usage across the codebase
- [ ] Determine appropriate classification (Global/Feature/Route)
- [ ] Move component to correct location
- [ ] Update all import statements
- [ ] Update test file locations
- [ ] Update documentation
- [ ] Run tests to ensure everything works

## Best Practices

1. **Single Responsibility**: Each component should have a single, clear purpose
2. **Reusability**: Design components to be reusable when possible
3. **Consistency**: Follow established patterns and conventions
4. **Documentation**: Document complex components and their usage
5. **Testing**: Write tests for components, especially shared ones
6. **Performance**: Consider performance implications when designing components

## Examples

### Good Component Structure

```
src/components/features/songs/
├── SongCard.tsx          # Reusable song card component
├── SongList.tsx          # Song list component
├── SongForm.tsx          # Song form component
└── hooks/
    ├── useSongFiltering.ts
    └── useSongSorting.ts
```

### Route-Specific Components

```
src/app/dashboard/songs/@components/
├── SongTable.tsx         # Specific to songs page
├── SongFilters.tsx       # Specific to songs page
└── SongPagination.tsx    # Specific to songs page
```

This structure ensures clear separation of concerns, maintainability, and scalability for the StudentManager application.
