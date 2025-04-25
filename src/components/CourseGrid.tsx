
import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import { CourseFilters } from '../pages/Courses';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database';
import { useToast } from "@/hooks/use-toast";

// Use sample course data since the database table doesn't exist yet
const sampleCourses = [
  {
    id: '1',
    title: 'Machine Learning Fundamentals with Python',
    instructor_id: 'Dr. Sarah Johnson',
    thumbnail_url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    category: 'Data Science',
    rating: 4.8,
    reviews: 342,
    price: 59.99,
    duration: '12 hours',
    level: 'Intermediate',
  },
  {
    id: '2',
    title: 'Full-Stack Web Development with React and Node.js',
    instructor_id: 'Mark Wilson',
    thumbnail_url: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    category: 'Web Development',
    rating: 4.7,
    reviews: 518,
    price: 69.99,
    duration: '24 hours',
    level: 'Advanced',
  },
  {
    id: '3',
    title: 'Digital Marketing Masterclass: Complete Marketing Course',
    instructor_id: 'Jennifer Adams',
    thumbnail_url: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    category: 'Marketing',
    rating: 4.5,
    reviews: 275,
    price: 49.99,
    duration: '15 hours',
    level: 'Beginner',
  },
  {
    id: '4',
    title: 'UI/UX Design: Create Modern Web Experiences',
    instructor_id: 'David Chen',
    thumbnail_url: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    category: 'Design',
    rating: 4.9,
    reviews: 412,
    price: 79.99,
    duration: '18 hours',
    level: 'Intermediate',
  },
];

interface CourseGridProps {
  filters: CourseFilters;
}

const CourseGrid: React.FC<CourseGridProps> = ({ filters }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
        // Filter the sample courses based on the filters
        let filteredCourses = [...sampleCourses];
        
        if (filters.category !== 'all') {
          filteredCourses = filteredCourses.filter(
            course => course.category.toLowerCase() === filters.category.toLowerCase()
          );
        }
        
        if (filters.level !== 'all') {
          filteredCourses = filteredCourses.filter(
            course => course.level.toLowerCase() === filters.level.toLowerCase()
          );
        }
        
        if (filters.price[1] < 1000) {
          filteredCourses = filteredCourses.filter(
            course => course.price <= filters.price[1]
          );
        }
        
        filteredCourses = filteredCourses.filter(
          course => course.price >= filters.price[0]
        );
        
        if (filters.rating > 0) {
          filteredCourses = filteredCourses.filter(
            course => course.rating >= filters.rating
          );
        }
        
        setCourses(filteredCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error fetching courses",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters, toast]);

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
