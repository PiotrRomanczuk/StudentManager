import '@testing-library/jest-dom';
import { renderHook, act } from '@testing-library/react';
import { useSongSorting } from '@/app/dashboard/songs/@components/hooks/useSongSorting';
import { Song } from '@/types/Song';

const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Zebra Song',
    author: 'Author C',
    level: 'advanced',
    key: 'A',
    chords: 'A D E',
    audio_files: 'zebra.mp3',
    ultimate_guitar_link: 'https://ultimate-guitar.com/zebra',
    short_title: 'zebra',
    created_at: new Date('2024-01-03'),
    updated_at: new Date('2024-01-17'),
  },
  {
    id: '2',
    title: 'Alpha Song',
    author: 'Author A',
    level: 'beginner',
    key: 'C',
    chords: 'C G Am F',
    audio_files: 'alpha.mp3',
    ultimate_guitar_link: 'https://ultimate-guitar.com/alpha',
    short_title: 'alpha',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-15'),
  },
  {
    id: '3',
    title: 'Beta Song',
    author: 'Author B',
    level: 'intermediate',
    key: 'G',
    chords: 'G D Em C',
    audio_files: 'beta.mp3',
    ultimate_guitar_link: 'https://ultimate-guitar.com/beta',
    short_title: 'beta',
    created_at: new Date('2024-01-02'),
    updated_at: new Date('2024-01-16'),
  },
];

describe('useSongSorting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default sorting state', () => {
    const { result } = renderHook(() => useSongSorting(mockSongs));

    expect(result.current.sortKey).toBe('updated_at');
    expect(result.current.sortDirection).toBe('desc');
    // Songs should be sorted by updated_at in descending order
    expect(result.current.sortedSongs[0].updated_at).toEqual(new Date('2024-01-17'));
    expect(result.current.sortedSongs[1].updated_at).toEqual(new Date('2024-01-16'));
    expect(result.current.sortedSongs[2].updated_at).toEqual(new Date('2024-01-15'));
  });

  it('should sort songs by title in ascending order', () => {
    const { result } = renderHook(() => useSongSorting(mockSongs));

    act(() => {
      result.current.handleSort('title');
    });

    expect(result.current.sortKey).toBe('title');
    expect(result.current.sortDirection).toBe('asc');
    expect(result.current.sortedSongs[0].title).toBe('Alpha Song');
    expect(result.current.sortedSongs[1].title).toBe('Beta Song');
    expect(result.current.sortedSongs[2].title).toBe('Zebra Song');
  });

  it('should sort songs by title in descending order when clicked twice', () => {
    const { result } = renderHook(() => useSongSorting(mockSongs));

    act(() => {
      result.current.handleSort('title');
    });

    act(() => {
      result.current.handleSort('title');
    });

    expect(result.current.sortKey).toBe('title');
    expect(result.current.sortDirection).toBe('desc');
    expect(result.current.sortedSongs[0].title).toBe('Zebra Song');
    expect(result.current.sortedSongs[1].title).toBe('Beta Song');
    expect(result.current.sortedSongs[2].title).toBe('Alpha Song');
  });

  it('should sort songs by level', () => {
    const { result } = renderHook(() => useSongSorting(mockSongs));

    act(() => {
      result.current.handleSort('level');
    });

    expect(result.current.sortKey).toBe('level');
    expect(result.current.sortDirection).toBe('asc');
    expect(result.current.sortedSongs[0].level).toBe('advanced');
    expect(result.current.sortedSongs[1].level).toBe('beginner');
    expect(result.current.sortedSongs[2].level).toBe('intermediate');
  });

  it('should sort songs by key', () => {
    const { result } = renderHook(() => useSongSorting(mockSongs));

    act(() => {
      result.current.handleSort('key');
    });

    expect(result.current.sortKey).toBe('key');
    expect(result.current.sortDirection).toBe('asc');
    expect(result.current.sortedSongs[0].key).toBe('A');
    expect(result.current.sortedSongs[1].key).toBe('C');
    expect(result.current.sortedSongs[2].key).toBe('G');
  });

  it('should sort songs by updated_at in descending order by default', () => {
    const { result } = renderHook(() => useSongSorting(mockSongs));

    expect(result.current.sortKey).toBe('updated_at');
    expect(result.current.sortDirection).toBe('desc');
    expect(result.current.sortedSongs[0].updated_at).toEqual(new Date('2024-01-17'));
    expect(result.current.sortedSongs[1].updated_at).toEqual(new Date('2024-01-16'));
    expect(result.current.sortedSongs[2].updated_at).toEqual(new Date('2024-01-15'));
  });

  it('should get sort indicator for current sort key', () => {
    const { result } = renderHook(() => useSongSorting(mockSongs));

    act(() => {
      result.current.handleSort('title');
    });

    expect(result.current.getSortIndicator('title')).toBe(' ↑');
    expect(result.current.getSortIndicator('level')).toBe('');
  });

  it('should get sort indicator for descending order', () => {
    const { result } = renderHook(() => useSongSorting(mockSongs));

    act(() => {
      result.current.handleSort('title');
    });

    act(() => {
      result.current.handleSort('title');
    });

    expect(result.current.getSortIndicator('title')).toBe(' ↓');
  });

  it('should handle empty songs array', () => {
    const { result } = renderHook(() => useSongSorting([]));

    expect(result.current.sortedSongs).toEqual([]);
    expect(result.current.sortKey).toBe('updated_at');
    expect(result.current.sortDirection).toBe('desc');
  });

  it('should handle songs with missing properties', () => {
    const incompleteSongs: Song[] = [
      {
        id: '1',
        title: '',
        author: '',
        level: '',
        key: '',
        chords: '',
        audio_files: '',
        ultimate_guitar_link: '',
        short_title: '',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '2',
        title: 'Test Song',
        author: 'Test Author',
        level: 'beginner',
        key: 'C',
        chords: 'C G Am F',
        audio_files: 'test.mp3',
        ultimate_guitar_link: 'https://ultimate-guitar.com/test',
        short_title: 'test',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const { result } = renderHook(() => useSongSorting(incompleteSongs));

    act(() => {
      result.current.handleSort('title');
    });

    expect(result.current.sortedSongs).toHaveLength(2);
  });

  it('should handle case-insensitive sorting', () => {
    const songsWithCase: Song[] = [
      {
        id: '1',
        title: 'alpha song',
        author: 'Author A',
        level: 'beginner',
        key: 'C',
        chords: 'C G Am F',
        audio_files: 'alpha.mp3',
        ultimate_guitar_link: 'https://ultimate-guitar.com/alpha',
        short_title: 'alpha',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '2',
        title: 'Zebra Song',
        author: 'Author B',
        level: 'intermediate',
        key: 'G',
        chords: 'G D Em C',
        audio_files: 'zebra.mp3',
        ultimate_guitar_link: 'https://ultimate-guitar.com/zebra',
        short_title: 'zebra',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const { result } = renderHook(() => useSongSorting(songsWithCase));

    act(() => {
      result.current.handleSort('title');
    });

    expect(result.current.sortedSongs[0].title).toBe('alpha song');
    expect(result.current.sortedSongs[1].title).toBe('Zebra Song');
  });

  it('should maintain sort state when songs array changes', () => {
    const { result, rerender } = renderHook(
      ({ songs }) => useSongSorting(songs),
      { initialProps: { songs: mockSongs } }
    );

    act(() => {
      result.current.handleSort('title');
    });

    expect(result.current.sortKey).toBe('title');
    expect(result.current.sortDirection).toBe('asc');

    // Rerender with new songs
    rerender({ songs: [...mockSongs] });

    expect(result.current.sortKey).toBe('title');
    expect(result.current.sortDirection).toBe('asc');
  });
}); 