
import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import { CourseFilters } from '../pages/Courses';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  instructor_id: string;
  thumbnail_url: string | null;
  category: string;
  rating: number;
  reviews: number;
  price: number;
  duration: string;
  level: string;
}

interface CourseGridProps {
  filters: CourseFilters;
  searchQuery?: string;
}

const CourseGrid: React.FC<CourseGridProps> = ({ filters, searchQuery = '' }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
        // Start building the query
        let query = supabase
          .from('courses')
          .select('*');
        
        // Apply search query if provided
        if (searchQuery && searchQuery.trim() !== '') {
          query = query.ilike('title', `%${searchQuery}%`);
        }
        
        // Apply filters
        if (filters.category !== 'all') {
          query = query.ilike('category', `%${filters.category}%`);
        }
        
        if (filters.level !== 'all') {
          query = query.eq('level', filters.level.toLowerCase());
        }
        
        if (filters.price[1] < 1000) {
          query = query.lte('price', filters.price[1]);
        }
        
        query = query.gte('price', filters.price[0]);
        
        if (filters.rating > 0) {
          query = query.gte('rating', filters.rating);
        }
        
        // If AI recommended is enabled, filter for featured courses (assuming these are AI-recommended)
        if (filters.aiRecommended) {
          // In a real app, this might use a 'featured' or 'ai_recommended' column
          query = query.gte('rating', 4.7);
        }
        
        // Execute the query
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          // If no courses match filters, fall back to demo courses
          await fetchDemoCourses();
        }
      } catch (error: any) {
        console.error('Error fetching courses:', error);
        
        // Fallback to demo courses if there's an error
        await fetchDemoCourses();
      } finally {
        setLoading(false);
      }
    };

    const fetchDemoCourses = async () => {
      try {
        // Try to get demo courses from the demo_courses table
        const { data, error } = await supabase
          .from('demo_courses')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          // If no demo courses, use hardcoded samples
          useSampleCourses();
        }
      } catch (error) {
        console.error('Error fetching demo courses:', error);
        // Fall back to sample data
        useSampleCourses();
      }
    };

    const useSampleCourses = () => {
      toast({
        title: "Using sample course data",
        description: "Connecting to database failed. Using sample data instead.",
      });
      
      // Use the sample courses as fallback
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
      
      // Apply the same filters to sample data
      let filteredCourses = [...sampleCourses];
      
      if (filters.category !== 'all') {
        filteredCourses = filteredCourses.filter(
          course => course.category.toLowerCase().includes(filters.category.toLowerCase())
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
    };

    fetchCourses();
  }, [filters, searchQuery, toast]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 mx-auto animate-spin text-brand-600" />
        <p className="text-gray-500 mt-2">Loading courses...</p>
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
        <Link to={`/courses/${course.id}`} key={course.id}>
          <CourseCard
            id={course.id}
            title={course.title}
            instructor={typeof course.instructor_id === 'string' && !course.instructor_id.includes('-') 
              ? course.instructor_id 
              : 'Instructor'}
            image={course.thumbnail_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80'}
            category={course.category}
            rating={course.rating}
            reviews={course.reviews}
            price={course.price}
            duration={course.duration}
            level={course.level as 'Beginner' | 'Intermediate' | 'Advanced'}
            aiRecommended={course.rating >= 4.7}
          />
        </Link>
      ))}
    </div>
  );
};

export default CourseGrid;
