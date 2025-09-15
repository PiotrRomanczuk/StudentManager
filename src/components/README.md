# Components Organization

This directory contains all reusable components organized by category and functionality.

## Structure

```
src/components/
├── ui/                    # Core UI components
│   ├── forms/            # Form-related components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   └── textarea.tsx
│   ├── layout/           # Layout components
│   │   ├── card.tsx
│   │   ├── container.tsx
│   │   └── skeleton.tsx
│   ├── data-display/     # Data visualization components
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   └── table.tsx
│   ├── navigation/       # Navigation components
│   │   ├── breadcrumb.tsx
│   │   └── pagination.tsx
│   ├── feedback/         # User feedback components
│   │   ├── alert.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── loading-state.tsx
│   │   └── sonner.tsx
│   ├── overlay/          # Overlay components
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── tooltip.tsx
│   └── index.ts          # Main UI exports
├── landingPage/          # Landing page specific components
│   ├── contact/
│   ├── feature/
│   ├── footer/
│   ├── hero/
│   ├── navbar/
│   ├── pricing/
│   ├── team/
│   ├── testimonials/
│   └── index.ts
└── index.ts              # Main components exports
```

## Usage

### Importing UI Components

```typescript
// Import specific components
import { Button, Input, Card } from "@/components/ui";

// Import from specific categories
import { Button } from "@/components/ui/forms";
import { Card } from "@/components/ui/layout";
import { Table } from "@/components/ui/data-display";
```

### Importing Landing Page Components

```typescript
// Import landing page components
import { HeroHome, Navbar, Footer } from "@/components/landingPage";
```

## Component Categories

### Forms (`ui/forms/`)

- **Button**: Primary action component
- **Input**: Text input component
- **Label**: Form label component
- **Select**: Dropdown selection component
- **Switch**: Toggle component
- **Textarea**: Multi-line text input

### Layout (`ui/layout/`)

- **Card**: Container component with header, content, footer
- **Container**: Responsive container wrapper
- **Skeleton**: Loading placeholder component

### Data Display (`ui/data-display/`)

- **Badge**: Status indicator component
- **Progress**: Progress bar component
- **Table**: Data table component with sorting

### Navigation (`ui/navigation/`)

- **Breadcrumb**: Navigation breadcrumb component
- **Pagination**: Page navigation component

### Feedback (`ui/feedback/`)

- **Alert**: Information alert component
- **AlertDialog**: Confirmation dialog component
- **LoadingState**: Loading indicator component
- **Toaster**: Toast notification component

### Overlay (`ui/overlay/`)

- **Dialog**: Modal dialog component
- **DropdownMenu**: Dropdown menu component
- **Tooltip**: Tooltip component

## Best Practices

1. **Consistent Naming**: Use PascalCase for component names
2. **TypeScript**: All components should be typed with TypeScript
3. **Props Interface**: Define clear prop interfaces for each component
4. **Accessibility**: Include proper ARIA attributes and keyboard navigation
5. **Responsive**: Components should work on all screen sizes
6. **Themeable**: Use CSS variables for consistent theming

## Adding New Components

1. Determine the appropriate category for your component
2. Create the component file in the correct subdirectory
3. Export it from the category's `index.ts` file
4. Update this README if adding a new category
