import { transformLessonsData } from './LessonsDataTransformer';
import type { LessonWithProfiles } from '@/schemas';

// filepath: src/app/dashboard/lessons/@components/LessonsDataTransformer.test.ts

describe('transformLessonsData', () => {
  it('transforms lessons with all fields present', () => {
    const input: LessonWithProfiles[] = [
      {
        id: '1',
        student_id: 'student1',
        teacher_id: 'teacher1',
        lesson_number: 5,
        date: '2024-06-01',
        time: '15:00:00',
        status: 'SCHEDULED',
        created_at: '2024-05-01T10:00:00Z',
        updated_at: '2024-05-02T10:00:00Z',
        profile: { email: 'student1@example.com' },
        teacher_profile: { email: 'teacher1@example.com' },
        notes: 'Lesson notes',
        title: 'Lesson Title'
      }
    ];
    const result = transformLessonsData(input);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
    expect(result[0].lesson_number).toBe(5);
    expect(result[0].date).toBeInstanceOf(Date);
    expect(result[0].date.toISOString().split('T')[0]).toBe('2024-06-01');
    expect(result[0].time).toBe('15:00:00');
    expect(result[0].profile).toEqual({ email: 'student1@example.com' });
    expect(result[0].teacher_profile).toEqual({ email: 'teacher1@example.com' });
    expect(result[0].notes).toBe('Lesson notes');
    expect(result[0].title).toBe('Lesson Title');
    expect(result[0].status).toBe('SCHEDULED');
    expect(Array.isArray(result[0].songs)).toBe(true);
  });

  it('sets defaults for missing optional fields', () => {
    const input: LessonWithProfiles[] = [
      {
        id: '2',
        student_id: 'student2',
        teacher_id: 'teacher2',
        lesson_number: undefined,
        date: '2024-06-02',
        time: '16:00:00',
        status: undefined,
        created_at: undefined,
        updated_at: undefined,
        profile: null,
        teacher_profile: null,
        notes: undefined,
        title: undefined
      }
    ];
    const result = transformLessonsData(input);
    expect(result).toHaveLength(1);
    expect(result[0].lesson_number).toBe(0);
    expect(result[0].status).toBe('SCHEDULED');
    expect(typeof result[0].created_at).toBe('string');
    expect(typeof result[0].updated_at).toBe('string');
    expect(result[0].notes).toBe('');
    expect(result[0].title).toBeUndefined();
  });

  it('handles empty or invalid time as empty string', () => {
    const input: LessonWithProfiles[] = [
      {
        id: '3',
        student_id: 'student3',
        teacher_id: 'teacher3',
        lesson_number: 1,
        date: '2024-06-03',
        time: '',
        status: 'SCHEDULED',
        created_at: '2024-05-03T10:00:00Z',
        updated_at: '2024-05-03T10:00:00Z',
        profile: null,
        teacher_profile: null
      },
      {
        id: '4',
        student_id: 'student4',
        teacher_id: 'teacher4',
        lesson_number: 2,
        date: '2024-06-04',
        time: undefined,
        status: 'SCHEDULED',
        created_at: '2024-05-04T10:00:00Z',
        updated_at: '2024-05-04T10:00:00Z',
        profile: null,
        teacher_profile: null
      }
    ];
    const result = transformLessonsData(input);
    expect(result[0].time).toBe('');
    expect(result[1].time).toBe('');
  });

  it('handles missing or invalid date by using current date', () => {
    const input: LessonWithProfiles[] = [
      {
        id: '5',
        student_id: 'student5',
        teacher_id: 'teacher5',
        lesson_number: 1,
        date: undefined,
        time: '12:00:00',
        status: 'SCHEDULED',
        created_at: '2024-05-05T10:00:00Z',
        updated_at: '2024-05-05T10:00:00Z',
        profile: null,
        teacher_profile: null
      }
    ];
    const before = new Date();
    const result = transformLessonsData(input);
    const after = new Date();
    expect(result[0].date).toBeInstanceOf(Date);
    // Should be close to now
    expect(result[0].date.getTime()).toBeGreaterThanOrEqual(before.getTime() - 1000);
    expect(result[0].date.getTime()).toBeLessThanOrEqual(after.getTime() + 1000);
  });

  it('filters out lessons missing required fields', () => {
    const input: LessonWithProfiles[] = [
      {
        id: undefined,
        student_id: 'student6',
        teacher_id: 'teacher6',
        lesson_number: 1,
        date: '2024-06-06',
        time: '10:00:00',
        status: 'SCHEDULED',
        created_at: '2024-05-06T10:00:00Z',
        updated_at: '2024-05-06T10:00:00Z',
        profile: null,
        teacher_profile: null
      },
      {
        id: '7',
        student_id: undefined,
        teacher_id: 'teacher7',
        lesson_number: 1,
        date: '2024-06-07',
        time: '11:00:00',
        status: 'SCHEDULED',
        created_at: '2024-05-07T10:00:00Z',
        updated_at: '2024-05-07T10:00:00Z',
        profile: null,
        teacher_profile: null
      },
      {
        id: '8',
        student_id: 'student8',
        teacher_id: undefined,
        lesson_number: 1,
        date: '2024-06-08',
        time: '12:00:00',
        status: 'SCHEDULED',
        created_at: '2024-05-08T10:00:00Z',
        updated_at: '2024-05-08T10:00:00Z',
        profile: null,
        teacher_profile: null
      }
    ];
    const result = transformLessonsData(input);
    expect(result).toHaveLength(0);
  });
});