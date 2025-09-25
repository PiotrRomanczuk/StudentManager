export const formatLessonDate = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatLessonTime = (start_time: string) => {
  // Accepts ISO string or HH:mm
  if (!start_time) return "";
  // If only HH:mm, use today as date
  if (/^\d{2}:\d{2}$/.test(start_time)) {
    const today = new Date();
    const [h, m] = start_time.split(":");
    today.setHours(Number(h), Number(m), 0, 0);
    return today.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  // Otherwise, treat as ISO string
  return new Date(start_time).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};
