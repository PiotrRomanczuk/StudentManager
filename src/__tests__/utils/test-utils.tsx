import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Mock Supabase client for tests
export const mockSupabaseClient = {
  auth: {
    signInWithPassword: jest.fn(),
    signInWithOAuth: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getUser: jest.fn(),
    verifyOtp: jest.fn(),
    exchangeCodeForSession: jest.fn(),
  },
  from: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
};

// Test user data
export const testUsers = {
  student: {
    id: 'student-123',
    email: 'student@test.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Student',
    role: 'student',
    isAdmin: false,
    isTeacher: false,
    isStudent: true,
  },
  teacher: {
    id: 'teacher-123',
    email: 'teacher@test.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Teacher',
    role: 'teacher',
    isAdmin: false,
    isTeacher: true,
    isStudent: false,
  },
  admin: {
    id: 'admin-123',
    email: 'admin@test.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isAdmin: true,
    isTeacher: false,
    isStudent: false,
  },
};

// Form data helpers
export const createFormData = (data: Record<string, string>) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};

// Auth form data helpers
export const createLoginFormData = (email: string, password: string, rememberMe = false) => {
  return createFormData({
    email,
    password,
    ...(rememberMe && { rememberMe: 'on' }),
  });
};

export const createSignupFormData = (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  return createFormData({
    email,
    password,
    firstName,
    lastName,
  });
};

// Mock responses
export const mockAuthResponses = {
  successfulLogin: {
    data: { user: testUsers.student },
    error: null,
  },
  failedLogin: {
    data: { user: null },
    error: { message: 'Invalid login credentials' },
  },
  successfulSignup: {
    data: { user: testUsers.student },
    error: null,
  },
  failedSignup: {
    data: { user: null },
    error: { message: 'User already exists' },
  },
  successfulOAuth: {
    data: { url: 'https://accounts.google.com/oauth' },
    error: null,
  },
  failedOAuth: {
    data: { url: null },
    error: { message: 'OAuth error' },
  },
};

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Test environment setup
export const setupTestEnvironment = () => {
  // Mock environment variables
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3000';

  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  // Mock sessionStorage
  const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  });
};

// Clean up after tests
export const cleanupTestEnvironment = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
};

// Auth state helpers
export const mockAuthenticatedUser = (user = testUsers.student) => {
  mockSupabaseClient.auth.getUser.mockResolvedValue({
    data: { user },
    error: null,
  });
};

export const mockUnauthenticatedUser = () => {
  mockSupabaseClient.auth.getUser.mockResolvedValue({
    data: { user: null },
    error: null,
  });
};

// Error helpers
export const createAuthError = (message: string) => ({
  message,
  status: 400,
  name: 'AuthError',
});

export const createNetworkError = () => ({
  message: 'Network error',
  status: 0,
  name: 'NetworkError',
});

// Validation helpers
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  return password.length >= 6;
};

// Test assertions
export const expectAuthError = (error: unknown, expectedMessage?: string) => {
  expect(error).toBeInstanceOf(Error);
  if (expectedMessage) {
    expect(error.message).toContain(expectedMessage);
  }
};

export const expectSuccessfulAuth = (result: unknown) => {
  expect(result).toBeDefined();
  expect(result.error).toBeNull();
};

// Simple test to satisfy Jest requirement
describe('Test Utils', () => {
  it('should export test utilities', () => {
    expect(testUsers).toBeDefined();
    expect(mockSupabaseClient).toBeDefined();
    expect(createFormData).toBeDefined();
  });
}); 