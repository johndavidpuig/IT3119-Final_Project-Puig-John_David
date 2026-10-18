
-- =========================================
-- database/queries.sql
-- Student Management System
-- =========================================


-- 1. Display all students with their courses
SELECT
    s.student_id,
    s.student_no,
    s.first_name,
    s.last_name,
    s.year_level,
    s.email,
    c.course_code,
    c.course_name
FROM public.students AS s
LEFT JOIN public.courses AS c
    ON s.course_id = c.course_id
ORDER BY s.last_name, s.first_name;


-- 2. Search for a student by student number
SELECT *
FROM public.students
WHERE student_no = 'TEST-0001';


-- 3. Display all courses with their departments
SELECT
    c.course_id,
    c.course_code,
    c.course_name,
    d.department_name
FROM public.courses AS c
LEFT JOIN public.departments AS d
    ON c.department_id = d.department_id
ORDER BY c.course_code;


-- 4. Count students enrolled in each course
SELECT
    c.course_code,
    c.course_name,
    COUNT(s.student_id) AS total_students
FROM public.courses AS c
LEFT JOIN public.students AS s
    ON c.course_id = s.course_id
GROUP BY c.course_id, c.course_code, c.course_name
ORDER BY c.course_code;


-- 5. Count students by year level
SELECT
    year_level,
    COUNT(*) AS total_students
FROM public.students
GROUP BY year_level
ORDER BY year_level;


-- 6. Display courses grouped by department
SELECT
    d.department_name,
    COUNT(c.course_id) AS total_courses
FROM public.departments AS d
LEFT JOIN public.courses AS c
    ON d.department_id = c.department_id
GROUP BY d.department_id, d.department_name
ORDER BY d.department_name;
