
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, BookOpen, Clock, BarChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed: boolean;
  last_accessed_at: string;
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string | null;
    level: string;
    duration: string;
  };
  progress: number;
}

const EmptyEnrollments = () => (
  <div className="text-center py-12">
    <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
    <h3 className="text-lg font-medium text-gray-900 mb-1">No courses yet</h3>
    <p className="text-gray-500 mb-6">You haven't enrolled in any courses yet</p>
    <Button className="bg-brand-600 hover:bg-brand-700" asChild>
      <Link to="/courses">Browse Courses</Link>
    </Button>
  </div>
);

const EnrolledCourses: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('user_enrollments')
          .select(`
            id,
            user_id,
            course_id,
            enrolled_at,
            completed,
            last_accessed_at,
            course:courses(
              id,
              title,
              description,
              thumbnail_url,
              level,
              duration
            )
          `)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Fetch progress for each enrollment
        const enrollmentsWithProgress = await Promise.all(
          (data || []).map(async (enrollment) => {
            try {
              // Get total content items for the course
              const { count: totalContent } = await supabase
                .from('course_content')
                .select('id', { count: 'exact' })
                .eq('course_id', enrollment.course_id);
              
              // Get completed content items for the user
              const { count: completedContent } = await supabase
                .from('user_progress')
                .select('id', { count: 'exact' })
                .eq('user_id', user.id)
                .eq('course_id', enrollment.course_id)
                .eq('completed', true);
              
              const progress = totalContent && totalContent > 0
                ? Math.round((completedContent || 0) / totalContent * 100)
                : 0;
              
              return {
                ...enrollment,
                progress,
              };
            } catch (e) {
              console.error('Error fetching progress:', e);
              return {
                ...enrollment,
                progress: 0,
              };
            }
          })
        );
        
        setEnrollments(enrollmentsWithProgress);
      } catch (error: any) {
        toast({
          title: 'Error fetching enrolled courses',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEnrollments();
  }, [user, toast]);
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </CardContent>
      </Card>
    );
  }
  
  if (enrollments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyEnrollments />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Courses ({enrollments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="border rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48">
                  <img
                    src={enrollment.course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'}
                    alt={enrollment.course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-5 md:w-2/3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{enrollment.course.title}</h3>
                    <Badge variant={enrollment.completed ? 'default' : 'outline'}>
                      {enrollment.completed ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {enrollment.course.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {enrollment.course.duration}
                      </div>
                      
                      <div className="flex items-center text-gray-500 text-sm">
                        <BarChart className="h-4 w-4 mr-1" />
                        {enrollment.course.level}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-medium">{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/courses/${enrollment.course_id}`}>View Course</Link>
                      </Button>
                      
                      <Button className="bg-brand-600 hover:bg-brand-700" size="sm" asChild>
                        <Link to={`/courses/${enrollment.course_id}/learn`}>
                          {enrollment.progress === 0 ? 'Start Learning' : 'Continue Learning'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnrolledCourses;
