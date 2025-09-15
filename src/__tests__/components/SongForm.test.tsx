import React from 'react';
import { render, screen } from '@testing-library/react';
import { SongForm } from '@/app/dashboard/songs/[id]/components/form/SongForm';

// Mock the UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardDescription: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ id, value, onChange, onBlur, placeholder, disabled, className, type, maxLength }: any) => (
    <input
      id={id}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      type={type}
      maxLength={maxLength}
    />
  ),
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor, className }: any) => (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  ),
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange, disabled }: any) => (
    <select value={value} onChange={onValueChange} disabled={disabled}>
      {children}
    </select>
  ),
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ value, children }: any) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ id, value, onChange, placeholder, disabled, className }: any) => (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
    />
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, type, variant, className }: any) => (
    <button onClick={onClick} disabled={disabled} type={type} className={className}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/alert', () => ({
  Alert: ({ children }: any) => <div role="alert">{children}</div>,
  AlertDescription: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span className={`${variant} ${className}`}>{children}</span>
  ),
}));

jest.mock('lucide-react', () => ({
  Music: () => <span>🎵</span>,
  Link: () => <span>🔗</span>,
  AlertCircle: () => <span>⚠️</span>,
  CheckCircle: () => <span>✅</span>,
  Info: () => <span>ℹ️</span>,
  Loader2: () => <span>⏳</span>,
}));

describe('SongForm', () => {
  it('renders form with all required fields', () => {
    const mockOnSubmit = jest.fn();

    render(
      <SongForm
        mode="create"
        onSubmit={mockOnSubmit}
      />
    );

    // Check that the form renders without crashing
    expect(screen.getByText('Add New Song')).toBeDefined();
    expect(screen.getByPlaceholderText('Enter song title')).toBeDefined();
    expect(screen.getByPlaceholderText('Enter artist/author name')).toBeDefined();
    expect(screen.getByPlaceholderText('e.g., G, C, D, Em, Am')).toBeDefined();
    expect(screen.getByPlaceholderText('https://tabs.ultimate-guitar.com/...')).toBeDefined();
    expect(screen.getByPlaceholderText('Optional short version of title')).toBeDefined();
  });

  it('renders in edit mode correctly', () => {
    const mockOnSubmit = jest.fn();
    const initialValues = {
      title: 'Existing Song',
      author: 'Existing Artist',
      level: 'intermediate' as const,
      key: 'G' as const,
    };

    render(
      <SongForm
        mode="edit"
        onSubmit={mockOnSubmit}
        initialValues={initialValues}
      />
    );

    expect(screen.getByText('Edit Song')).toBeDefined();
  });

  it('shows loading state when isLoading is true', () => {
    const mockOnSubmit = jest.fn();

    render(
      <SongForm
        mode="create"
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    // Check that the form is disabled when loading
    const titleInput = screen.getByPlaceholderText('Enter song title');
    expect(titleInput).toBeDisabled();
  });

  it('renders form actions correctly', () => {
    const mockOnSubmit = jest.fn();

    render(
      <SongForm
        mode="create"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Add Song')).toBeDefined();
    expect(screen.getByText('Cancel')).toBeDefined();
  });
}); 