import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import { CourseFilters } from '../pages/Courses';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database';

type Course = Database['public']['Tables']['student_courses']['Row'];

interface CourseGridProps {
  filters: CourseFilters;
}

const CourseGrid: React.FC<CourseGridProps> = ({ filters }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const query = supabase
          .from('student_courses')
          .select('*');

        if (filters.category !== 'all') {
          query.eq('category', filters.category);
        }
        
        if (filters.level !== 'all') {
          query.eq('level', filters.level.toLowerCase());
        }

        if (filters.price[1] < 1000) {
          query.lte('price', filters.price[1]);
        }
        query.gte('price', filters.price[0]);

        if (filters.rating > 0) {
          query.gte('rating', filters.rating);
        }

        const { data, error } = await query;

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading courses...</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No courses match your filters. Try adjusting your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          id={course.id}
          title={course.title}
          instructor={course.instructor_id}
          image={course.thumbnail_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80'}
          category={course.category}
          rating={course.rating}
          reviews={course.reviews}
          price={course.price}
          duration={course.duration}
          level={course.level as 'Beginner' | 'Intermediate' | 'Advanced'}
        />
      ))}
    </div>
  );
};

export default CourseGrid;
