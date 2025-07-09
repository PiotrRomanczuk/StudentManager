import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '@/app/dashboard/page';

// Mock Supabase client with proper method chaining
const mockSupabase: any = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(() => mockSupabase),
  select: jest.fn(() => mockSupabase),
  eq: jest.fn(() => mockSupabase),
  single: jest.fn(),
  insert: jest.fn(() => ({
    select: jest.fn(() => ({
      single: jest.fn(),
    })),
  })),
};

jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
}));

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show error when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const page = await Page();
    render(page);
    
    expect(screen.getByText(/no authenticated user found/i)).toBeInTheDocument();
  });

  it('should render admin page for admin users', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.single.mockResolvedValue({
      data: { isAdmin: true },
      error: null,
    });

    const page = await Page();
    render(page);
    
    // Admin page should show admin-specific content
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    // Use getAllByText and check for button specifically
    const lessonsElements = screen.getAllByText(/lessons/i);
    const lessonsButton = lessonsElements.find((el: any) => el.tagName === 'BUTTON');
    expect(lessonsButton).toBeInTheDocument();
    
    const assignmentsElements = screen.getAllByText(/assignments/i);
    const assignmentsButton = assignmentsElements.find((el: any) => el.tagName === 'BUTTON');
    expect(assignmentsButton).toBeInTheDocument();
  });

  it('should render user page for regular users with songs', async () => {
    const mockUser = { id: 'user123', email: 'user@example.com' };
    const mockSongs = [
      { id: 'song1', title: 'Song 1', artist: 'Artist 1' },
      { id: 'song2', title: 'Song 2', artist: 'Artist 2' },
    ];
    
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.single.mockResolvedValue({
      data: { isAdmin: false },
      error: null,
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(mockSongs),
    });

    const page = await Page();
    render(page);
    
    // User page should show user-specific content
    expect(screen.getByText(/student dashboard/i)).toBeInTheDocument();
    // Use getAllByText for "My Lessons" since it appears in multiple places
    const myLessonsElements = screen.getAllByText(/my lessons/i);
    expect(myLessonsElements.length).toBeGreaterThan(0);
    
    // Use getAllByText and check for button specifically
    const assignmentsElements = screen.getAllByText(/assignments/i);
    const assignmentsButton = assignmentsElements.find((el: any) => el.tagName === 'BUTTON');
    expect(assignmentsButton).toBeInTheDocument();
    
    expect(screen.getByText(/progress/i)).toBeInTheDocument();
  });

  it('should show no songs found when user has no songs', async () => {
    const mockUser = { id: 'user123', email: 'user@example.com' };
    
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.single.mockResolvedValue({
      data: { isAdmin: false },
      error: null,
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: () => Promise.resolve([]),
    });

    const page = await Page();
    render(page);
    
    expect(screen.getByText(/no songs found/i)).toBeInTheDocument();
  });

  it('should show error when API call fails', async () => {
    const mockUser = { id: 'user123', email: 'user@example.com' };
    
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.single.mockResolvedValue({
      data: { isAdmin: false },
      error: null,
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 500,
      json: () => Promise.resolve({ error: 'Failed to fetch songs' }),
    });

    const page = await Page();
    render(page);
    
    expect(screen.getByText(/failed to fetch songs/i)).toBeInTheDocument();
  });

  it('should handle authentication errors gracefully', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Authentication error' },
    });

    const page = await Page();
    render(page);
    
    expect(screen.getByText(/authentication error/i)).toBeInTheDocument();
  });

  it('should handle database errors gracefully', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user123', email: 'user@example.com' } },
      error: null,
    });
    mockSupabase.from.mockReturnValue(mockSupabase);
    mockSupabase.select.mockReturnValue(mockSupabase);
    mockSupabase.eq.mockReturnValue(mockSupabase);
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    });

    const page = await Page();
    render(page);
    
    // Should still show error component
    expect(screen.getByText(/failed to fetch songs/i)).toBeInTheDocument();
  });

  it('should create profile for new users', async () => {
    const mockUser = { id: 'user123', email: 'user@example.com' };
    
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // First call returns no profile (PGRST116 error)
    mockSupabase.single
      .mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116', message: 'No rows returned' },
      })
      // Second call returns the created profile
      .mockResolvedValueOnce({
        data: { isAdmin: false },
        error: null,
      });

    // Mock the insert chain
    const mockInsertChain = {
      select: jest.fn(() => ({
        single: jest.fn().mockResolvedValue({
          data: { isAdmin: false },
          error: null,
        }),
      })),
    };
    mockSupabase.insert.mockReturnValue(mockInsertChain);

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: () => Promise.resolve([]),
    });

    const page = await Page();
    render(page);
    
    expect(screen.getByText(/no songs found/i)).toBeInTheDocument();
  });
}); 