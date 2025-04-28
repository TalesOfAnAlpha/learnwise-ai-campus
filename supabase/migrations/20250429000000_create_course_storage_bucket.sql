
-- Create course-content storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-content', 
  'Course Content Files', 
  TRUE, 
  104857600, -- 100MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Set RLS policies for the course-content bucket
CREATE POLICY "Anyone can read course content"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-content');

CREATE POLICY "Authenticated users can upload course content"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-content' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own course content"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'course-content' AND
    owner = auth.uid()
  );

CREATE POLICY "Users can delete their own course content"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'course-content' AND
    owner = auth.uid()
  );
