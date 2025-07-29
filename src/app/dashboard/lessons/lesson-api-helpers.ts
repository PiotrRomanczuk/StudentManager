import { BASE_URL } from "@/constants/BASE_URL";
import { fetchApi, APIError } from "../../../utils/api-helpers";
import { 
  Lesson, 
  LessonInput, 
  LessonWithProfiles, 
  LessonSong, 
  LessonStatus, 
  SongStatus 
} from "@/schemas";

// Types for API responses
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LessonsResponse {
  lessons: LessonWithProfiles[];
  pagination?: PaginationInfo;
  filters?: Record<string, unknown>;
}

export interface LessonSearchResponse {
  lessons: LessonWithProfiles[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface LessonSongsResponse {
  lessonSongs: Array<{
    id: string;
    lesson_id: string;
    song_id: string;
    song_status: SongStatus;
    student_id: string;
    song: {
      title: string;
      author: string;
      level: string;
      key: string;
    };
    lesson: {
      title: string;
      date: string;
      status: LessonStatus;
    };
  }>;
}

export interface BulkLessonResult {
  results: Array<{
    index: number;
    status: "created" | "updated" | "deleted" | "error";
    reason?: string;
    error?: string;
    data?: Lesson;
  }>;
  summary: {
    total: number;
    success: number;
    error: number;
  };
}

export interface LessonStats {
  total: number;
  byStatus: Record<LessonStatus, number>;
  monthly: Array<{
    month: string;
    count: number;
  }>;
  lessonsWithSongs: number;
  avgLessonsPerStudent: number;
  upcoming: number;
  completedThisMonth: number;
  dateRange: {
    from: string | null;
    to: string | null;
  };
}

export interface LessonAnalytics {
  overview: {
    totalLessons: number;
    completedLessons: number;
    cancelledLessons: number;
    completionRate: number;
    averageDuration: number;
  };
  progress: {
    songsStarted: number;
    songsMastered: number;
    averageProgress: number;
    levelDistribution: Record<string, number>;
  };
  teacherPerformance: Record<string, {
    totalLessons: number;
    completedLessons: number;
    completionRate: number;
    teacher: {
      email?: string;
      firstName?: string;
      lastName?: string;
    };
  }>;
  timeAnalytics: {
    peakHours: Record<string, number>;
    weeklyDistribution: Record<string, number>;
    monthlyTrends: Record<string, number>;
  };
  filters: {
    teacherId?: string;
    studentId?: string;
    period?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export interface TeacherAvailability {
  availability: Array<{
    id: string;
    teacher_id: string;
    date: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
  }>;
  scheduledLessons: LessonWithProfiles[];
  teacherId: string;
}

export interface LessonTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  duration: number;
  structure?: string;
  teacher_id: string;
  teacher_profile?: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  created_at: string;
  updated_at: string;
}

// API Helper Functions

/**
 * Get all lessons with optional filtering and sorting
 */
export async function getAllLessons(params?: {
  userId?: string;
  sort?: "date" | "lesson_number" | "created_at";
  filter?: LessonStatus;
  studentId?: string;
  cookieHeader?: string;
}): Promise<LessonsResponse> {
  const url = new URL(`${BASE_URL}/api/lessons`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && key !== 'cookieHeader') {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  const options: RequestInit = {};
  if (params?.cookieHeader) {
    options.headers = { Cookie: params.cookieHeader };
  }

  return fetchApi<LessonsResponse>(url.toString(), options);
}

/**
 * Get a single lesson by ID
 */
export async function getLessonById(lessonId: string, cookieHeader?: string): Promise<LessonWithProfiles> {
  const url = `${BASE_URL}/api/lessons/${lessonId}`;
  
  const options: RequestInit = {};
  if (cookieHeader) {
    options.headers = { Cookie: cookieHeader };
  }
  
  return fetchApi<LessonWithProfiles>(url, options);
}

/**
 * Create a new lesson
 */
export async function createLesson(lessonData: LessonInput): Promise<Lesson> {
  const url = `${BASE_URL}/api/lessons`;
  
  return fetchApi<Lesson>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lessonData),
  });
}

/**
 * Update an existing lesson
 */
export async function updateLesson(lessonId: string, lessonData: Partial<LessonInput>): Promise<LessonWithProfiles> {
  const url = `${BASE_URL}/api/lessons/${lessonId}`;
  
  return fetchApi<LessonWithProfiles>(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lessonData),
  });
}

/**
 * Delete a lesson
 */
export async function deleteLesson(lessonId: string): Promise<{ success: boolean }> {
  const url = `${BASE_URL}/api/lessons/${lessonId}`;
  
  return fetchApi<{ success: boolean }>(url, {
    method: "DELETE",
  });
}

/**
 * Search lessons with advanced filters
 */
export async function searchLessons(params: {
  q?: string;
  status?: LessonStatus;
  studentId?: string;
  teacherId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "title" | "date" | "created_at" | "updated_at" | "lesson_number";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}): Promise<LessonSearchResponse> {
  const url = new URL(`${BASE_URL}/api/lessons/search`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });

  return fetchApi<LessonSearchResponse>(url.toString());
}

/**
 * Get lesson statistics
 */
export async function getLessonStats(params?: {
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<LessonStats> {
  const url = new URL(`${BASE_URL}/api/lessons/stats`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  return fetchApi<LessonStats>(url.toString());
}

/**
 * Get lesson analytics
 */
export async function getLessonAnalytics(params?: {
  teacherId?: string;
  studentId?: string;
  period?: "week" | "month" | "quarter" | "year";
  dateFrom?: string;
  dateTo?: string;
}): Promise<LessonAnalytics> {
  const url = new URL(`${BASE_URL}/api/lessons/analytics`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  return fetchApi<LessonAnalytics>(url.toString());
}

/**
 * Get teacher availability and scheduled lessons
 */
export async function getTeacherSchedule(params: {
  teacherId: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<TeacherAvailability> {
  const url = new URL(`${BASE_URL}/api/lessons/schedule`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });

  return fetchApi<TeacherAvailability>(url.toString());
}

/**
 * Create teacher availability
 */
export async function createTeacherAvailability(data: {
  teacher_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available?: boolean;
}): Promise<unknown> {
  const url = `${BASE_URL}/api/lessons/schedule`;
  
  return fetchApi<unknown>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Get lesson templates
 */
export async function getLessonTemplates(params?: {
  category?: string;
  teacherId?: string;
}): Promise<{ templates: LessonTemplate[] }> {
  const url = new URL(`${BASE_URL}/api/lessons/templates`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  return fetchApi<{ templates: LessonTemplate[] }>(url.toString());
}

/**
 * Create a lesson template
 */
export async function createLessonTemplate(templateData: {
  name: string;
  description?: string;
  category: string;
  duration?: number;
  structure?: string;
  teacher_id: string;
}): Promise<LessonTemplate> {
  const url = `${BASE_URL}/api/lessons/templates`;
  
  return fetchApi<LessonTemplate>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(templateData),
  });
}

// Lesson Songs Management

/**
 * Get songs assigned to a lesson
 */
export async function getLessonSongs(params: {
  lessonId: string;
  songId?: string;
  studentId?: string;
}): Promise<LessonSongsResponse> {
  const url = new URL(`${BASE_URL}/api/lessons/songs`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });

  return fetchApi<LessonSongsResponse>(url.toString());
}

/**
 * Assign a song to a lesson
 */
export async function assignSongToLesson(lessonSongData: LessonSong): Promise<unknown> {
  const url = `${BASE_URL}/api/lessons/songs`;
  
  return fetchApi<unknown>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lessonSongData),
  });
}

/**
 * Get a specific lesson song assignment
 */
export async function getLessonSongById(assignmentId: string): Promise<unknown> {
  const url = `${BASE_URL}/api/lessons/songs/${assignmentId}`;
  return fetchApi<unknown>(url);
}

/**
 * Update song status in a lesson
 */
export async function updateLessonSongStatus(assignmentId: string, songStatus: SongStatus): Promise<unknown> {
  const url = `${BASE_URL}/api/lessons/songs/${assignmentId}`;
  
  return fetchApi<unknown>(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ song_status: songStatus }),
  });
}

/**
 * Remove a song from a lesson
 */
export async function removeSongFromLesson(assignmentId: string): Promise<{ success: boolean }> {
  const url = `${BASE_URL}/api/lessons/songs/${assignmentId}`;
  
  return fetchApi<{ success: boolean }>(url, {
    method: "DELETE",
  });
}

// Bulk Operations

/**
 * Bulk create lessons
 */
export async function bulkCreateLessons(lessons: LessonInput[]): Promise<BulkLessonResult> {
  const url = `${BASE_URL}/api/lessons/bulk`;
  
  return fetchApi<BulkLessonResult>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lessons }),
  });
}

/**
 * Bulk update lessons
 */
export async function bulkUpdateLessons(updates: Array<{ id: string } & Partial<LessonInput>>): Promise<BulkLessonResult> {
  const url = `${BASE_URL}/api/lessons/bulk`;
  
  return fetchApi<BulkLessonResult>(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ updates }),
  });
}

/**
 * Bulk delete lessons
 */
export async function bulkDeleteLessons(lessonIds: string[]): Promise<BulkLessonResult> {
  const url = `${BASE_URL}/api/lessons/bulk`;
  
  return fetchApi<BulkLessonResult>(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lessonIds }),
  });
}

// Data Export

/**
 * Export lessons data
 */
export async function exportLessons(params: {
  format?: "json" | "csv";
  userId?: string;
  status?: LessonStatus;
  dateFrom?: string;
  dateTo?: string;
  includeSongs?: boolean;
  includeProfiles?: boolean;
}): Promise<Response> {
  const url = new URL(`${BASE_URL}/api/lessons/export`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });

  return fetch(url.toString());
}

// Error handling utilities
export function handleLessonApiError(error: unknown): string {
  console.error("Lesson API Error:", error);
  
  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        return "You are not authorized to perform this action. Please log in again.";
      case 403:
        return "You don't have permission to access this resource. Contact your administrator.";
      case 404:
        return "Lesson not found or API endpoint not available.";
      case 409:
        return "Lesson already exists or conflicts with existing data.";
      case 500:
        return "Server error. Please try again later or contact support.";
      case 503:
        return "Service temporarily unavailable. Please try again later.";
      default:
        return error.message || `API Error (${error.status}): An error occurred`;
    }
  }
  
  if (error instanceof Error) {
    // Check for specific error messages
    if (error.message.includes("Supabase environment variables")) {
      return "Database configuration error. Please check your environment setup.";
    }
    if (error.message.includes("Network error")) {
      return "Network connection error. Please check your internet connection.";
    }
    if (error.message.includes("fetch")) {
      return "Failed to connect to the server. Please try again.";
    }
    return error.message;
  }
  
  return "An unexpected error occurred. Please try again or contact support.";
} 