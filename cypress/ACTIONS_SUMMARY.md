# Actions Summary for StudentManager App

## Authentication & User Management

- Sign up (register new user)
- Sign in (login)
- Sign out (logout)
- Google OAuth sign in
- Update user profile (name, username, website, avatar)
- Fetch user profile
- Admin: View all users
- Admin: Assign roles (admin, teacher, student)

## Song Management

- View all songs (admin)
- View assigned songs (student/teacher)
- Search/filter songs
- Add new song (admin)
- Edit song details (admin)
- Delete song (admin)
- Mark song as favorite
- Remove song from favorites
- Assign song to lesson
- Remove song from lesson
- View song details
- Upload audio files for songs
- Link to external resources (e.g., Ultimate Guitar)

## Lesson Management

- View all lessons (admin/teacher)
- View assigned lessons (student)
- Create new lesson (teacher/admin)
- Edit lesson details (teacher/admin)
- Delete lesson (teacher/admin)
- Assign songs to lesson
- Remove songs from lesson
- View lesson details (with notes, date, time, participants)
- Add lesson notes
- Filter/sort lessons

## Dashboard & Navigation

- View dashboard (role-based: student, teacher, admin)
- Navigate to Songs, Lessons, Assignments, Settings
- Responsive tables and mobile views

## Integrations

- Google Drive: View and manage files (for teachers/admins)
- Spotify: Fetch and display song data (planned)

## Error Handling & Feedback

- Display error messages for failed actions (auth, fetch, CRUD)
- Show toasts/alerts for user actions (success/failure)
- Redirect unauthenticated users to login

## Admin-Specific Actions

- View and manage all users
- View and manage all songs and lessons
- Assign/unassign songs and lessons to users
- Access admin controls in dashboard

## Planned/Future Features (from ToDos)

- Quizzes for chords diagrams
- Calendar for lessons
- AI/LLM features for music theory and exercises
- Improved mobile/tablet UX
- Docker/containerization
- More granular permissions and RLS policies

---

This file summarizes the main actions available in the StudentManager app for all user roles. For more details, see the codebase or the ToDos.md file.
