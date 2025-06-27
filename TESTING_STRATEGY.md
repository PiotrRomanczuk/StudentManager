# Authentication Testing Strategy

## Overview

This document outlines the recommended testing approach for the StudentManager authentication system, which uses Supabase Auth with Next.js App Router.

## Current Authentication Architecture

- **Supabase Auth** for user management
- **Next.js App Router** with server actions
- **Middleware** for route protection
- **Role-based access** (admin, teacher, student)
- **Google OAuth** integration
- **Server and client-side** Supabase clients

## Recommended Testing Stack

### 1. Jest + Testing Library (Primary - Unit/Integration)

**Best for:**

- Server actions (`login`, `signup`, `logout`)
- Auth utilities and helpers
- API routes
- Middleware logic
- Form validation
- Error handling
- React components

**Pros:**

- ✅ Already installed in the project
- ✅ Fast execution and good debugging
- ✅ Excellent for testing auth logic
- ✅ Easy mocking of Supabase client
- ✅ TypeScript support out of the box
- ✅ Can test auth utilities and hooks
- ✅ Great for testing server actions

**Cons:**

- ❌ Requires more setup for complex auth flows
- ❌ Doesn't test real browser behavior
- ❌ Limited for testing OAuth flows

### 2. Playwright (Recommended for E2E)

**Best for:**

- Complete auth flows
- OAuth testing
- Route protection
- Middleware behavior
- Cross-browser testing
- Mobile responsiveness
- Real user scenarios

**Pros:**

- ✅ Better than Cypress for complex auth flows
- ✅ Excellent for testing OAuth and redirects
- ✅ Better debugging capabilities
- ✅ Can handle multiple tabs/windows
- ✅ Better performance than Cypress
- ✅ Great for testing auth middleware
- ✅ Cross-browser support

**Cons:**

- ❌ Requires new setup
- ❌ Steeper learning curve
- ❌ More complex configuration

### 3. Vitest (Modern Alternative to Jest)

**Best for:**

- Unit tests
- Integration tests
- Component tests
- API route tests

**Pros:**

- ✅ Faster than Jest
- ✅ Better TypeScript support
- ✅ Native ESM support
- ✅ Better watch mode
- ✅ Compatible with Testing Library

**Cons:**

- ❌ Requires migration from Jest
- ❌ Smaller ecosystem than Jest
- ❌ Less documentation/examples

### 4. Cypress (Current - Needs Improvement)

**Best for:**

- Basic auth flows
- Simple E2E scenarios

**Pros:**

- ✅ Already set up in the project
- ✅ Good for basic auth flows
- ✅ Easy to write and debug

**Cons:**

- ❌ Limited for OAuth testing
- ❌ Current tests are failing
- ❌ Poor handling of redirects
- ❌ Can't handle multiple domains easily

## Implementation Plan

### Phase 1: Unit/Integration Tests (Jest + Testing Library)

#### Test Files to Create:

1. **`src/__tests__/auth/actions.test.ts`**

   - Test server actions (`login`, `signup`, `logout`, `signInWithGoogle`)
   - Mock Supabase client
   - Test error handling
   - Test form validation

2. **`src/__tests__/auth/middleware.test.ts`**

   - Test middleware behavior
   - Test route protection
   - Test session handling

3. **`src/__tests__/auth/components.test.tsx`**

   - Test auth components (LoginPage, SignUpPage)
   - Test form interactions
   - Test error states
   - Test loading states

4. **`src/__tests__/auth/utils.test.ts`**

   - Test auth utilities
   - Test profile management
   - Test role checking

5. **`src/__tests__/auth/api.test.ts`**
   - Test API routes
   - Test authentication checks
   - Test error responses

#### Key Testing Patterns:

```typescript
// Mock Supabase client
jest.mock("@/utils/supabase/clients/server");
const mockCreateClient = createClient as jest.MockedFunction<
  typeof createClient
>;

// Test server actions
describe("login", () => {
  it("should successfully log in with valid credentials", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });

    await expect(login(formData)).rejects.toThrow("NEXT_REDIRECT");
  });
});
```

### Phase 2: E2E Tests (Playwright)

#### Test Scenarios:

1. **Complete Auth Flows**

   - Sign up → Email verification → Sign in
   - Sign in → Dashboard access
   - Sign out → Redirect to signin

2. **OAuth Testing**

   - Google OAuth flow
   - OAuth callback handling
   - OAuth error scenarios

3. **Route Protection**

   - Unauthenticated access to protected routes
   - Role-based access control
   - Middleware redirects

4. **Error Handling**

   - Invalid credentials
   - Network errors
   - Server errors

5. **Responsive Testing**
   - Mobile auth flows
   - Tablet auth flows
   - Desktop auth flows

#### Key Testing Patterns:

```typescript
test("should redirect to signin when accessing dashboard without auth", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/.*\/auth\/signin/);
});

test("should handle OAuth flow", async ({ page }) => {
  await page.route("**/auth/v1/authorize**", async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ url: "https://accounts.google.com/oauth" }),
    });
  });

  await page.getByRole("button", { name: "Sign in with Google" }).click();
  await expect(page).toHaveURL(/accounts\.google\.com/);
});
```

### Phase 3: Advanced Testing

#### Integration Tests:

- Database interactions
- Email sending
- Session management
- Token refresh

#### Performance Tests:

- Auth response times
- Concurrent user handling
- Memory usage

#### Security Tests:

- SQL injection prevention
- XSS prevention
- CSRF protection
- Rate limiting

## Test Data Management

### Test Users:

```typescript
const testUsers = {
  student: {
    email: "student@test.com",
    password: "password123",
    role: "student",
  },
  teacher: {
    email: "teacher@test.com",
    password: "password123",
    role: "teacher",
  },
  admin: {
    email: "admin@test.com",
    password: "password123",
    role: "admin",
  },
};
```

### Test Database:

- Use separate test database
- Reset data between tests
- Mock external services

## Environment Setup

### Required Environment Variables:

```bash
# Test environment
NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Test Scripts:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:cypress": "cypress run"
  }
}
```

## Best Practices

### 1. Test Organization:

- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mocking:

- Mock external dependencies
- Mock Supabase client
- Mock Next.js router
- Mock environment variables

### 3. Test Data:

- Use consistent test data
- Clean up after tests
- Use factories for test data creation

### 4. Error Testing:

- Test all error scenarios
- Test edge cases
- Test network failures
- Test validation errors

### 5. Performance:

- Keep tests fast
- Use parallel execution
- Optimize test setup/teardown

## Migration Strategy

### From Cypress to Playwright:

1. Keep existing Cypress tests running
2. Gradually add Playwright tests
3. Replace failing Cypress tests
4. Eventually remove Cypress

### Jest Setup:

1. Configure Jest with Next.js
2. Set up Testing Library
3. Create test utilities
4. Add test scripts

## Monitoring and Maintenance

### Test Metrics:

- Test coverage
- Test execution time
- Test failure rate
- Flaky test detection

### Continuous Integration:

- Run tests on every PR
- Block merges on test failures
- Generate coverage reports
- Track test performance

## Conclusion

The recommended approach is to use **Jest + Testing Library** for unit/integration tests and **Playwright** for E2E tests. This combination provides:

- Fast, reliable unit tests
- Comprehensive E2E coverage
- Good developer experience
- Excellent debugging capabilities
- Cross-browser testing
- Mobile testing support

This strategy will provide robust testing coverage for the authentication system while maintaining good performance and developer productivity.
