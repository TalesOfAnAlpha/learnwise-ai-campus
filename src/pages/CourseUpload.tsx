import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/components/ui/card';
import { Upload, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import type { Database } from '@/types/database';

const categories = [
  'Web Development',
  'Data Science',
  'Mobile Development',
  'Cybersecurity',
  'UX/UI Design',
  'Business & Marketing',
  'Artificial Intelligence',
  'Cloud Computing',
  'Game Development',
  'Photography',
  'Music & Audio',
  'Personal Development',
  'Programming',
  'Design',
  'Marketing',
  'Blockchain',
];

const levels = ['Beginner', 'Intermediate', 'Advanced'];

// at the top of the file, update the form schema to include the videoUrl field

const formSchema = z.object({
  title: z.string().min(10, {
    message: 'Title must be at least 10 characters.',
  }).max(100),
  description: z.string().min(50, {
    message: 'Description must be at least 50 characters.',
  }).max(1000),
  category: z.string().min(1, {
    message: 'Please select a category.',
  }),
  level: z.string().min(1, {
    message: 'Please select a level.',
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Price must be a valid number.',
  }),
  duration: z.string().min(1, {
    message: 'Please specify the course duration.',
  }),
  coverImage: z.instanceof(File).optional(),
  courseVideo: z.instanceof(File).optional(),
  videoUrl: z.string().optional(),
});

// Keep the rest of the file as is...

type FormValues = z.infer<typeof formSchema>;
type CourseInsert = Database['public']['Tables']['student_courses']['Insert'];

const CourseUpload: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserID = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        // Redirect to login if not authenticated
        toast({
          title: 'Authentication required',
          description: 'Please log in to create a course.',
          variant: 'destructive',
        });
        navigate('/login');
      }
    };
    
    fetchUserID();
  }, [navigate, toast]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      level: '',
      price: '',
      duration: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      if (!userId) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to create a course.',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      // Upload cover image if provided
      let thumbnailUrl = null;
      if (values.coverImage) {
        const fileExt = values.coverImage.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;
        
        try {
          const { error: uploadError, data } = await supabase.storage
            .from('course-thumbnails')
            .upload(filePath, values.coverImage);

          if (uploadError) {
            console.error('Cover image upload error:', uploadError);
            throw new Error(`Cover image upload failed: ${uploadError.message}`);
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('course-thumbnails')
            .getPublicUrl(filePath);
            
          thumbnailUrl = publicUrl;
          
          console.log("Cover image uploaded successfully:", thumbnailUrl);
        } catch (error) {
          console.error("Error uploading cover image:", error);
          toast({
            title: 'Cover Image Upload Failed',
            description: 'There was an error uploading your cover image. Please try again.',
            variant: 'destructive',
          });
          // Continue with course creation even if image upload fails
        }
      }
      
      // Upload course video if provided or store video URL
      let videoUrl = null;
      if (values.courseVideo) {
        const fileExt = values.courseVideo.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;
        
        try {
          const { error: uploadError } = await supabase.storage
            .from('course-videos')
            .upload(filePath, values.courseVideo, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Video upload error:', uploadError);
            throw new Error(`Video upload failed: ${uploadError.message}`);
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('course-videos')
            .getPublicUrl(filePath);
            
          videoUrl = publicUrl;
          
          console.log("Video uploaded successfully:", videoUrl);
        } catch (error) {
          console.error("Error uploading video:", error);
          toast({
            title: 'Video Upload Failed',
            description: 'There was an error uploading your video. Please try again.',
            variant: 'destructive',
          });
          // Continue with course creation even if video upload fails
        }
      }
      
      // Alternatively, if a video URL is provided directly (e.g., Google Drive link)
      if (values.videoUrl && !videoUrl) {
        videoUrl = values.videoUrl;
      }

      // Insert course into database
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: values.title,
          description: values.description,
          instructor_id: userId,
          category: values.category.toLowerCase(),
          level: values.level.toLowerCase(),
          price: parseFloat(values.price),
          duration: values.duration,
          thumbnail_url: thumbnailUrl,
          rating: 0,
          reviews: 0,
          is_student_created: true,
        })
        .select()
        .single();

      if (courseError) {
        console.error('Course creation error:', courseError);
        throw new Error(`Course creation failed: ${courseError.message}`);
      }
      
      // Add initial course content if video was uploaded
      if (videoUrl && course) {
        const { error: contentError } = await supabase
          .from('course_content')
          .insert({
            course_id: course.id,
            title: 'Introduction',
            content_type: 'video',
            content: 'Introduction to the course',
            video_url: videoUrl,
            duration: '10 minutes',
            order_index: 1
          });
          
        if (contentError) {
          console.error('Error adding course content:', contentError);
          toast({
            title: 'Warning',
            description: 'Course created but video content could not be added.',
            variant: 'default',
          });
        }
      }

      toast({
        title: 'Course created successfully',
        description: 'Your course has been published and is now available.',
        duration: 5000,
      });

      navigate('/instructor-dashboard');
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast({
        title: 'Error creating course',
        description: error.message || 'There was an error creating your course. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Image must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      form.setValue('coverImage', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Video must be less than 100MB',
          variant: 'destructive',
        });
        return;
      }
      
      form.setValue('courseVideo', file);
      setVideoFileName(file.name);
      
      toast({
        title: 'Video selected',
        description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`,
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Upload Your Course</h1>
          <p className="mt-2 text-gray-600">
            Share your knowledge with the world and start earning from your expertise
          </p>
        </div>
        
        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Introduction to Web Development" {...field} />
                        </FormControl>
                        <FormDescription>
                          Choose an engaging title that describes what students will learn.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what your course covers and what students will learn..." 
                            className="min-h-[150px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description that encourages students to enroll.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col space-y-1.5">
                    <FormLabel>Cover Image</FormLabel>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                      {coverImagePreview ? (
                        <div className="mb-4">
                          <img src={coverImagePreview} alt="Course preview" className="max-h-48 rounded" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Upload a cover image for your course</p>
                        </div>
                      )}
                      <Input 
                        id="courseImage" 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                      <label htmlFor="courseImage">
                        <Button type="button" variant="outline" className="mt-2">
                          {coverImagePreview ? 'Change Image' : 'Select Image'}
                        </Button>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <FormLabel>Course Video</FormLabel>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                      <div className="flex flex-col items-center justify-center py-4">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          {videoFileName ? `Selected: ${videoFileName}` : 'Upload your course intro video'}
                        </p>
                      </div>
                      <Input 
                        id="courseVideo" 
                        type="file" 
                        accept="video/mp4,video/webm,video/quicktime"
                        className="hidden" 
                        onChange={handleVideoChange}
                      />
                      <label htmlFor="courseVideo">
                        <Button type="button" variant="outline" className="mt-2">
                          {videoFileName ? 'Change Video' : 'Select Video'}
                        </Button>
                      </label>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://drive.google.com/file/d/..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Alternatively, provide a Google Drive or other video link.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-10"
                            {...field}
                          >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormDescription>
                          Select the category that best fits your course.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <FormControl>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-10"
                            {...field}
                          >
                            <option value="">Select Level</option>
                            {levels.map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormDescription>
                          Indicate the expertise level required for your course.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" placeholder="29.99" {...field} />
                        </FormControl>
                        <FormDescription>
                          Set a competitive price for your course. You'll earn 70% of the revenue.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 10 hours" {...field} />
                        </FormControl>
                        <FormDescription>
                          Specify the total duration of your course content.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-brand-50 p-4 rounded-lg border border-brand-100 mt-6">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-brand-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-brand-800">AI Enhancement</h4>
                        <p className="text-sm text-brand-700 mt-1">
                          Our AI tools will automatically generate transcripts, summaries, and quiz 
                          suggestions for your uploaded video content.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-brand-600 hover:bg-brand-700" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Course'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default CourseUpload;
