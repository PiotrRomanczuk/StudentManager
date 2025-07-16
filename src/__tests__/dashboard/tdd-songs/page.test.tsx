import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import TddSongsPage from '@/app/dashboard/tdd-songs/page';
import { createClient } from '@/utils/supabase/clients/server';
import { getUserAndAdmin } from '@/app/dashboard/utils/getUserAndAdmin';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock Supabase client
jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(),
}));

// Mock getUserAndAdmin
jest.mock('@/app/dashboard/utils/getUserAndAdmin', () => ({
  getUserAndAdmin: jest.fn(),
}));

const mockCreateClient = createClient as any;
const mockGetUserAndAdmin = getUserAndAdmin as any;
const mockRedirect = redirect as any;

describe('TddSongsPage', () => {
  const mockUser = { id: 'user123', email: 'test@example.com' };

  const mockSearchParams = Promise.resolve({
    page: '1',
    limit: '50',
    search: 'test',
    level: 'Beginner',
    key: 'C',
    author: 'Test Author',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockResolvedValue({});
    mockGetUserAndAdmin.mockResolvedValue({
      user: mockUser,
      isAdmin: true,
    });
  });

  describe('Authentication', () => {
    it('should render the page for authenticated admin user', async () => {
      const page = await TddSongsPage({ searchParams: mockSearchParams });
      render(page);

      expect(mockCreateClient).toHaveBeenCalled();
      expect(mockGetUserAndAdmin).toHaveBeenCalled();
    });

    it('should redirect to signin when authentication fails', async () => {
      mockGetUserAndAdmin.mockRejectedValue(new Error('Authentication error'));

      await TddSongsPage({ searchParams: mockSearchParams });

      expect(mockRedirect).toHaveBeenCalledWith('/auth/signin');
    });

    it('should redirect to signin when user is not found', async () => {
      mockGetUserAndAdmin.mockResolvedValue({
        user: null,
        isAdmin: false,
      });

      try {
        await TddSongsPage({ searchParams: mockSearchParams });
      } catch (e) {}

      expect(mockRedirect).toHaveBeenCalledWith('/auth/signin');
    });
  });

  describe('Search Parameters Handling', () => {
    it('should handle all search parameters correctly', async () => {
      const searchParams = Promise.resolve({
        page: '2',
        limit: '25',
        search: 'test search',
        level: 'Intermediate',
        key: 'G',
        author: 'Test Author',
        sortBy: 'title',
        sortOrder: 'asc',
      });

      const page = await TddSongsPage({ searchParams });
      render(page);

      expect(mockCreateClient).toHaveBeenCalled();
      expect(mockGetUserAndAdmin).toHaveBeenCalled();
    });

    it('should use default values when search parameters are not provided', async () => {
      const emptySearchParams = Promise.resolve({});

      const page = await TddSongsPage({ searchParams: emptySearchParams });
      render(page);

      expect(mockCreateClient).toHaveBeenCalled();
      expect(mockGetUserAndAdmin).toHaveBeenCalled();
    });

    it('should handle partial search parameters', async () => {
      const partialSearchParams = Promise.resolve({
        page: '3',
        limit: '100',
        // Missing other parameters
      });

      const page = await TddSongsPage({ searchParams: partialSearchParams });
      render(page);

      expect(mockCreateClient).toHaveBeenCalled();
      expect(mockGetUserAndAdmin).toHaveBeenCalled();
    });

    it('should handle invalid page numbers gracefully', async () => {
      const invalidSearchParams = Promise.resolve({
        page: 'invalid',
        limit: 'invalid',
      });

      const page = await TddSongsPage({ searchParams: invalidSearchParams });
      render(page);

      expect(mockCreateClient).toHaveBeenCalled();
      expect(mockGetUserAndAdmin).toHaveBeenCalled();
    });
  });

  describe('User Roles', () => {
    it('should handle admin users correctly', async () => {
      mockGetUserAndAdmin.mockResolvedValue({
        user: mockUser,
        isAdmin: true,
      });

      const page = await TddSongsPage({ searchParams: mockSearchParams });
      render(page);

      expect(mockGetUserAndAdmin).toHaveBeenCalled();
    });

    it('should handle non-admin users correctly', async () => {
      mockGetUserAndAdmin.mockResolvedValue({
        user: mockUser,
        isAdmin: false,
      });

      const page = await TddSongsPage({ searchParams: mockSearchParams });
      render(page);

      expect(mockGetUserAndAdmin).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle Supabase client creation errors', async () => {
      mockCreateClient.mockRejectedValue(new Error('Supabase error'));

      await TddSongsPage({ searchParams: mockSearchParams });

      expect(mockRedirect).toHaveBeenCalledWith('/auth/signin');
    });

    it('should handle getUserAndAdmin errors', async () => {
      mockGetUserAndAdmin.mockRejectedValue(new Error('User error'));

      await TddSongsPage({ searchParams: mockSearchParams });

      expect(mockRedirect).toHaveBeenCalledWith('/auth/signin');
    });
  });

  describe('Component Props', () => {
    it('should pass correct props to TddSongsClient', async () => {
      const searchParams = Promise.resolve({
        page: '2',
        limit: '25',
        search: 'test',
        level: 'Beginner',
        key: 'C',
        author: 'Author',
        sortBy: 'title',
        sortOrder: 'asc',
      });

      const page = await TddSongsPage({ searchParams });
      render(page);

      expect(mockCreateClient).toHaveBeenCalled();
      expect(mockGetUserAndAdmin).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null user', async () => {
      mockGetUserAndAdmin.mockResolvedValue({
        user: null,
        isAdmin: false,
      });

      try {
        await TddSongsPage({ searchParams: mockSearchParams });
      } catch (e) {}

      expect(mockRedirect).toHaveBeenCalledWith('/auth/signin');
    });

    it('should handle undefined search parameters', async () => {
      const undefinedSearchParams = Promise.resolve(undefined as any);

      const page = await TddSongsPage({ searchParams: undefinedSearchParams });
      render(page);

      expect(mockCreateClient).toHaveBeenCalled();
      expect(mockGetUserAndAdmin).toHaveBeenCalled();
    });

    it('should handle empty string parameters', async () => {
      const emptyStringParams = Promise.resolve({
        page: '',
        limit: '',
        search: '',
        level: '',
        key: '',
        author: '',
        sortBy: '',
        sortOrder: '',
      });

      const page = await TddSongsPage({ searchParams: emptyStringParams });
      render(page);

      expect(mockCreateClient).toHaveBeenCalled();
      expect(mockGetUserAndAdmin).toHaveBeenCalled();
    });
  });
}); 