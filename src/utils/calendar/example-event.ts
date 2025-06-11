export const exampleCalendarEvent = {
  kind: "calendar#event",
  etag: "\"1234567890\"",
  id: "abc123def456",
  status: "confirmed",
  htmlLink: "https://www.google.com/calendar/event?eid=abc123def456",
  created: "2024-03-20T10:00:00.000Z",
  updated: "2024-03-20T10:00:00.000Z",
  summary: "Piano Lesson - John Smith",
  description: "Student: John Smith\nLevel: Intermediate\nFocus: Beethoven Sonata No. 14",
  location: "Music Room 3",
  creator: {
    email: "teacher@example.com",
    displayName: "Music Teacher",
    self: true
  },
  organizer: {
    email: "teacher@example.com",
    displayName: "Music Teacher",
    self: true
  },
  start: {
    dateTime: "2024-03-21T15:00:00+01:00",
    timeZone: "Europe/London"
  },
  end: {
    dateTime: "2024-03-21T16:00:00+01:00",
    timeZone: "Europe/London"
  },
  recurringEventId: null,
  originalStartTime: null,
  iCalUID: "abc123def456@google.com",
  sequence: 0,
  attendees: [
    {
      email: "student@example.com",
      displayName: "John Smith",
      responseStatus: "accepted"
    },
    {
      email: "teacher@example.com",
      displayName: "Music Teacher",
      responseStatus: "accepted"
    }
  ],
  reminders: {
    useDefault: true
  },
  eventType: "default"
}; 