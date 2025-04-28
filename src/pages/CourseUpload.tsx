
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BasicInfo from '@/components/course-upload/BasicInfo';
import MediaUpload from '@/components/course-upload/MediaUpload';
import { Loader2 } from 'lucide-react';

const CourseUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a course",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: course, error } = await supabase
        .from('courses')
        .insert({
          title,
          description,
          instructor_id: user.id,
          category,
          level,
          price: parseFloat(price),
          duration,
          thumbnail_url: thumbnailUrl,
          video_url: videoUrl,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your course has been created successfully.",
      });

      navigate(`/courses/${course.id}`);
    } catch (error: any) {
      toast({
        title: "Error creating course",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <BasicInfo
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                category={category}
                setCategory={setCategory}
                level={level}
                setLevel={setLevel}
                price={price}
                setPrice={setPrice}
                duration={duration}
                setDuration={setDuration}
              />

              <MediaUpload
                thumbnailUrl={thumbnailUrl}
                setThumbnailUrl={setThumbnailUrl}
                videoUrl={videoUrl}
                setVideoUrl={setVideoUrl}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Course...
                  </>
                ) : (
                  'Create Course'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CourseUpload;
