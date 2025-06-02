CREATE OR REPLACE FUNCTION public.increment_lesson_number(
    p_student_id uuid,
    p_teacher_id uuid
) RETURNS bigint AS $$
DECLARE
    lesson_count bigint;
BEGIN
    -- Count the number of lessons for the given student and teacher
    SELECT COUNT(*)
    INTO lesson_count
    FROM public.lessons
    WHERE student_id = p_student_id AND teacher_id = p_teacher_id;

    -- Return 1 if no lessons exist, otherwise return the count + 1
    RETURN CASE
        WHEN lesson_count = 0 THEN 1
        ELSE lesson_count + 1
    END;
END;
$$ LANGUAGE plpgsql;