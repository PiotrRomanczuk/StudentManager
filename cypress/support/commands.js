Cypress.Commands.add("login", () => {
  cy.visit("/auth/signin");
  cy.get("#email").type("test@test.com");
  cy.get("#password").type("test123");
  cy.get("#signInForm").submit();
  cy.url().should("include", "/dashboard");
});
