import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";

// Mock Next.js Image component
jest.mock("next/image", () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
  },
}));

describe("Landing Page", () => {
  it("should render hero section", () => {
    render(<Page />);
    // Check for hero content
    expect(screen.getByRole('heading', { name: /master the art of guitar teaching/i })).toBeInTheDocument();
    expect(screen.getByText(/transform your guitar teaching studio/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get started free/i })).toBeInTheDocument();
    // Use getAllByText for documentation (button and link)
    const documentationLinks = screen.getAllByText(/documentation/i);
    expect(documentationLinks.length).toBeGreaterThan(0);
  });

  it("should render navigation bar", () => {
    render(<Page />);
    // Check for navigation elements - use getAllByRole and check first one
    const navs = screen.getAllByRole("navigation");
    expect(navs.length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /signin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /signup/i })).toBeInTheDocument();
  });

  it("should render features section", () => {
    render(<Page />);
    expect(screen.getByRole('heading', { name: /powerful features/i })).toBeInTheDocument();
  });

  it("should render testimonials section", () => {
    render(<Page />);
    expect(screen.getByRole('heading', { name: /testimonials/i })).toBeInTheDocument();
  });

  it("should render pricing section", () => {
    render(<Page />);
    // Use heading for pricing
    expect(screen.getByRole('heading', { name: /pricing/i })).toBeInTheDocument();
    expect(screen.getByText(/choose the right plan/i)).toBeInTheDocument();
    // Use heading for each plan
    expect(screen.getByRole('heading', { name: /solo guitar teacher/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /guitar teaching studio/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /music school/i })).toBeInTheDocument();
  });

  it("should render team section", () => {
    render(<Page />);
    expect(screen.getByRole('heading', { name: /meet the team/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /piotr romanczuk/i })).toBeInTheDocument();
  });

  it("should render contact section", () => {
    render(<Page />);
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/how can we help you\?/i)).toBeInTheDocument();
  });

  it("should have proper navigation links", () => {
    render(<Page />);
    const homeLink = screen.getByRole("link", { name: /home/i });
    const signInLink = screen.getByRole("link", { name: /signin/i });
    const signUpLink = screen.getByRole("link", { name: /signup/i });
    expect(homeLink).toHaveAttribute("href", "/");
    expect(signInLink).toHaveAttribute("href", "/auth/signin");
    expect(signUpLink).toHaveAttribute("href", "/auth/signup");
  });

  it("should have call-to-action buttons", () => {
    render(<Page />);
    const getStartedButton = screen.getByRole("link", { name: /get started free/i });
    // Use getAllByRole for documentation (button and link)
    const documentationLinks = screen.getAllByRole("link", { name: /documentation/i });
    expect(getStartedButton).toHaveAttribute("href", "/auth/signin");
    // At least one documentation link should have the correct href
    expect(documentationLinks.some(link => link.getAttribute('href') === '/documentation')).toBe(true);
  });

  it("should have proper semantic structure", () => {
    render(<Page />);
    const navs = screen.getAllByRole("navigation");
    expect(navs.length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: /master the art of guitar teaching/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /powerful features/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /testimonials/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /pricing/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /meet the team/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("should have hero image", () => {
    render(<Page />);
    const heroImage = screen.getByAltText(/dashboard preview/i);
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute("src", "/MOCKUP UI.png");
  });

  it("should have team member image", () => {
    render(<Page />);
    const teamImage = screen.getByAltText(/piotr romanczuk/i);
    expect(teamImage).toBeInTheDocument();
    expect(teamImage).toHaveAttribute("src", "/My_Picture.jpg");
  });
}); 