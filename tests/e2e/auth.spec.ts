import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies();
  });

  test.describe('Sign In Page', () => {
    test('should display login form correctly', async ({ page }) => {
      await page.goto('/auth/signin');
      
      await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      await page.goto('/auth/signin');
      
      const submitButton = page.getByRole('button', { name: 'Sign In' });
      await submitButton.click();
      
      // Check for HTML5 validation messages
      const emailInput = page.getByLabel('Email');
      const passwordInput = page.getByLabel('Password');
      
      await expect(emailInput).toHaveAttribute('required');
      await expect(passwordInput).toHaveAttribute('required');
    });

    test('should toggle password visibility', async ({ page }) => {
      await page.goto('/auth/signin');
      
      const passwordInput = page.getByLabel('Password');
      const toggleButton = page.getByRole('button', { name: 'Show password' });
      
      await expect(passwordInput).toHaveAttribute('type', 'password');
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');
      await expect(page.getByRole('button', { name: 'Hide password' })).toBeVisible();
    });

    test('should handle remember me checkbox', async ({ page }) => {
      await page.goto('/auth/signin');
      
      const rememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember me' });
      await expect(rememberMeCheckbox).not.toBeChecked();
      await rememberMeCheckbox.check();
      await expect(rememberMeCheckbox).toBeChecked();
    });

    test('should navigate to signup page', async ({ page }) => {
      await page.goto('/auth/signin');
      
      await page.getByRole('link', { name: 'Sign up' }).click();
      await expect(page).toHaveURL(/.*\/auth\/signup/);
    });

    test('should navigate to forgot password page', async ({ page }) => {
      await page.goto('/auth/signin');
      
      await page.getByRole('link', { name: 'Forgot password?' }).click();
      await expect(page).toHaveURL(/.*\/auth\/forgot-password/);
    });
  });

  test.describe('Sign Up Page', () => {
    test('should display signup form correctly', async ({ page }) => {
      await page.goto('/auth/signup');
      
      await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();
      await expect(page.getByLabel('First Name')).toBeVisible();
      await expect(page.getByLabel('Last Name')).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect(page.getByLabel('Confirm Password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
    });

    test('should show validation for password mismatch', async ({ page }) => {
      await page.goto('/auth/signup');
      
      await page.getByLabel('First Name').fill('John');
      await page.getByLabel('Last Name').fill('Doe');
      await page.getByLabel('Email').fill('john@example.com');
      await page.getByLabel('Password').fill('password123');
      await page.getByLabel('Confirm Password').fill('differentpassword');
      
      await page.getByRole('button', { name: 'Sign Up' }).click();
      
      await expect(page.getByText('Passwords do not match')).toBeVisible();
    });

    test('should navigate to signin page', async ({ page }) => {
      await page.goto('/auth/signup');
      
      await page.getByRole('link', { name: 'Log in' }).click();
      await expect(page).toHaveURL(/.*\/auth\/signin/);
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to signin when accessing dashboard without auth', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Should redirect to signin page
      await expect(page).toHaveURL(/.*\/auth\/signin/);
    });

    test('should redirect to signin when accessing protected API routes', async ({ page }) => {
      const response = await page.request.get('/api/user');
      expect(response.status()).toBe(401);
    });
  });

  test.describe('OAuth Flows', () => {
    test('should initiate Google OAuth flow', async ({ page }) => {
      await page.goto('/auth/signin');
      
      // Mock the OAuth flow
      await page.route('**/auth/v1/authorize**', async route => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ url: 'https://accounts.google.com/oauth' })
        });
      });
      
      await page.getByRole('button', { name: 'Sign in with Google' }).click();
      
      // Should redirect to Google OAuth
      await expect(page).toHaveURL(/accounts\.google\.com/);
    });
  });

  test.describe('Account Management', () => {
    test('should display account page for authenticated user', async ({ page }) => {
      // Mock authenticated state
      await page.addInitScript(() => {
        localStorage.setItem('supabase.auth.token', 'mock-token');
      });
      
      await page.goto('/account');
      
      await expect(page.getByText('Account Settings')).toBeVisible();
    });

    test('should allow profile updates', async ({ page }) => {
      // Mock authenticated state and API responses
      await page.route('**/api/profiles**', async route => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            profile: {
              full_name: 'John Doe',
              username: 'johndoe',
              website: 'https://example.com'
            }
          })
        });
      });
      
      await page.goto('/account');
      
      const fullNameInput = page.getByLabel('Full Name');
      await fullNameInput.clear();
      await fullNameInput.fill('Jane Doe');
      
      await page.getByRole('button', { name: 'Update' }).click();
      
      await expect(page.getByText('Profile updated!')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should display error messages for invalid credentials', async ({ page }) => {
      await page.goto('/auth/signin');
      
      // Mock failed login
      await page.route('**/auth/v1/token**', async route => {
        await route.fulfill({
          status: 400,
          body: JSON.stringify({ error: 'Invalid login credentials' })
        });
      });
      
      await page.getByLabel('Email').fill('invalid@example.com');
      await page.getByLabel('Password').fill('wrongpassword');
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      await expect(page.getByText('Invalid login credentials')).toBeVisible();
    });

    test('should handle network errors gracefully', async ({ page }) => {
      await page.goto('/auth/signin');
      
      // Mock network error
      await page.route('**/auth/v1/token**', async route => {
        await route.abort('failed');
      });
      
      await page.getByLabel('Email').fill('test@example.com');
      await page.getByLabel('Password').fill('password123');
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      await expect(page.getByText(/network error|connection failed/i)).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/auth/signin');
      
      await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      
      // Check that form is usable on mobile
      await page.getByLabel('Email').fill('test@example.com');
      await page.getByLabel('Password').fill('password123');
    });
  });
}); 