describe("Auth page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/auth/signin");
  });

  it("should have a signIn form", () => {
    cy.get("#signInForm").should("exist");
  });
});

// Authentication & User Management E2E Tests

describe("Authentication & User Management", () => {
  // it('should allow a user to sign up (register)', () => {
  //   // Visit sign up page
  //   cy.visit('/auth/signup');
  //   // Fill out registration form
  //   cy.get('input[name="email"]').type('testuser@example.com');
  //   cy.get('input[name="password"]').type('TestPassword123!');
  //   cy.get('form').submit();
  //   // Assert user is redirected/logged in
  //   cy.url().should('include', '/dashboard');
  // });

  it("should allow a user to sign in (login)", () => {
    cy.visit("/auth/signin");
    cy.get('input[name="email"]').type("test@test.com");
    cy.get('input[name="password"]').type("test123");
    cy.get("form").submit();
    cy.url().should("include", "/dashboard");
  });

  it("should allow a user to sign out (logout)", () => {
    // Assume user is logged in
    cy.login();
    cy.visit("/dashboard");
    cy.contains(/logout/i).click();
    cy.url().should("include", "/auth/signin");
  });

  it("should allow a user to sign in with Google OAuth", () => {
    cy.visit("/auth/signin");
    cy.contains("Sign in with Google").click();
    // TODO: Mock or handle Google OAuth flow
    cy.url().should("include", "/dashboard");
  });

  it("should allow a user to update their profile", () => {
    cy.login();
    cy.visit("/account");
    cy.get('input[name="username"]').clear().type("newusername");
    cy.get("form").submit();
    cy.contains("Profile updated").should("exist");
  });

  it("should fetch and display the user profile", () => {
    cy.login();
    cy.visit("/account");
    cy.get(".profile-info").should("contain", "testuser@example.com");
  });
});
