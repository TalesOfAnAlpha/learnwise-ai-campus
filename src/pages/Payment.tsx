
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CreditCard, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Payment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const courseId = searchParams.get('course_id');
  const amount = searchParams.get('amount');
  const enrollmentId = searchParams.get('enrollment_id');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!courseId || !enrollmentId) {
      navigate('/courses');
      return;
    }

    const fetchCourse = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (error) throw error;
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
        toast({
          title: 'Error',
          description: 'Could not load course details',
          variant: 'destructive',
        });
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, enrollmentId, user, navigate, toast]);

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentSuccess(true);
      toast({
        title: 'Payment Successful',
        description: 'You have successfully enrolled in the course.',
      });
      
      // In a real implementation, you would process the payment here
      // and update the enrollment record in the database
      
      setProcessing(false);
    }, 2000);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Payment</CardTitle>
            <CardDescription>
              You're enrolling in the course: {course?.title}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {paymentSuccess ? (
              <div className="flex flex-col items-center py-6">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-6">
                  You have successfully enrolled in "{course?.title}".
                </p>
                <Button onClick={() => navigate(`/courses/${courseId}`)}>
                  Go to Course
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                  <span>Course Fee</span>
                  <span className="font-semibold">${amount}</span>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Payment Method</h3>
                  <div className="flex items-center gap-3 p-3 border rounded-md bg-gray-50">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    <span>Credit/Debit Card</span>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    <p>This is a demo payment page. In a real application, you would integrate with Stripe or another payment processor.</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          {!paymentSuccess && (
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handlePayment} 
                disabled={processing}
                className="w-full sm:w-auto"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${amount}`
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Payment;
