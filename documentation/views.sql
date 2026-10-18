
-- =========================================
-- database/views.sql
-- Student Management System
-- =========================================


-- 1. View student details with course information
CREATE OR REPLACE VIEW public.student_details AS
SELECT
    s.student_id,
    s.student_no,
    s.first_name,
    s.last_name,
    s.year_level,
    s.email,
    s.created_at,
    c.course_code,
    c.course_name,
    d.department_name
FROM public.students AS s
LEFT JOIN public.courses AS c
    ON s.course_id = c.course_id
LEFT JOIN public.departments AS d
    ON c.department_id = d.department_id;


-- 2. View student totals by course
CREATE OR REPLACE VIEW public.course_student_totals AS
SELECT
    c.course_id,
    c.course_code,
    c.course_name,
    COUNT(s.student_id) AS total_students
FROM public.courses AS c
LEFT JOIN public.students AS s
    ON c.course_id = s.course_id
GROUP BY
    c.course_id,
    c.course_code,
    c.course_name;
