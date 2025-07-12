"use client";

import { useEffect, useState } from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
  location?: string;
}

export function Lessons() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTodayLessons() {
      try {
        const response = await fetch("/api/calendar/events");
        if (!response.ok) {
          throw new Error("Failed to fetch lessons");
        }
        const data = await response.json();
        
        // Filter today's events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayEvents = data.events.filter((event: CalendarEvent) => {
          const eventDate = new Date(event.start.dateTime);
          return eventDate >= today && eventDate < tomorrow;
        });

        setEvents(todayEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load lessons");
      } finally {
        setLoading(false);
      }
    }

    fetchTodayLessons();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="h-32 bg-admin-gray-lightest rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-50 p-4 rounded-lg">
        <p className="font-medium">Error loading lessons</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-6 text-admin-gray-DEFAULT">
        <p>No lessons scheduled for today</p>
        <p className="text-sm mt-2">Add lessons to your Google Calendar to see them here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => {
        const startDate = new Date(event.start.dateTime);
        const endDate = new Date(event.end.dateTime);
        
        return (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-admin-gray-light h-full"
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-admin-gray-darker text-lg">
                    {event.summary}
                  </h4>
                </div>
                
                <div className="space-y-2 text-sm text-admin-gray-DEFAULT">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-admin-blue-DEFAULT" />
                    <span>
                      {startDate.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {" - "}
                      {endDate.toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-admin-blue-DEFAULT" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
