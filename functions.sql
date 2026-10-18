-- =========================================
-- database/functions.sql
-- Student Management System
-- =========================================

-- Count students assigned to a specific course
CREATE OR REPLACE FUNCTION public.count_students_in_course(
    p_course_id bigint
)
RETURNS bigint
LANGUAGE sql
STABLE
AS $$
    SELECT COUNT(*)
    FROM public.students
    WHERE course_id = p_course_id;
$$;
