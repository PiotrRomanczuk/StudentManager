import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SongsTable } from '@/app/dashboard/tdd-songs/components/SongsTable';
import { Song } from '@/types/Song';

// Use the same constants as SongsTable component
const NAVBAR_HEIGHT = 64;
const PAGINATION_HEIGHT = 60;
const BUFFER = 100;
const ROW_HEIGHT = 60; // desktop

function calculateExpectedRows(windowHeight: number) {
  const availableHeight = windowHeight - NAVBAR_HEIGHT - PAGINATION_HEIGHT - BUFFER;
  return Math.max(1, Math.floor(availableHeight / ROW_HEIGHT));
}

function generateSongs(count: number): Song[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    title: `Song ${i + 1}`,
    author: `Author ${i + 1}`,
    level: 'beginner',
    key: 'C',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  }));
}

describe('SongsTable (dynamic pagination)', () => {
  const originalInnerHeight = window.innerHeight;
  const songs = generateSongs(50);

  afterEach(() => {
    // Restore window height after each test
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: originalInnerHeight });
  });

  it('shows more songs when window is taller', () => {
    // Simulate a short window (e.g., 400px)
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 400 });
    render(<SongsTable songs={songs} onView={jest.fn()} />);
    let visibleRows = screen.getAllByRole('row').filter(row => row.querySelector('td'));
    expect(visibleRows.length).toBe(calculateExpectedRows(400));

    // Simulate a taller window (e.g., 700px)
    act(() => {
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 700 });
      window.dispatchEvent(new Event('resize'));
    });
    visibleRows = screen.getAllByRole('row').filter(row => row.querySelector('td'));
    expect(visibleRows.length).toBe(calculateExpectedRows(700));
  });

  it('shows fewer songs when window is shorter', () => {
    // Simulate a tall window first
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 800 });
    render(<SongsTable songs={songs} onView={jest.fn()} />);
    let visibleRows = screen.getAllByRole('row').filter(row => row.querySelector('td'));
    expect(visibleRows.length).toBe(calculateExpectedRows(800));

    // Now simulate a very short window (e.g., 300px)
    act(() => {
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 300 });
      window.dispatchEvent(new Event('resize'));
    });
    visibleRows = screen.getAllByRole('row').filter(row => row.querySelector('td'));
    expect(visibleRows.length).toBe(calculateExpectedRows(300));
  });
}); 