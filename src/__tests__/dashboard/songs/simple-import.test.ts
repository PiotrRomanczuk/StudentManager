describe('Simple Import Test', () => {
  it('should import SongsClientComponent', () => {
    // This will help us see if the import is working
    expect(() => {
      require('@/app/dashboard/songs/@components/SongsClientComponent');
    }).not.toThrow();
  });

  it('should import child components', () => {
    expect(() => {
      require('@/app/dashboard/songs/@components/SongTable');
    }).not.toThrow();

    expect(() => {
      require('@/app/dashboard/songs/@components/SongTableMobile');
    }).not.toThrow();

    expect(() => {
      require('@/app/dashboard/songs/@components/SongSearchBar');
    }).not.toThrow();

    expect(() => {
      require('@/app/dashboard/@components/pagination/PaginationComponent');
    }).not.toThrow();
  });

  it('should import hooks', () => {
    expect(() => {
      require('@/app/dashboard/songs/@components/hooks/useSongSorting');
    }).not.toThrow();

    expect(() => {
      require('@/app/dashboard/songs/@components/hooks/useSongFiltering');
    }).not.toThrow();

    expect(() => {
      require('@/app/dashboard/songs/@components/hooks/useSongTable');
    }).not.toThrow();
  });
}); 