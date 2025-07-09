// import '@testing-library/jest-dom';
// import { render, screen } from '@testing-library/react';
// import Page from '@/app/page';

// // Mock Next.js navigation
// jest.mock('next/navigation', () => ({
//   useRouter() {
//     return {
//       push: jest.fn(),
//       replace: jest.fn(),
//       prefetch: jest.fn(),
//       back: jest.fn(),
//       forward: jest.fn(),
//       refresh: jest.fn(),
//     }
//   },
// }));

// describe('Landing Page', () => {
//   it('should render all main sections', () => {
//     render(<Page />);
    
//     // Check for main sections
//     expect(screen.getByText(/manage your music lessons/i)).toBeInTheDocument(); // Hero
//     expect(screen.getByText(/features/i)).toBeInTheDocument(); // Features
//     expect(screen.getByText(/testimonials/i)).toBeInTheDocument(); // Testimonials
//     expect(screen.getByText(/pricing/i)).toBeInTheDocument(); // Pricing
//     expect(screen.getByText(/team/i)).toBeInTheDocument(); // Team
//     expect(screen.getByText(/contact/i)).toBeInTheDocument(); // Contact
//   });

//   it('should render navigation bar', () => {
//     render(<Page />);
    
//     expect(screen.getByText(/student manager/i)).toBeInTheDocument();
//     expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
//     expect(screen.getByRole('link', { name: /features/i })).toBeInTheDocument();
//     expect(screen.getByRole('link', { name: /pricing/i })).toBeInTheDocument();
//     expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
//   });

//   it('should render authentication buttons in navbar', () => {
//     render(<Page />);
    
//     expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
//     expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
//   });

//   it('should render hero section with call-to-action buttons', () => {
//     render(<Page />);
    
//     expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
//     expect(screen.getByRole('link', { name: /learn more/i })).toBeInTheDocument();
//   });

//   it('should render footer', () => {
//     render(<Page />);
    
//     // Footer should contain copyright or company information
//     expect(screen.getByText(/©|copyright|student manager/i)).toBeInTheDocument();
//   });

//   it('should have proper navigation structure', () => {
//     render(<Page />);
    
//     const nav = screen.getByRole('navigation');
//     expect(nav).toBeInTheDocument();
    
//     // Check for main navigation links
//     const links = screen.getAllByRole('link');
//     expect(links.length).toBeGreaterThan(5); // Should have multiple navigation links
//   });

//   it('should render contact form section', () => {
//     render(<Page />);
    
//     // Look for contact form elements
//     expect(screen.getByText(/contact us/i)).toBeInTheDocument();
//     expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
//   });

//   it('should render pricing section with plans', () => {
//     render(<Page />);
    
//     expect(screen.getByText(/pricing plans/i)).toBeInTheDocument();
//     expect(screen.getByText(/basic/i)).toBeInTheDocument();
//     expect(screen.getByText(/pro/i)).toBeInTheDocument();
//     expect(screen.getByText(/enterprise/i)).toBeInTheDocument();
//   });

//   it('should render testimonials section', () => {
//     render(<Page />);
    
//     expect(screen.getByText(/what our users say/i)).toBeInTheDocument();
//     expect(screen.getByText(/testimonials/i)).toBeInTheDocument();
//   });

//   it('should render team section', () => {
//     render(<Page />);
    
//     expect(screen.getByText(/meet our team/i)).toBeInTheDocument();
//     expect(screen.getByText(/team/i)).toBeInTheDocument();
//   });

//   it('should have proper semantic structure', () => {
//     render(<Page />);
    
//     // Should have main sections
//     const sections = screen.getAllByRole('region');
//     expect(sections.length).toBeGreaterThan(0);
    
//     // Should have proper headings
//     const headings = screen.getAllByRole('heading');
//     expect(headings.length).toBeGreaterThan(5);
//   });
// }); 