// import '@testing-library/jest-dom';
// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { Input } from '@/components/ui/input';

// describe('Input Component', () => {
//   it('should render input with default props', () => {
//     render(<Input placeholder="Enter text" />);

//     const input = screen.getByPlaceholderText('Enter text');
//     expect(input).toBeInTheDocument();
//     expect(input).toHaveClass('flex', 'h-9', 'w-full', 'rounded-md');
//   });

//   it('should handle value changes', async () => {
//     const user = userEvent.setup();
//     render(<Input placeholder="Enter text" />);

//     const input = screen.getByPlaceholderText('Enter text');
//     await user.type(input, 'Hello World');

//     expect(input).toHaveValue('Hello World');
//   });

//   it('should be disabled when disabled prop is true', () => {
//     render(<Input disabled placeholder="Disabled input" />);

//     const input = screen.getByPlaceholderText('Disabled input');
//     expect(input).toBeDisabled();
//     expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
//   });

//   it('should apply custom className', () => {
//     render(<Input className="custom-class" placeholder="Custom input" />);

//     const input = screen.getByPlaceholderText('Custom input');
//     expect(input).toHaveClass('custom-class');
//   });

//   it('should forward ref', () => {
//     const ref = jest.fn();
//     render(<Input ref={ref} placeholder="Ref input" />);

//     expect(ref).toHaveBeenCalled();
//   });

//   it('should handle different input types', () => {
//     const { rerender } = render(<Input type="email" placeholder="Email" />);

//     let input = screen.getByPlaceholderText('Email');
//     expect(input).toHaveAttribute('type', 'email');

//     rerender(<Input type="password" placeholder="Password" />);
//     input = screen.getByPlaceholderText('Password');
//     expect(input).toHaveAttribute('type', 'password');

//     rerender(<Input type="number" placeholder="Number" />);
//     input = screen.getByPlaceholderText('Number');
//     expect(input).toHaveAttribute('type', 'number');
//   });

//   it('should handle required attribute', () => {
//     render(<Input required placeholder="Required input" />);

//     const input = screen.getByPlaceholderText('Required input');
//     expect(input).toBeRequired();
//   });

//   it('should handle aria attributes', () => {
//     render(
//       <Input
//         aria-label="Username"
//         aria-describedby="username-help"
//         placeholder="Username"
//       />
//     );

//     const input = screen.getByLabelText('Username');
//     expect(input).toHaveAttribute('aria-describedby', 'username-help');
//   });

//   it('should handle onChange callback', async () => {
//     const handleChange = jest.fn();
//     const user = userEvent.setup();

//     render(<Input onChange={handleChange} placeholder="Test input" />);

//     const input = screen.getByPlaceholderText('Test input');
//     await user.type(input, 'a');

//     expect(handleChange).toHaveBeenCalled();
//   });
// });
