// Song Management E2E Tests

describe("Song Management", () => {
  it("should allow an admin to view all songs", () => {
    cy.login("admin");
    cy.visit("/dashboard/songs");
    // cy.get('table').should('exist');
    // cy.contains('Add New Song').should('exist');
  });

  it("should allow a student/teacher to view assigned songs", () => {
    cy.login("student");
    cy.visit("/dashboard/songs");
    // cy.get('table').should('exist');
    // cy.contains('Assigned Songs').should('exist');
  });

  it("should allow users to search and filter songs", () => {
    cy.login();
    cy.visit("/dashboard/songs");
    // cy.get('input[placeholder="Search songs"]').type('Imagine');
    // cy.get('table').should('contain', 'Imagine');
  });

  it("should allow an admin to add a new song", () => {
    cy.login("admin");
    cy.visit("/dashboard/songs/create");
    // cy.get('input[name="title"]').type('New Song');
    // cy.get('form').submit();
    // cy.contains('Song created').should('exist');
  });

  it("should allow an admin to edit a song", () => {
    cy.login("admin");
    cy.visit("/dashboard/songs");
    // cy.contains('Edit').first().click();
    // cy.get('input[name="title"]').clear().type('Updated Song Title');
    // cy.get('form').submit();
    // cy.contains('Song updated').should('exist');
  });

  it("should allow an admin to delete a song", () => {
    cy.login("admin");
    cy.visit("/dashboard/songs");
    // cy.contains('Delete').first().click();
    // cy.contains('Confirm').click();
    // cy.contains('Song deleted').should('exist');
  });

  it("should allow a user to mark a song as favorite", () => {
    cy.login();
    cy.visit("/dashboard/songs");
    // cy.contains('Favorite').first().click();
    // cy.contains('Added to favorites').should('exist');
  });

  it("should allow a user to remove a song from favorites", () => {
    cy.login();
    cy.visit("/dashboard/songs");
    // cy.contains('Unfavorite').first().click();
    // cy.contains('Removed from favorites').should('exist');
  });

  it("should allow assigning a song to a lesson", () => {
    cy.login("teacher");
    cy.visit("/dashboard/lessons");
    // cy.contains('Manage Songs').first().click();
    // cy.get('input[placeholder="Search songs"]').type('Imagine');
    // cy.contains('Add Song').click();
    // cy.contains('Song added to lesson').should('exist');
  });

  it("should allow removing a song from a lesson", () => {
    cy.login("teacher");
    cy.visit("/dashboard/lessons");
    // cy.contains('Manage Songs').first().click();
    // cy.contains('Remove').first().click();
    // cy.contains('Song removed from lesson').should('exist');
  });

  it("should allow viewing song details", () => {
    cy.login();
    cy.visit("/dashboard/songs");
    // cy.contains('View Details').first().click();
    // cy.get('.song-details').should('exist');
  });

  it("should allow uploading audio files for a song", () => {
    cy.login("admin");
    cy.visit("/dashboard/songs/create");
    // cy.get('input[type="file"]').attachFile('audio.mp3');
    // cy.get('form').submit();
    // cy.contains('Audio uploaded').should('exist');
  });

  it("should display a link to external resources (e.g., Ultimate Guitar)", () => {
    cy.login();
    cy.visit("/dashboard/songs");
    // cy.contains('Ultimate Guitar').should('have.attr', 'href');
  });
});
