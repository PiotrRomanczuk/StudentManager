# Student Manager

A modern web application for efficient student, lesson, assignment, and song management—designed for music teachers, schools, and studios. The platform provides a seamless interface for managing students, lessons, assignments, and music repertoire, with robust authentication, analytics, communication tools, and integrations.

## 🎓 Features

### Student Management
- Centralized student profiles with personal and progress information
- Role-based access (Admin, Teacher, Student)
- Add, edit, and view student details
- Track student progress, practice hours, and lesson history

### Lesson Management
- Schedule, create, edit, and delete lessons
- Assign students and teachers to lessons
- Attach notes and track lesson focus
- Manage and assign songs to lessons
- View upcoming and past lessons

### Assignment & Task Management
- Create, assign, and track assignments for students
- Status tracking (completed, in progress, overdue)
- Due dates and progress monitoring

### Song & Repertoire Management
- Add, edit, and organize songs with metadata (title, author, level, key, chords, links)
- Assign songs to lessons and students
- Advanced sorting and filtering
- Data validation using Zod schemas
- CRUD operations for song entries

### Analytics & Progress Tracking
- Visualize student progress and practice statistics
- Performance analytics for students and teachers
- Dashboard with key stats (total students, lessons, assignments, progress rate)

### Communication
- Integrated messaging and progress updates for students and parents
- Notifications for assignments, lessons, and updates

### Authentication & User Management
- Supabase Auth for secure sign-up, sign-in, and session management
- Google OAuth integration
- Protected routes and user sessions

### Integrations
- Google Drive integration for sharing resources
- Planned: Spotify API for song metadata

### Responsive Dashboard
- Intuitive, modern dashboard for admins, teachers, and students
- Mobile-friendly, responsive design
- Role-based navigation and access

### Additional Features
- Engaging landing page with hero, features, team, testimonials, and pricing
- Settings page for user preferences (future)
- Testing page for integration checks
- Future: AI-powered features, quizzes, practice recommendations, and more (see ToDos.md)

---

## 🖼️ Visual Preview

### Landing Page
![Landing Page Screenshot 1](public/LandingPage%201.png)
![Landing Page Screenshot 2](public/LandingPage%202.png)

### Dashboard Mockup UI
![Dashboard Mockup UI](public/MOCKUP%20UI.png)

---

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js
- **Database**: Supabase
- **Authentication**: Supabase Auth, Google OAuth
- **Data Validation**: Zod
- **Styling**: Tailwind CSS
- **API**: RESTful endpoints with Next.js API routes

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account
- Google OAuth credentials

### Installation

1. Clone the repository

```bash
git clone [repository-url]
cd student-manager
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Configure environment variables

```bash
# Create a .env.local file with the following variables
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
