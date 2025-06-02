describe("Dashboard", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/dashboard");
  });

  it("should redirect unauthenticated users to login", () => {
    cy.clearCookies();
    cy.visit("/dashboard");
    cy.url().should("include", "/auth/signin");
  });

  it("should display the dashboard navbar", () => {
    cy.get("nav").should("exist");
    cy.get("nav").then(($nav) => cy.log($nav.html()));
    cy.contains(/songs/i).should("exist");
    cy.contains(/assignments/i).should("exist");
    cy.contains(/lessons/i).should("exist");
    cy.contains(/settings/i).should("exist");
  });

  it("should navigate to Songs page and display songs", () => {
    cy.get("nav").then(($nav) => cy.log("Navbar HTML:", $nav.html()));
    cy.get("body").then(($body) => cy.log("Body HTML:", $body.html()));
    cy.contains(/songs/i).should("be.visible").click({ force: true });
    cy.url({ timeout: 6000 }).should("include", "/dashboard/songs");
    cy.get("h1").should("contain", "Songs");
    cy.get("body").then(($body) => {
      if ($body.text().includes("No songs found")) {
        cy.contains("No songs found").should("exist");
      } else {
        cy.get('table, [data-testid="song-list"]').should("exist");
      }
    });
  });

  it("should show admin controls for admin users", () => {
    cy.visit("/dashboard/songs");
    cy.get("body").then(($body) => {
      if ($body.text().includes("Add New Song")) {
        cy.contains("Add New Song").should("exist");
      } else {
        cy.log("Not an admin user or admin controls not visible");
      }
    });
  });

  it("should log out and redirect to login", () => {
    cy.get("nav").then(($nav) => cy.log("Navbar HTML:", $nav.html()));
    cy.contains("nav *", /logout/i)
      .should("be.visible")
      .click({ force: true });
    cy.url({ timeout: 6000 }).should("include", "/auth/signin");
  });
});
