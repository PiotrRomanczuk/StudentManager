import '@testing-library/jest-dom';
import { renderHook, act } from '@testing-library/react';
import { useSongFiltering } from '@/app/dashboard/songs/@components/hooks/useSongFiltering';
import { Song } from '@/types/Song';

const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Wonderwall',
    author: 'Oasis',
    level: 'beginner',
    key: 'C',
    ultimate_guitar_link: 'https://tabs.ultimate-guitar.com/tab/oasis/wonderwall-tabs-81',
    created_at: new Date('2024-01-15T00:00:00Z'),
    updated_at: new Date('2024-01-15T00:00:00Z')
  },
  {
    id: '2',
    title: 'Hotel California',
    author: 'Eagles',
    level: 'intermediate',
    key: 'Am',
    ultimate_guitar_link: 'https://tabs.ultimate-guitar.com/tab/eagles/hotel-california-tabs-123',
    created_at: new Date('2024-01-16T00:00:00Z'),
    updated_at: new Date('2024-01-16T00:00:00Z')
  },
  {
    id: '3',
    title: 'Stairway to Heaven',
    author: 'Led Zeppelin',
    level: 'advanced',
    key: 'Am',
    ultimate_guitar_link: 'https://tabs.ultimate-guitar.com/tab/led-zeppelin/stairway-to-heaven-tabs-456',
    created_at: new Date('2024-01-17T00:00:00Z'),
    updated_at: new Date('2024-01-17T00:00:00Z')
  }
];

describe('useSongFiltering', () => {
  it('should return all songs when search query is empty', () => {
    const { result } = renderHook(() => useSongFiltering(mockSongs));

    expect(result.current.searchQuery).toBe('');
    expect(result.current.filteredSongs).toEqual(mockSongs);
  });

  it('should filter songs by title when search query is provided', () => {
    const { result } = renderHook(() => useSongFiltering(mockSongs));

    act(() => {
      result.current.setSearchQuery('wonder');
    });

    expect(result.current.searchQuery).toBe('wonder');
    expect(result.current.filteredSongs).toHaveLength(1);
    expect(result.current.filteredSongs[0].title).toBe('Wonderwall');
  });

  it('should perform case-insensitive search', () => {
    const { result } = renderHook(() => useSongFiltering(mockSongs));

    act(() => {
      result.current.setSearchQuery('WONDER');
    });

    expect(result.current.filteredSongs).toHaveLength(1);
    expect(result.current.filteredSongs[0].title).toBe('Wonderwall');
  });

  it('should return empty array when no matches found', () => {
    const { result } = renderHook(() => useSongFiltering(mockSongs));

    act(() => {
      result.current.setSearchQuery('nonexistent');
    });

    expect(result.current.filteredSongs).toHaveLength(0);
  });

  it('should handle partial matches', () => {
    const { result } = renderHook(() => useSongFiltering(mockSongs));

    act(() => {
      result.current.setSearchQuery('wall');
    });

    expect(result.current.filteredSongs).toHaveLength(1);
    expect(result.current.filteredSongs[0].title).toBe('Wonderwall');
  });

  it('should handle multiple matches', () => {
    const { result } = renderHook(() => useSongFiltering(mockSongs));

    act(() => {
      result.current.setSearchQuery('to');
    });

    expect(result.current.filteredSongs).toHaveLength(1);
    expect(result.current.filteredSongs[0].title).toBe('Stairway to Heaven');
  });

  it('should handle empty songs array', () => {
    const { result } = renderHook(() => useSongFiltering([]));

    expect(result.current.searchQuery).toBe('');
    expect(result.current.filteredSongs).toEqual([]);

    act(() => {
      result.current.setSearchQuery('test');
    });

    expect(result.current.filteredSongs).toEqual([]);
  });

  it('should handle whitespace in search query', () => {
    const { result } = renderHook(() => useSongFiltering(mockSongs));

    act(() => {
      result.current.setSearchQuery('  wonder  ');
    });

    expect(result.current.filteredSongs).toHaveLength(1);
    expect(result.current.filteredSongs[0].title).toBe('Wonderwall');
  });

  it('should update filtered songs when songs array changes', () => {
    const { result, rerender } = renderHook(
      ({ songs }) => useSongFiltering(songs),
      { initialProps: { songs: mockSongs } }
    );

    act(() => {
      result.current.setSearchQuery('wonder');
    });

    expect(result.current.filteredSongs).toHaveLength(1);

    const newSongs: Song[] = [
      {
        id: '4',
        title: 'Wonderwall Cover',
        author: 'Cover Band',
        level: 'beginner',
        key: 'C',
        ultimate_guitar_link: 'https://example.com',
        created_at: new Date('2024-01-18T00:00:00Z'),
        updated_at: new Date('2024-01-18T00:00:00Z')
      }
    ];

    rerender({ songs: newSongs });

    expect(result.current.filteredSongs).toHaveLength(1);
    expect(result.current.filteredSongs[0].title).toBe('Wonderwall Cover');
  });

  it('should clear search query when set to empty string', () => {
    const { result } = renderHook(() => useSongFiltering(mockSongs));

    act(() => {
      result.current.setSearchQuery('wonder');
    });

    expect(result.current.searchQuery).toBe('wonder');
    expect(result.current.filteredSongs).toHaveLength(1);

    act(() => {
      result.current.setSearchQuery('');
    });

    expect(result.current.searchQuery).toBe('');
    expect(result.current.filteredSongs).toEqual(mockSongs);
  });

  it('should handle special characters in search query', () => {
    const { result } = renderHook(() => useSongFiltering(mockSongs));

    act(() => {
      result.current.setSearchQuery('hotel california');
    });

    expect(result.current.filteredSongs).toHaveLength(1);
    expect(result.current.filteredSongs[0].title).toBe('Hotel California');
  });

  it('should return the same reference for filteredSongs when no changes', () => {
    const { result } = renderHook(() => useSongFiltering(mockSongs));

    const firstResult = result.current.filteredSongs;
    
    // Trigger a re-render without changing the search query
    act(() => {
      result.current.setSearchQuery('');
    });

    expect(result.current.filteredSongs).toBe(firstResult);
  });
}); 