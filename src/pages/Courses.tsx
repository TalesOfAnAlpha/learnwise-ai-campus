
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CourseFilters from '../components/CourseFilters';
import CourseGrid from '../components/CourseGrid';
import { BadgeCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface CourseFilters {
  category: string;
  level: string;
  price: [number, number];
  rating: number;
  aiRecommended: boolean;
}

const Courses: React.FC = () => {
  const [filters, setFilters] = useState<CourseFilters>({
    category: 'all',
    level: 'all',
    price: [0, 1000],
    rating: 0,
    aiRecommended: false,
  });
  
  const { user } = useAuth();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    averageProgress: 0,
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;

      try {
        // Get enrolled courses count
        const { count: enrolledCount, error: enrolledError } = await supabase
          .from('user_enrollments')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id);

        if (enrolledError) throw enrolledError;

        // Get completed courses count
        const { count: completedCount, error: completedError } = await supabase
          .from('user_enrollments')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('completed', true);

        if (completedError) throw completedError;

        // Get average progress
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('progress_percent')
          .eq('user_id', user.id);

        if (progressError) throw progressError;

        let avgProgress = 0;
        if (progressData && progressData.length > 0) {
          avgProgress = progressData.reduce((acc, curr) => acc + curr.progress_percent, 0) / progressData.length;
        }

        setStats({
          enrolledCourses: enrolledCount || 0,
          completedCourses: completedCount || 0,
          averageProgress: Math.round(avgProgress),
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserStats();
  }, [user]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
            <p className="mt-2 text-gray-600">Expand your knowledge with our curated courses</p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <BadgeCheck className="h-5 w-5" />
            <span className="text-sm font-medium">AI-Enhanced Learning</span>
          </div>
        </div>

        {user && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Your Progress</span>
                    <span className="text-sm text-gray-500">{stats.averageProgress}% Complete</span>
                  </div>
                  <Progress value={stats.averageProgress} className="h-2" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center">
                    <span className="text-brand-600 font-semibold">{stats.enrolledCourses}</span>
                  </div>
                  <div>
                    <p className="font-medium">Enrolled Courses</p>
                    <p className="text-sm text-gray-500">Courses you're taking</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-semibold">{stats.completedCourses}</span>
                  </div>
                  <div>
                    <p className="font-medium">Completed Courses</p>
                    <p className="text-sm text-gray-500">Courses you've finished</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <CourseFilters filters={filters} onFilterChange={setFilters} />
          </aside>
          <main className="flex-1">
            <CourseGrid filters={filters} />
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Courses;
