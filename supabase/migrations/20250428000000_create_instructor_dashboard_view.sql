
-- Create instructor dashboard view
CREATE OR REPLACE VIEW public.instructor_dashboard AS
SELECT 
    c.id as course_id,
    c.title as course_title,
    c.created_at as course_created_at,
    COUNT(ue.id) as total_enrollments,
    COUNT(CASE WHEN ue.completed = true THEN 1 END) as completed_enrollments,
    COALESCE(SUM(c.price), 0) as total_earnings,
    c.rating,
    c.reviews
FROM 
    public.courses c
LEFT JOIN 
    public.user_enrollments ue ON c.id = ue.course_id
GROUP BY 
    c.id, c.title, c.created_at, c.rating, c.reviews;
