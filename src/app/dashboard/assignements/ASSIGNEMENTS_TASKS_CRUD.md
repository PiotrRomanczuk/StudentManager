# Tasks Table CRUD Operations

This document outlines all CRUD (Create, Read, Update, Delete) operations for the `tasks` table as defined in `assignements_table.json`.

---

## Create

### Create a New Task

- **Inputs:**
  - `title` (string, required)
  - `description` (string, optional)
  - `due_date` (timestamp, optional)
  - `teacher_id` (bigint, required)
  - `student_id` (bigint, required)
- **Output:**
  - The created task object (including `id`, `created_at`, `updated_at`, etc.)

---

## Read

### Get All Tasks

- **Inputs (optional filters):**
  - `teacher_id`, `student_id`, `due_date`, etc.
  - Pagination and sorting options (e.g., by `created_at`, `due_date`)
- **Output:**
  - List of task objects

### Get a Single Task by ID

- **Input:**
  - `id` (bigint)
- **Output:**
  - The task object or 404 if not found

### Get All Tasks for a Specific Student

- **Input:**
  - `student_id` (bigint)
- **Output:**
  - List of task objects

### Get All Tasks for a Specific Teacher

- **Input:**
  - `teacher_id` (bigint)
- **Output:**
  - List of task objects

### Search Tasks by Title or Description

- **Input:**
  - Search query string
- **Output:**
  - List of matching task objects

---

## Update

### Update a Task by ID

- **Inputs:**
  - `id` (bigint)
  - Fields to update (`title`, `description`, `due_date`, etc.)
- **Output:**
  - The updated task object

### (Optional) Mark a Task as Completed

- **Inputs:**
  - `id` (bigint)
  - `completed` status (if such a field is added)
- **Output:**
  - The updated task object

---

## Delete

### Delete a Task by ID

- **Input:**
  - `id` (bigint)
- **Output:**
  - Success/failure status

---

## Other Useful Operations (Optional)

- **Bulk delete tasks** (e.g., by `student_id` or `teacher_id`)
- **Bulk update tasks** (e.g., change due date for multiple tasks)
- **Get overdue tasks** (where `due_date` < now and not completed, if you add a `completed` field)
