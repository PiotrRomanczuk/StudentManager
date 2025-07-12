import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { useSongTable } from '@/app/dashboard/songs/@components/hooks/useSongTable';
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
  },
  {
    id: '4',
    title: 'Bohemian Rhapsody',
    author: 'Queen',
    level: 'advanced',
    key: 'Bb',
    ultimate_guitar_link: 'https://tabs.ultimate-guitar.com/tab/queen/bohemian-rhapsody-tabs-789',
    created_at: new Date('2024-01-18T00:00:00Z'),
    updated_at: new Date('2024-01-18T00:00:00Z')
  },
  {
    id: '5',
    title: 'Sweet Child O Mine',
    author: 'Guns N Roses',
    level: 'intermediate',
    key: 'D',
    ultimate_guitar_link: 'https://tabs.ultimate-guitar.com/tab/guns-n-roses/sweet-child-o-mine-tabs-101',
    created_at: new Date('2024-01-19T00:00:00Z'),
    updated_at: new Date('2024-01-19T00:00:00Z')
  }
];

describe('useSongTable', () => {
  it('should return all songs when itemsPerPage is greater than total songs', () => {
    const { result } = renderHook(() => useSongTable(mockSongs, 1, 10));

    expect(result.current.currentSongs).toEqual(mockSongs);
  });

  it('should return first page of songs when pagination is needed', () => {
    const { result } = renderHook(() => useSongTable(mockSongs, 1, 3));

    expect(result.current.currentSongs).toHaveLength(3);
    expect(result.current.currentSongs[0].title).toBe('Wonderwall');
    expect(result.current.currentSongs[1].title).toBe('Hotel California');
    expect(result.current.currentSongs[2].title).toBe('Stairway to Heaven');
  });

  it('should return second page of songs', () => {
    const { result } = renderHook(() => useSongTable(mockSongs, 2, 3));

    expect(result.current.currentSongs).toHaveLength(2);
    expect(result.current.currentSongs[0].title).toBe('Bohemian Rhapsody');
    expect(result.current.currentSongs[1].title).toBe('Sweet Child O Mine');
  });

  it('should return empty array when page number is beyond available pages', () => {
    const { result } = renderHook(() => useSongTable(mockSongs, 3, 3));

    expect(result.current.currentSongs).toHaveLength(0);
  });

  it('should handle empty songs array', () => {
    const { result } = renderHook(() => useSongTable([], 1, 10));

    expect(result.current.currentSongs).toEqual([]);
  });

  it('should handle zero items per page', () => {
    const { result } = renderHook(() => useSongTable(mockSongs, 1, 0));

    expect(result.current.currentSongs).toEqual([]);
  });

  it('should handle negative page number by returning an empty array', () => {
    const { result } = renderHook(() => useSongTable(mockSongs, -1, 3));
    expect(result.current.currentSongs).toEqual([]);
  });

  it('should handle zero page number by returning an empty array', () => {
    const { result } = renderHook(() => useSongTable(mockSongs, 0, 3));
    expect(result.current.currentSongs).toEqual([]);
  });

  it('should return correct songs for last page', () => {
    const { result } = renderHook(() => useSongTable(mockSongs, 2, 3));

    expect(result.current.currentSongs).toHaveLength(2);
    expect(result.current.currentSongs[0].title).toBe('Bohemian Rhapsody');
    expect(result.current.currentSongs[1].title).toBe('Sweet Child O Mine');
  });

  it('should handle single item per page', () => {
    const { result } = renderHook(() => useSongTable(mockSongs, 2, 1));

    expect(result.current.currentSongs).toHaveLength(1);
    expect(result.current.currentSongs[0].title).toBe('Hotel California');
  });

  it('should handle large items per page', () => {
    const { result } = renderHook(() => useSongTable(mockSongs, 1, 100));

    expect(result.current.currentSongs).toEqual(mockSongs);
  });

  it('should update current songs when songs array changes', () => {
    const { result, rerender } = renderHook(
      ({ songs, currentPage, itemsPerPage }) => useSongTable(songs, currentPage, itemsPerPage),
      { initialProps: { songs: mockSongs, currentPage: 1, itemsPerPage: 3 } }
    );

    expect(result.current.currentSongs).toHaveLength(3);

    const newSongs: Song[] = [
      {
        id: '6',
        title: 'New Song',
        author: 'New Artist',
        level: 'beginner',
        key: 'C',
        ultimate_guitar_link: 'https://example.com',
        created_at: new Date('2024-01-20T00:00:00Z'),
        updated_at: new Date('2024-01-20T00:00:00Z')
      }
    ];

    rerender({ songs: newSongs, currentPage: 1, itemsPerPage: 3 });

    expect(result.current.currentSongs).toEqual(newSongs);
  });

  it('should update current songs when page changes', () => {
    const { result, rerender } = renderHook(
      ({ songs, currentPage, itemsPerPage }) => useSongTable(songs, currentPage, itemsPerPage),
      { initialProps: { songs: mockSongs, currentPage: 1, itemsPerPage: 2 } }
    );

    expect(result.current.currentSongs).toHaveLength(2);
    expect(result.current.currentSongs[0].title).toBe('Wonderwall');

    rerender({ songs: mockSongs, currentPage: 2, itemsPerPage: 2 });

    expect(result.current.currentSongs).toHaveLength(2);
    expect(result.current.currentSongs[0].title).toBe('Stairway to Heaven');
  });

  it('should update current songs when items per page changes', () => {
    const { result, rerender } = renderHook(
      ({ songs, currentPage, itemsPerPage }) => useSongTable(songs, currentPage, itemsPerPage),
      { initialProps: { songs: mockSongs, currentPage: 1, itemsPerPage: 2 } }
    );

    expect(result.current.currentSongs).toHaveLength(2);

    rerender({ songs: mockSongs, currentPage: 1, itemsPerPage: 4 });

    expect(result.current.currentSongs).toHaveLength(4);
  });
}); 