describe("Landing page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("should have a navbar", () => {
    cy.get("#navbar").should("exist");
  });

  it("navbar should have a signIn button", () => {
    cy.get("#signIn").should("exist");
  });

  it("navbar should have a signUp button", () => {
    cy.get("#signUp").should("exist");
  });

  it("should have a hero section", () => {
    cy.get("#hero").should("exist");
  });

  it("should have a feature section", () => {
    cy.get("#feature").should("exist");
  });

  it("should have a team section", () => {
    cy.get("#team").should("exist");
  });

  it("signIn button should redirect to login page", () => {
    cy.get("#signIn").click();
    cy.url().should("include", "/signin");
  });

  it("signUp button should redirect to signUp page", () => {
    cy.get("#signUp").click();
    cy.url().should("include", "/signUp");
  });
});
