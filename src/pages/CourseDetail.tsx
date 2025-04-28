
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Define a function to handle course enrollment with payment
export const handleEnrollCourse = async (courseId: string, price: number, userId: string | undefined, navigate: any) => {
  if (!userId) {
    // Redirect to login if not authenticated
    navigate('/auth?redirect=' + encodeURIComponent(`/courses/${courseId}`));
    return { success: false, error: 'Authentication required' };
  }
  
  try {
    // First, check if user is already enrolled
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('user_enrollments')
      .select()
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingEnrollment) {
      return { 
        success: true, 
        message: 'Already enrolled', 
        redirectToPayment: false
      };
    }

    // Create enrollment record
    const { data, error } = await supabase
      .from('user_enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        completed: false
      })
      .select()
      .single();

    if (error) throw error;
    
    // For free courses, don't redirect to payment
    if (price <= 0) {
      return { 
        success: true, 
        message: 'Successfully enrolled in free course', 
        redirectToPayment: false 
      };
    }

    // For paid courses, redirect to payment
    // Set up simplified payment URL (in real app, this would be a Stripe checkout URL)
    const paymentUrl = `/payment?course_id=${courseId}&amount=${price}&enrollment_id=${data.id}`;
    
    return { 
      success: true, 
      message: 'Redirecting to payment...', 
      redirectToPayment: true, 
      paymentUrl 
    };
  } catch (error: any) {
    console.error('Error enrolling in course:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to enroll in course'
    };
  }
};

// Add this to your existing CourseDetail component
export const EnrollButton = ({ 
  course, 
  isEnrolled, 
  isLoading, 
  setIsLoading 
}: { 
  course: any, 
  isEnrolled: boolean, 
  isLoading: boolean, 
  setIsLoading: (value: boolean) => void 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEnroll = async () => {
    if (!course) return;
    
    setIsLoading(true);
    
    const result = await handleEnrollCourse(course.id, course.price, user?.id, navigate);
    
    if (result.success) {
      toast({
        title: 'Success',
        description: result.message,
      });
      
      if (result.redirectToPayment && result.paymentUrl) {
        navigate(result.paymentUrl);
      }
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Button
      size="lg"
      onClick={handleEnroll}
      disabled={isEnrolled || isLoading}
      className={isEnrolled ? "bg-green-600 hover:bg-green-700" : ""}
    >
      {isEnrolled ? 'Already Enrolled' : `Enroll Now - ${course?.price ? `$${course.price}` : 'Free'}`}
    </Button>
  );
};

// Define the main CourseDetail component
const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrollingLoading, setIsEnrollingLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!id) return;
      
      try {
        // Fetch course details
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setCourse(data);
        
        // Check if user is enrolled
        if (user) {
          const { data: enrollmentData, error: enrollmentError } = await supabase
            .from('user_enrollments')
            .select()
            .eq('user_id', user.id)
            .eq('course_id', id)
            .single();
            
          if (!enrollmentError) {
            setIsEnrolled(true);
          }
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [id, user]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{course.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-gray-600">{course.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div>
                  <h3 className="font-medium">Instructor</h3>
                  <p className="text-gray-600">{course.instructor_name || 'Unknown Instructor'}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Price</h3>
                  <p className="text-gray-600">{course.price ? `$${course.price}` : 'Free'}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Duration</h3>
                  <p className="text-gray-600">{course.duration || 'Not specified'}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Category</h3>
                  <p className="text-gray-600">{course.category || 'Uncategorized'}</p>
                </div>
              </div>
              
              <div className="pt-4">
                <EnrollButton 
                  course={course} 
                  isEnrolled={isEnrolled}
                  isLoading={isEnrollingLoading}
                  setIsLoading={setIsEnrollingLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CourseDetail;
