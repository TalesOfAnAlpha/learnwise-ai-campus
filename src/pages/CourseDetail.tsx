import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Layout from '../components/Layout';
import { Loader2, Play, BookOpen, Clock, Star, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface CourseContent {
  id: string;
  title: string;
  content_type: string;
  content: string;
  video_url: string | null;
  duration: string | null;
  order_index: number;
}

interface CourseDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  duration: string;
  thumbnail_url: string | null;
  rating: number;
  reviews: number;
  instructor_id: string;
  instructor_name?: string;
  content: CourseContent[];
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeContentId, setActiveContentId] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();
        
        if (courseError) throw courseError;
        if (!courseData) throw new Error('Course not found');
        
        // Fetch instructor name
        let instructorName = 'Instructor';
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', courseData.instructor_id)
          .maybeSingle();
        
        if (profileData && (profileData.first_name || profileData.last_name)) {
          instructorName = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
        }
        
        // Fetch course content
        const { data: contentData, error: contentError } = await supabase
          .from('course_content')
          .select('*')
          .eq('course_id', id)
          .order('order_index', { ascending: true });
        
        if (contentError) throw contentError;
        
        // Combine data
        const fullCourseData: CourseDetails = {
          ...courseData,
          instructor_name: instructorName,
          content: contentData || []
        };
        
        setCourse(fullCourseData);
        
        // Set first content item as active if available
        if (contentData && contentData.length > 0) {
          setActiveContentId(contentData[0].id);
        }
        
        // Check if user is enrolled
        if (user) {
          const { data: enrollmentData } = await supabase
            .from('user_enrollments')
            .select('*')
            .eq('user_id', user.id)
            .eq('course_id', id)
            .maybeSingle();
          
          setIsEnrolled(!!enrollmentData);
        }
      } catch (error: any) {
        console.error('Error fetching course details:', error);
        toast({
          title: 'Error loading course',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [id, toast, user]);
  
  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to enroll in courses',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setEnrolling(true);
      
      // Create enrollment record
      const { error } = await supabase
        .from('user_enrollments')
        .insert({
          user_id: user.id,
          course_id: id as string,
          completed: false
        });
      
      if (error) throw error;
      
      // Create instructor earnings record
      await supabase
        .from('instructor_earnings')
        .insert({
          instructor_id: course?.instructor_id as string,
          course_id: id as string,
          amount: course?.price as number,
          transaction_type: 'sale',
          description: `Enrollment in ${course?.title}`
        });
      
      setIsEnrolled(true);
      toast({
        title: 'Enrolled successfully',
        description: 'You have successfully enrolled in this course'
      });
    } catch (error: any) {
      console.error('Error enrolling in course:', error);
      toast({
        title: 'Enrollment failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setEnrolling(false);
    }
  };
  
  const getActiveContent = () => {
    if (!course || !activeContentId) return null;
    return course.content.find(item => item.id === activeContentId);
  };
  
  const activeContent = getActiveContent();
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
        </div>
      </Layout>
    );
  }
  
  if (!course) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-gray-600">The course you are looking for does not exist or has been removed.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Course Info - Left Column */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>
            
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Badge variant="outline" className="bg-gray-100">
                {course.category}
              </Badge>
              <Badge variant="outline" className="bg-gray-100">
                {course.level}
              </Badge>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{course.rating}</span>
                <span className="text-gray-500">({course.reviews} reviews)</span>
              </div>
            </div>
            
            <div className="aspect-video rounded-lg overflow-hidden mb-8 bg-gray-200">
              {activeContent?.video_url ? (
                <video 
                  controls
                  className="w-full h-full object-cover"
                  src={activeContent.video_url}
                  poster={course.thumbnail_url || undefined}
                >
                  Your browser does not support the video tag.
                </video>
              ) : course.thumbnail_url ? (
                <div className="relative w-full h-full">
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="p-4 bg-white bg-opacity-90 rounded-full">
                      <Play className="h-10 w-10 text-brand-600" />
                    </div>
                    <p className="absolute bottom-10 text-white font-medium">Preview not available</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-3">About This Course</h2>
              <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Course Content</h2>
              
              <div className="space-y-3">
                {course.content.length === 0 ? (
                  <p className="text-gray-500 italic">No content available for this course yet.</p>
                ) : (
                  course.content.map((item) => (
                    <Card 
                      key={item.id} 
                      className={`cursor-pointer hover:border-brand-200 transition-colors ${
                        activeContentId === item.id ? 'border-brand-500' : ''
                      }`}
                      onClick={() => isEnrolled ? setActiveContentId(item.id) : null}
                    >
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          {isEnrolled ? (
                            <Play className="h-5 w-5 mr-3 text-brand-600" />
                          ) : (
                            <Lock className="h-5 w-5 mr-3 text-gray-400" />
                          )}
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.content_type} • {item.duration || 'N/A'}</p>
                          </div>
                        </div>
                        {activeContentId === item.id && <CheckCircle className="h-5 w-5 text-brand-600" />}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Course Action Card - Right Column */}
          <div>
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-3xl font-bold mb-4">
                  ${course.price.toFixed(2)}
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-3" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-500 mr-3" />
                    <span>{course.content.length} lessons</span>
                  </div>
                </div>

                {isEnrolled ? (
                  <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Enrolled
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-brand-600 hover:bg-brand-700" 
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Enroll Now'
                    )}
                  </Button>
                )}
                
                <p className="text-sm text-center text-gray-500 mt-3">
                  30-day money-back guarantee
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetail;
