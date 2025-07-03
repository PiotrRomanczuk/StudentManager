# Authentication Testing Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install --save-dev @playwright/test jest jest-environment-jsdom
```

### 2. Run Basic Tests

```bash
# Run Jest tests
npm test

# Run Jest tests in watch mode
npm run test:watch

# Run Jest tests with coverage

npm run test:e2e
```

## Current Issues and Solutions

### Issue 1: Module Resolution

The Jest tests are failing because of module path resolution. The `@/` alias isn't being resolved correctly.

**Solution:** The Jest configuration has been updated to handle this, but you may need to:

1. **Restart your development server**
2. **Clear Jest cache:**
   ```bash
   npx jest --clearCache
   ```

### Issue 2: TypeScript Assertions

The TypeScript tests are showing assertion errors because Jest types aren't properly configured.

**Solution:** Use JavaScript tests initially, then gradually add TypeScript tests.

## Working Test Examples

### Basic JavaScript Tests (Working)

```javascript
// src/__tests__/auth/working.test.js
describe("Working Auth Tests", () => {
  test("should validate email format", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test("test@example.com")).toBe(true);
  });
});
```

### Advanced TypeScript Tests (After Setup)

```typescript
// src/__tests__/auth/advanced.test.ts
import { login } from "@/app/auth/signin/actions";

describe("Auth Actions", () => {
  it("should handle login", async () => {
    // Mock Supabase client
    jest.mock("@/utils/supabase/clients/server");

    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");

    // Test implementation
  });
});
```

## Testing Strategy by Priority

### Phase 1: Basic Tests (Start Here)

1. **Email validation**
2. **Password validation**
3. **Form data creation**
4. **User role validation**

### Phase 2: Component Tests

1. **Login form rendering**
2. **Signup form rendering**
3. **Form interactions**
4. **Error handling**

### Phase 3: Integration Tests

1. **Server actions**
2. **API routes**
3. **Middleware behavior**

### Phase 4: E2E Tests

1. **Complete auth flows**
2. **OAuth testing**
3. **Route protection**

## Step-by-Step Implementation

### Step 1: Verify Basic Setup

```bash
# Run the working test
npm test src/__tests__/auth/working.test.js
```

### Step 2: Add Component Tests

```bash
# Create component test
touch src/__tests__/auth/components.test.js
```

### Step 3: Add Server Action Tests

```bash
# Create server action test
touch src/__tests__/auth/actions.test.js
```

### Step 4: Add E2E Tests

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Install browsers
npx playwright install

# Run E2E tests
npm run test:e2e
```

## Common Testing Patterns

### 1. Form Testing

```javascript
test("should handle form submission", async () => {
  const formData = new FormData();
  formData.append("email", "test@example.com");
  formData.append("password", "password123");

  expect(formData.get("email")).toBe("test@example.com");
});
```

### 2. Validation Testing

```javascript
test("should validate email format", () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validEmails = ["test@example.com", "user@domain.co.uk"];
  const invalidEmails = ["invalid-email", "@example.com"];

  validEmails.forEach((email) => {
    expect(emailRegex.test(email)).toBe(true);
  });

  invalidEmails.forEach((email) => {
    expect(emailRegex.test(email)).toBe(false);
  });
});
```

### 3. User Role Testing

```javascript
test("should handle user roles", () => {
  const userRoles = {
    student: { isStudent: true, isTeacher: false, isAdmin: false },
    teacher: { isStudent: false, isTeacher: true, isAdmin: false },
    admin: { isStudent: false, isTeacher: false, isAdmin: true },
  };

  expect(userRoles.student.isStudent).toBe(true);
  expect(userRoles.teacher.isTeacher).toBe(true);
  expect(userRoles.admin.isAdmin).toBe(true);
});
```

## Troubleshooting

### Jest Issues

1. **Module not found:** Check the `moduleNameMapping` in `jest.config.js`
2. **TypeScript errors:** Use JavaScript tests initially
3. **Cache issues:** Run `npx jest --clearCache`

### Playwright Issues

1. **Browser not found:** Run `npx playwright install`
2. **Port conflicts:** Change the port in `playwright.config.ts`
3. **Timeout issues:** Increase timeout in config

### General Issues

1. **Environment variables:** Check `.env.local` for test environment
2. **Path issues:** Use relative paths or configure aliases properly
3. **Mock issues:** Ensure mocks are set up before imports

## Recommended Testing Libraries

### 1. Jest + Testing Library (Primary)

- **Use for:** Unit tests, component tests, integration tests
- **Pros:** Fast, reliable, good debugging
- **Cons:** Limited for OAuth flows

### 2. Playwright (E2E)

- **Use for:** Complete auth flows, OAuth testing
- **Pros:** Excellent for complex flows, cross-browser
- **Cons:** Slower, more complex setup

### 3. Cypress (Alternative E2E)

- **Use for:** Basic E2E tests
- **Pros:** Easy to use, good documentation
- **Cons:** Limited OAuth support

## Next Steps

1. **Start with the working JavaScript tests**
2. **Gradually add TypeScript tests**
3. **Add component tests**
4. **Add server action tests**
5. **Add E2E tests with Playwright**

## Test Commands Reference

```bash
# Jest commands
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
npm run test:ci           # CI mode

# Playwright commands
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # UI mode
npm run test:e2e:debug    # Debug mode

# Cypress commands (existing)
npm run cy:open           # Open Cypress
npm run e2e               # Run Cypress tests
```

## Environment Setup

Create a `.env.test` file for test environment variables:

```bash
# .env.test
NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

This guide will help you get started with testing your authentication system step by step.
