
import React, { useState } from 'react';
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
import { Upload, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

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
});

type FormValues = z.infer<typeof formSchema>;

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
];

const levels = ['Beginner', 'Intermediate', 'Advanced'];

const CourseUpload: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  
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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please log in to create a course.',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      let thumbnailUrl = null;
      if (values.coverImage) {
        const fileExt = values.coverImage.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('course-thumbnails')
          .upload(filePath, values.coverImage);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('course-thumbnails')
          .getPublicUrl(filePath);
          
        thumbnailUrl = publicUrl;
      }

      const { error: courseError } = await supabase
        .from('student_courses')
        .insert({
          title: values.title,
          description: values.description,
          instructor_id: user.id,
          category: values.category.toLowerCase(),
          level: values.level.toLowerCase(),
          price: parseFloat(values.price),
          duration: values.duration,
          thumbnail_url: thumbnailUrl,
          is_student_created: true,
        });

      if (courseError) throw courseError;

      toast({
        title: 'Course created successfully',
        description: 'Your course has been submitted for review.',
        duration: 5000,
      });

      navigate('/courses');
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: 'Error creating course',
        description: 'There was an error creating your course. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('coverImage', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                  Submit Course for Review
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
