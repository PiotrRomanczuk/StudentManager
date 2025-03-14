describe("Auth page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/auth/signin");
  });

  it("should have a signIn form", () => {
    cy.get("#signInForm").should("exist");
  });
});
