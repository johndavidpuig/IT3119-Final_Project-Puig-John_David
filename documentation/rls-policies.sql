-- =========================================
-- database/rls-policies.sql
-- Student Management System
-- Row Level Security Policies
-- =========================================

-- Enable Row Level Security on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;


-- STUDENTS POLICIES

-- Allow authenticated users to view students
CREATE POLICY "Authenticated users can view students"
ON public.students
FOR SELECT
TO authenticated
USING (true);


-- Allow authenticated users to insert students
CREATE POLICY "Authenticated users can insert students"
ON public.students
FOR INSERT
TO authenticated
WITH CHECK (true);


-- Allow authenticated users to update students
CREATE POLICY "Authenticated users can update students"
ON public.students
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);


-- Allow authenticated users to delete students
CREATE POLICY "Authenticated users can delete students"
ON public.students
FOR DELETE
TO authenticated
USING (true);


-- COURSES POLICIES

-- Allow authenticated users to view courses
CREATE POLICY "Authenticated users can view courses"
ON public.courses
FOR SELECT
TO authenticated
USING (true);


-- Allow authenticated users to manage courses
CREATE POLICY "Authenticated users can manage courses"
ON public.courses
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);


-- DEPARTMENTS POLICIES

-- Allow authenticated users to view departments
CREATE POLICY "Authenticated users can view departments"
ON public.departments
FOR SELECT
TO authenticated
USING (true);


-- Allow authenticated users to manage departments
CREATE POLICY "Authenticated users can manage departments"
ON public.departments
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
