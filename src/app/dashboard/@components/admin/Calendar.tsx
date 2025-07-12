"use client";

import { useEffect, useState } from "react";
import { FaGoogle, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCalendarWeek } from "react-icons/fa";
import Link from "next/link";

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
  description?: string;
}

export function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Calculate next week's events
  const getNextWeekEvents = () => {
    const today = new Date();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + (7 - today.getDay())); // Get next Sunday
    nextSunday.setHours(23, 59, 59, 999); // End of day

    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      return eventDate >= today && eventDate <= nextSunday;
    });
  };

  const nextWeekEvents = getNextWeekEvents();

  useEffect(() => {
    async function checkAuth() {
      try {

        const response = await fetch("/api/calendar/events");
        
        
        if (response.status === 401) {
          
          setIsAuthenticated(false);
          setAuthError("Please connect your Google Calendar");
        } else if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          setError(errorData.error || "Failed to fetch calendar events");
          setIsAuthenticated(false);
        } else {
          
          setIsAuthenticated(true);
          const data = await response.json();
          setEvents(data.events || []);
        }
      } catch (err) {
        console.error("Error checking auth:", err);
        setError(err instanceof Error ? err.message : "Failed to load events");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-admin-gray-lightest rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-lg font-semibold mb-4">Connect Google Calendar</h3>
        <p className="text-admin-gray-DEFAULT mb-4">
          {authError || "Connect your Google Calendar to view and manage your events"}
        </p>
        <Link
          href="/api/auth/google"
          className="inline-flex items-center gap-2 px-4 py-2 bg-admin-blue-DEFAULT hover:bg-admin-blue-dark text-white rounded-lg shadow transition-colors"
        >
          <FaGoogle /> Connect Calendar
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-50 p-4 rounded-lg">
        <p className="font-medium">Error loading events</p>
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
        <p>No upcoming events</p>
        <p className="text-sm mt-2">Add events to your Google Calendar to see them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Next Week Summary Box */}
      <div className="bg-admin-blue-light rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="bg-admin-blue-DEFAULT p-3 rounded-lg">
            <FaCalendarWeek className="text-white text-xl" />
          </div>
          <div>
            <h3 className="font-semibold text-admin-gray-darker">Next Week&apos;s Events</h3>
            <p className="text-sm text-admin-gray-DEFAULT">
              {nextWeekEvents.length} events until {new Date(Date.now() + (7 - new Date().getDay()) * 86400000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => {
          const startDate = new Date(event.start.dateTime);
          const endDate = new Date(event.end.dateTime);
          const isToday = startDate.toDateString() === new Date().toDateString();
          const isTomorrow = startDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
          
          return (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-admin-gray-light"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-admin-gray-darker text-lg">
                        {event.summary}
                      </h4>
                      {(isToday || isTomorrow) && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isToday 
                            ? "bg-admin-blue-light text-admin-blue-DEFAULT"
                            : "bg-admin-green-light text-admin-green-dark"
                        }`}>
                          {isToday ? "Today" : "Tomorrow"}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-admin-gray-DEFAULT">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-admin-blue-DEFAULT" />
                        <span>
                          {startDate.toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
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

                    {event.description && (
                      <p className="mt-3 text-sm text-admin-gray-DEFAULT line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 