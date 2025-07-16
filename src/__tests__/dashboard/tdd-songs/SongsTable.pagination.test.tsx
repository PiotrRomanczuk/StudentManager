import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { SongsTable } from '@/app/dashboard/tdd-songs/components/SongsTable';
import { Song } from '@/types/Song';

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

describe('SongsTable (pagination)', () => {
  it('shows pagination controls and navigates between pages', () => {
    // Mock window height to ensure consistent pagination
    Object.defineProperty(window, 'innerHeight', { 
      writable: true, 
      configurable: true, 
      value: 400 
    });

    const songs = generateSongs(12);
    render(<SongsTable songs={songs} onView={jest.fn()} />);

    // Check that pagination controls are present
    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();

    // Get initial visible songs
    const initialVisibleSongs = screen.getAllByRole('row').filter(row => row.querySelector('td'));
    const initialSongCount = initialVisibleSongs.length;

    // Click next page
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Check that different songs are now visible
    const newVisibleSongs = screen.getAllByRole('row').filter(row => row.querySelector('td'));
    const newSongCount = newVisibleSongs.length;

    // Should have the same number of songs per page
    expect(newSongCount).toBe(initialSongCount);

    // Click previous page
    const prevButton = screen.getByRole('button', { name: /prev/i });
    fireEvent.click(prevButton);

    // Should be back to the first page
    const finalVisibleSongs = screen.getAllByRole('row').filter(row => row.querySelector('td'));
    expect(finalVisibleSongs.length).toBe(initialSongCount);
  });
}); 