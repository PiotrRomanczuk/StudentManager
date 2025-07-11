import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminControls } from '@/app/dashboard/songs/@components/AdminControls';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: jest.fn(),
  }),
}));

const mockProfiles = [
  {
    id: '1',
    full_name: 'John Doe',
    email: 'john@example.com',
  },
  {
    id: '2',
    full_name: 'Jane Smith',
    email: 'jane@example.com',
  },
];

describe('AdminControls', () => {
  const defaultProps = {
    profiles: mockProfiles,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render admin controls', () => {
    render(<AdminControls {...defaultProps} />);
    
    expect(screen.getByText('Admin Controls')).toBeInTheDocument();
  });

  it('should render create song button', () => {
    render(<AdminControls {...defaultProps} />);
    
    expect(screen.getByText('Create Song')).toBeInTheDocument();
  });

  it('should navigate to create song page when create button is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminControls {...defaultProps} />);
    
    const createButton = screen.getByText('Create Song');
    await user.click(createButton);
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard/songs/create');
  });

  it('should render student selector when profiles are provided', () => {
    render(<AdminControls {...defaultProps} />);
    
    expect(screen.getByText('Select Student')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should handle student selection', async () => {
    const user = userEvent.setup();
    render(<AdminControls {...defaultProps} />);
    
    const select = screen.getByRole('combobox');
    await user.click(select);
    
    const option = screen.getByText('John Doe');
    await user.click(option);
    
    expect(select).toHaveValue('1');
  });

  it('should navigate to student songs when student is selected and view button is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminControls {...defaultProps} />);
    
    // Select a student
    const select = screen.getByRole('combobox');
    await user.click(select);
    const option = screen.getByText('John Doe');
    await user.click(option);
    
    // Click view button
    const viewButton = screen.getByText('View Songs');
    await user.click(viewButton);
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard/songs?user_id=1');
  });

  it('should disable view button when no student is selected', () => {
    render(<AdminControls {...defaultProps} />);
    
    const viewButton = screen.getByText('View Songs');
    expect(viewButton).toBeDisabled();
  });

  it('should enable view button when student is selected', async () => {
    const user = userEvent.setup();
    render(<AdminControls {...defaultProps} />);
    
    // Initially disabled
    const viewButton = screen.getByText('View Songs');
    expect(viewButton).toBeDisabled();
    
    // Select a student
    const select = screen.getByRole('combobox');
    await user.click(select);
    const option = screen.getByText('John Doe');
    await user.click(option);
    
    // Should be enabled
    expect(viewButton).not.toBeDisabled();
  });

  it('should handle empty profiles array', () => {
    render(<AdminControls profiles={[]} />);
    
    expect(screen.getByText('Admin Controls')).toBeInTheDocument();
    expect(screen.getByText('Create Song')).toBeInTheDocument();
    expect(screen.getByText('Select Student')).toBeInTheDocument();
  });

  it('should apply correct CSS classes for styling', () => {
    render(<AdminControls {...defaultProps} />);
    
    const container = screen.getByText('Admin Controls').closest('div');
    expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-4');
    
    const createButton = screen.getByText('Create Song');
    expect(createButton).toHaveClass('bg-admin-blue', 'hover:bg-admin-blue-dark');
    
    const viewButton = screen.getByText('View Songs');
    expect(viewButton).toHaveClass('bg-admin-green', 'hover:bg-admin-green-dark');
  });

  it('should handle profiles with missing properties gracefully', () => {
    const incompleteProfiles = [
      {
        id: '3',
        full_name: '',
        email: '',
      },
    ];
    
    render(<AdminControls profiles={incompleteProfiles} />);
    
    expect(screen.getByText('Admin Controls')).toBeInTheDocument();
    expect(screen.getByText('Select Student')).toBeInTheDocument();
  });

  it('should reset student selection when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminControls {...defaultProps} />);
    
    // Select a student
    const select = screen.getByRole('combobox');
    await user.click(select);
    const option = screen.getByText('John Doe');
    await user.click(option);
    
    // Verify student is selected
    expect(select).toHaveValue('1');
    
    // Click reset button
    const resetButton = screen.getByText('Reset');
    await user.click(resetButton);
    
    // Verify student selection is reset
    expect(select).toHaveValue('');
  });

  it('should handle multiple student selections', async () => {
    const user = userEvent.setup();
    render(<AdminControls {...defaultProps} />);
    
    const select = screen.getByRole('combobox');
    
    // Select first student
    await user.click(select);
    const option1 = screen.getByText('John Doe');
    await user.click(option1);
    expect(select).toHaveValue('1');
    
    // Select second student
    await user.click(select);
    const option2 = screen.getByText('Jane Smith');
    await user.click(option2);
    expect(select).toHaveValue('2');
  });
}); 