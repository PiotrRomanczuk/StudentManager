import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ShortSongTable } from '@/app/dashboard/@components/cards/ShortSongTable';
import { Song } from '@/types/Song';

describe('ShortSongTable', () => {
  const mockSongs: Song[] = [
    {
      id: '1',
      title: 'Test Song 1',
      author: 'Test Author 1',
      key: 'C',
      level: 'beginner',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-01'),
    },
    {
      id: '2',
      title: 'Test Song 2',
      author: 'Test Author 2',
      key: 'G',
      level: 'intermediate',
      created_at: new Date('2023-01-02'),
      updated_at: new Date('2023-01-02'),
    },
    {
      id: '3',
      title: 'Test Song 3',
      author: 'Test Author 3',
      key: 'D',
      level: 'advanced',
      created_at: new Date('2023-01-03'),
      updated_at: new Date('2023-01-03'),
    },
  ];

  it('should render table with title', () => {
    render(<ShortSongTable songs={mockSongs} />);
    
    expect(screen.getByText('Recent Songs')).toBeInTheDocument();
  });

  it('should render table description', () => {
    render(<ShortSongTable songs={mockSongs} />);
    
    expect(screen.getByText('Your latest added songs')).toBeInTheDocument();
  });

  it('should display song titles', () => {
    render(<ShortSongTable songs={mockSongs} />);
    
    expect(screen.getByText('Test Song 1')).toBeInTheDocument();
    expect(screen.getByText('Test Song 2')).toBeInTheDocument();
    expect(screen.getByText('Test Song 3')).toBeInTheDocument();
  });

  it('should display song authors', () => {
    render(<ShortSongTable songs={mockSongs} />);
    
    expect(screen.getByText('Test Author 1')).toBeInTheDocument();
    expect(screen.getByText('Test Author 2')).toBeInTheDocument();
    expect(screen.getByText('Test Author 3')).toBeInTheDocument();
  });

  it('should display song keys', () => {
    render(<ShortSongTable songs={mockSongs} />);
    
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('G')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('should render view links for each song', () => {
    render(<ShortSongTable songs={mockSongs} />);
    
    const viewLinks = screen.getAllByText('View');
    expect(viewLinks).toHaveLength(3);
  });

  it('should render view links for each song', () => {
    render(<ShortSongTable songs={mockSongs} />);
    
    const viewLinks = screen.getAllByText('View');
    expect(viewLinks).toHaveLength(3);
    
    // Check that links are present (href will be set by Next.js Link component)
    viewLinks.forEach(link => {
      expect(link).toHaveClass('text-blue-500', 'hover:text-blue-600');
    });
  });

  it('should limit display to 5 songs', () => {
    const manySongs: Song[] = [
      ...mockSongs,
      {
        id: '4',
        title: 'Test Song 4',
        author: 'Test Author 4',
        key: 'A',
        level: 'Beginner',
        created_at: '2023-01-04',
        updated_at: '2023-01-04',
      },
      {
        id: '5',
        title: 'Test Song 5',
        author: 'Test Author 5',
        key: 'E',
        level: 'Intermediate',
        created_at: '2023-01-05',
        updated_at: '2023-01-05',
      },
      {
        id: '6',
        title: 'Test Song 6',
        author: 'Test Author 6',
        key: 'B',
        level: 'Advanced',
        created_at: '2023-01-06',
        updated_at: '2023-01-06',
      },
    ];

    render(<ShortSongTable songs={manySongs} />);
    
    // Should only show first 5 songs
    expect(screen.getByText('Test Song 1')).toBeInTheDocument();
    expect(screen.getByText('Test Song 5')).toBeInTheDocument();
    expect(screen.queryByText('Test Song 6')).not.toBeInTheDocument();
  });

  it('should handle empty songs array', () => {
    render(<ShortSongTable songs={[]} />);
    
    expect(screen.getByText('Recent Songs')).toBeInTheDocument();
    expect(screen.getByText('Your latest added songs')).toBeInTheDocument();
  });

  it('should handle single song', () => {
    const singleSong: Song[] = [mockSongs[0]];
    render(<ShortSongTable songs={singleSong} />);
    
    expect(screen.getByText('Test Song 1')).toBeInTheDocument();
    expect(screen.getByText('Test Author 1')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('should have proper table headers', () => {
    render(<ShortSongTable songs={mockSongs} />);
    
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('More Info')).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    render(<ShortSongTable songs={mockSongs} />);
    
    const card = screen.getByText('Recent Songs').closest('.w-full');
    expect(card).toHaveClass('w-full', 'max-w-2xl', 'shadow-lg');
  });

  it('should handle songs with missing data', () => {
    const incompleteSongs: Song[] = [
      {
        id: '1',
        title: 'Test Song',
        author: '',
        key: '',
        level: 'Beginner',
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      },
    ];

    render(<ShortSongTable songs={incompleteSongs} />);
    
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });
}); 