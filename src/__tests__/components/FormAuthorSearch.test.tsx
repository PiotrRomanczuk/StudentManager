import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormAuthorSearch } from '@/app/dashboard/songs/[id]/components/form/FormAuthorSearch';

// Mock fetch
global.fetch = jest.fn();

// Mock the UI components
jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor, className }: any) => (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ id, value, onChange, onFocus, onBlur, placeholder, disabled, className }: any) => (
    <input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
    />
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, type, variant, size, className }: any) => (
    <button onClick={onClick} disabled={disabled} type={type} className={className}>
      {children}
    </button>
  ),
}));

jest.mock('lucide-react', () => ({
  ChevronDown: () => <span>▼</span>,
  Loader2: () => <span>⏳</span>,
  Search: () => <span>🔍</span>,
}));

describe('FormAuthorSearch', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders correctly with label and placeholder', () => {
    const mockOnChange = jest.fn();

    render(
      <FormAuthorSearch
        id="author"
        label="Author"
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Author')).toBeDefined();
    expect(screen.getByPlaceholderText('Search for an artist...')).toBeDefined();
  });

  it('shows loading state when fetching authors', async () => {
    const mockOnChange = jest.fn();
    
    (fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ authors: ['Artist 1', 'Artist 2'] })
        }), 100)
      )
    );

    render(
      <FormAuthorSearch
        id="author"
        label="Author"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText('Search for an artist...');
    fireEvent.focus(input);
    
    // Should show loading initially
    await waitFor(() => {
      expect(screen.getByText('⏳')).toBeDefined();
    });
  });

  it('fetches and displays authors', async () => {
    const mockOnChange = jest.fn();
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ authors: ['Artist 1', 'Artist 2', 'Artist 3'] })
    });

    render(
      <FormAuthorSearch
        id="author"
        label="Author"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText('Search for an artist...');
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText('Artist 1')).toBeDefined();
      expect(screen.getByText('Artist 2')).toBeDefined();
      expect(screen.getByText('Artist 3')).toBeDefined();
    });
  });

  it('calls onChange when an author is selected', async () => {
    const mockOnChange = jest.fn();
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ authors: ['Artist 1', 'Artist 2'] })
    });

    render(
      <FormAuthorSearch
        id="author"
        label="Author"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText('Search for an artist...');
    fireEvent.focus(input);

    await waitFor(() => {
      const artistButton = screen.getByText('Artist 1');
      fireEvent.click(artistButton);
    });

    expect(mockOnChange).toHaveBeenCalledWith('Artist 1');
  });

  it('handles search input changes', async () => {
    const mockOnChange = jest.fn();
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ authors: ['Artist 1'] })
    });

    render(
      <FormAuthorSearch
        id="author"
        label="Author"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText('Search for an artist...');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(mockOnChange).toHaveBeenCalledWith('test');
  });
}); 