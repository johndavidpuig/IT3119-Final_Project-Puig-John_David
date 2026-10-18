-- =========================================
-- database/triggers.sql
-- Student Management System
-- =========================================

-- Update the timestamp whenever a student record changes
DROP TRIGGER IF EXISTS set_students_updated_at
ON public.students;

CREATE TRIGGER set_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
