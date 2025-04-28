
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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

// This is just a stub to help TypeScript resolve the import in the above component
// The actual import should come from react-router-dom in the CourseDetail.tsx file
const useNavigate = () => {
  return (path: string) => {};
};
