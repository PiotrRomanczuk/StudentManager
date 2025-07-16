import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { SongsTable } from '@/app/dashboard/tdd-songs/components/SongsTable';
import { Song } from '@/types/Song';

describe('SongsTable (actions)', () => {
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
  ];

  it('should render a View button for each song', () => {
    render(<SongsTable songs={mockSongs} onView={jest.fn()} />);
    expect(screen.getAllByRole('button', { name: /view/i })).toHaveLength(mockSongs.length);
  });

  it('should call onView with the correct song when View button is clicked', () => {
    const onView = jest.fn();
    render(<SongsTable songs={mockSongs} onView={onView} />);
    const viewButtons = screen.getAllByRole('button', { name: /view/i });
    fireEvent.click(viewButtons[0]);
    expect(onView).toHaveBeenCalledWith(mockSongs[0]);
  });
}); 