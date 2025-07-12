import '@testing-library/jest-dom';

// Test individual imports
describe('Component Import Debug', () => {
  it('should import SongsClientComponent', () => {
    const SongsClientComponent = require('@/app/dashboard/songs/@components/SongsClientComponent').default;
    expect(SongsClientComponent).toBeDefined();
    expect(typeof SongsClientComponent).toBe('function');
  });

  it('should import SongTable', () => {
    const { SongTable } = require('@/app/dashboard/songs/@components/SongTable');
    expect(SongTable).toBeDefined();
    expect(typeof SongTable).toBe('function');
  });

  it('should import SongTableMobile', () => {
    const { SongTableMobile } = require('@/app/dashboard/songs/@components/SongTableMobile');
    expect(SongTableMobile).toBeDefined();
    expect(typeof SongTableMobile).toBe('function');
  });

  it('should import SongSearchBar', () => {
    const { SongSearchBar } = require('@/app/dashboard/songs/@components/SongSearchBar');
    expect(SongSearchBar).toBeDefined();
    expect(typeof SongSearchBar).toBe('function');
  });

  it('should import PaginationComponent', () => {
    const { PaginationComponent } = require('@/app/dashboard/@components/pagination/PaginationComponent');
    expect(PaginationComponent).toBeDefined();
    expect(typeof PaginationComponent).toBe('function');
  });

  it('should import useSongSorting', () => {
    const { useSongSorting } = require('@/app/dashboard/songs/@components/hooks/useSongSorting');
    expect(useSongSorting).toBeDefined();
    expect(typeof useSongSorting).toBe('function');
  });

  it('should import useSongFiltering', () => {
    const { useSongFiltering } = require('@/app/dashboard/songs/@components/hooks/useSongFiltering');
    expect(useSongFiltering).toBeDefined();
    expect(typeof useSongFiltering).toBe('function');
  });

  it('should import useSongTable', () => {
    const { useSongTable } = require('@/app/dashboard/songs/@components/hooks/useSongTable');
    expect(useSongTable).toBeDefined();
    expect(typeof useSongTable).toBe('function');
  });

  it('should import TABLE_HEADERS', () => {
    const { TEACHER_TABLE_HEADERS, STUDENT_TABLE_HEADERS } = require('@/app/dashboard/songs/@components/TABLE_HEADERS');
    expect(TEACHER_TABLE_HEADERS).toBeDefined();
    expect(STUDENT_TABLE_HEADERS).toBeDefined();
  });
}); 