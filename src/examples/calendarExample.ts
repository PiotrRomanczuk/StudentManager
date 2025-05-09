import { GoogleCalendarService } from '../services/googleCalendar';

async function main() {
  const calendarService = new GoogleCalendarService();
  
  // Initialize the service
  const initialized = await calendarService.initialize();
  if (!initialized) {
    console.error('Failed to initialize Google Calendar service');
    return;
  }

  try {
    // List upcoming events
    const events = await calendarService.listEvents(5);
    console.log('Upcoming events:');
    events.forEach((event: any) => {
      console.log(`${event.summary} (${event.start.dateTime || event.start.date})`);
    });

    // Create a new event
    const newEvent = {
      summary: 'Test Event',
      description: 'This is a test event created via the Google Calendar API',
      start: {
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
        timeZone: 'America/New_York',
      },
    };

    const createdEvent = await calendarService.createEvent(newEvent);
    console.log('Created event:', createdEvent.htmlLink);
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 