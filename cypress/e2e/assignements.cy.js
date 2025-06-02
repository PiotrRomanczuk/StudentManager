// Assignements API E2E Tests

describe("Assignements API", () => {
  it("should create a new task with valid data", () => {
    cy.request("POST", "/api/assignements", {
      title: "Test Task",
      description: "Test Description",
      due_date: new Date().toISOString(),
      teacher_id: 1,
      student_id: 2,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.task).to.have.property("id");
      expect(response.body.task.title).to.eq("Test Task");
      expect(response.body.task.teacher_id).to.eq(1);
      expect(response.body.task.student_id).to.eq(2);
    });
  });

  it("should return 400 if required fields are missing", () => {
    cy.request({
      method: "POST",
      url: "/api/assignements",
      failOnStatusCode: false,
      body: {
        description: "Missing required fields",
        due_date: new Date().toISOString(),
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.include("Missing required fields");
    });
  });
});
