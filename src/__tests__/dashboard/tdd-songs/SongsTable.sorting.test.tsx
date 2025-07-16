import '@testing-library/jest-dom';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { SongsTable } from '@/app/dashboard/tdd-songs/components/SongsTable';
import { Song } from '@/types/Song';

const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Test Song 1',
    author: 'Test Author 1',
    level: 'beginner',
    key: 'C',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Test Song 2',
    author: 'Test Author 2',
    level: 'intermediate',
    key: 'G',
    created_at: new Date('2024-01-02'),
    updated_at: new Date('2024-01-16'),
  },
  {
    id: '3',
    title: 'Another Song',
    author: 'Another Author',
    level: 'advanced',
    key: 'A',
    created_at: new Date('2024-01-03'),
    updated_at: new Date('2024-01-17'),
  },
];

beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
});

describe('SongsTable (sorting)', () => {
  it('should start sorted by title in ascending order', () => {
    render(<SongsTable songs={mockSongs} onView={jest.fn()} hidePagination={true} />);
    const songTitles = screen.getAllByText(/Test Song|Another Song/);
    expect(songTitles[0]).toHaveTextContent('Another Song');
    expect(songTitles[1]).toHaveTextContent('Test Song 1');
    expect(songTitles[2]).toHaveTextContent('Test Song 2');
  });

  it('should sort by title in descending order when clicking on Title header', () => {
    render(<SongsTable songs={mockSongs} onView={jest.fn()} hidePagination={true} />);
    const titleHeader = screen.getByText(/^Title/);
    fireEvent.click(titleHeader);
    const songTitles = screen.getAllByText(/Test Song|Another Song/);
    expect(songTitles[0]).toHaveTextContent('Test Song 2');
    expect(songTitles[1]).toHaveTextContent('Test Song 1');
    expect(songTitles[2]).toHaveTextContent('Another Song');
  });

  it('should sort by author when clicking on Author header', () => {
    render(<SongsTable songs={mockSongs} onView={jest.fn()} hidePagination={true} />);
    const authorHeader = screen.getByRole('columnheader', { name: /^Author$/ });
    fireEvent.click(authorHeader);
    // Get all table rows (skip header row)
    const rows = screen.getAllByRole('row').filter(row => row.querySelector('td'));
    // Author is the second column (index 1)
    const authorCells = rows.map(row => row.querySelectorAll('td')[1]);
    const authorTexts = authorCells.map(cell => cell.textContent);
    expect(authorTexts[0]).toBe('Another Author');
    expect(authorTexts[1]).toBe('Test Author 1');
    expect(authorTexts[2]).toBe('Test Author 2');
  });

  it('should sort by level when clicking on Level header', () => {
    render(<SongsTable songs={mockSongs} onView={jest.fn()} hidePagination={true} />);
    const levelHeader = screen.getByRole('columnheader', { name: /^Level$/ });
    fireEvent.click(levelHeader);
    // Get all table rows (skip header row)
    const rows = screen.getAllByRole('row').filter(row => row.querySelector('td'));
    // Level is the third column (index 2)
    const levelCells = rows.map(row => row.querySelectorAll('td')[2]);
    const levelTexts = levelCells.map(cell => cell.textContent);
    expect(levelTexts[0]).toBe('advanced');
    expect(levelTexts[1]).toBe('beginner');
    expect(levelTexts[2]).toBe('intermediate');
  });

  it('should sort by key when clicking on Key header', () => {
    render(<SongsTable songs={mockSongs} onView={jest.fn()} hidePagination={true} />);
    const keyHeader = screen.getByRole('columnheader', { name: /^Key$/ });
    fireEvent.click(keyHeader);
    // Get all table cells and find the key values
    const tableCells = screen.getAllByRole('cell');
    const keyCells = tableCells.filter(cell => cell.textContent?.match(/^[A-G]$/));
    expect(keyCells[0]).toHaveTextContent('A');
  });

  it('should sort by created date when clicking on Created At header', () => {
    render(<SongsTable songs={mockSongs} onView={jest.fn()} hidePagination={true} />);
    const createdHeader = screen.getByText(/^Created At/);
    fireEvent.click(createdHeader);
    const songTitles = screen.getAllByText(/Test Song|Another Song/);
    expect(songTitles[0]).toHaveTextContent('Test Song 1');
    expect(songTitles[1]).toHaveTextContent('Test Song 2');
    expect(songTitles[2]).toHaveTextContent('Another Song');
  });

  it('should sort by updated date when clicking on Updated At header', () => {
    render(<SongsTable songs={mockSongs} onView={jest.fn()} hidePagination={true} />);
    const updatedHeader = screen.getByText(/^Updated At/);
    fireEvent.click(updatedHeader);
    const songTitles = screen.getAllByText(/Test Song|Another Song/);
    expect(songTitles[0]).toHaveTextContent('Test Song 1');
    expect(songTitles[1]).toHaveTextContent('Test Song 2');
    expect(songTitles[2]).toHaveTextContent('Another Song');
  });

  it('should toggle sort order when clicking the same header twice', () => {
    render(<SongsTable songs={mockSongs} onView={jest.fn()} hidePagination={true} />);
    const titleHeader = screen.getByText(/^Title/);
    
    // First click - should sort descending
    fireEvent.click(titleHeader);
    let songTitles = screen.getAllByText(/Test Song|Another Song/);
    expect(songTitles[0]).toHaveTextContent('Test Song 2');
    expect(songTitles[2]).toHaveTextContent('Another Song');
    
    // Second click - should sort ascending again
    fireEvent.click(titleHeader);
    songTitles = screen.getAllByText(/Test Song|Another Song/);
    expect(songTitles[0]).toHaveTextContent('Another Song');
    expect(songTitles[2]).toHaveTextContent('Test Song 2');
  });

  it('should show sort indicators on headers', () => {
    render(<SongsTable songs={mockSongs} onView={jest.fn()} hidePagination={true} />);
    const titleHeader = screen.getByText(/^Title/);
    
    // Initially should show ascending indicator
    expect(titleHeader).toHaveTextContent('Title ↑');
    
    // Click to sort descending
    fireEvent.click(titleHeader);
    expect(titleHeader).toHaveTextContent('Title ↓');
    
    // Click again to sort ascending
    fireEvent.click(titleHeader);
    expect(titleHeader).toHaveTextContent('Title ↑');
  });
}); 