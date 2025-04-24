
import React from 'react';
import CourseCard from './CourseCard';
import { CourseFilters } from '../pages/Courses';

// Sample course data - in a real app, this would come from an API
const allCourses = [
  {
    id: '1',
    title: 'Machine Learning Fundamentals with Python',
    instructor: 'Dr. Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
    category: 'data science',
    rating: 4.8,
    reviews: 342,
    price: 59.99,
    duration: '12 hours',
    level: 'Intermediate' as const,
    aiRecommended: true,
  },
  {
    id: '2',
    title: 'Full-Stack Web Development with React and Node.js',
    instructor: 'Mark Wilson',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    category: 'web development',
    rating: 4.7,
    reviews: 518,
    price: 69.99,
    duration: '24 hours',
    level: 'Advanced' as const,
  },
  {
    id: '3',
    title: 'Digital Marketing Masterclass',
    instructor: 'Jennifer Adams',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    category: 'business & marketing',
    rating: 4.5,
    reviews: 275,
    price: 49.99,
    duration: '15 hours',
    level: 'Beginner' as const,
    aiRecommended: true,
  },
  {
    id: '4',
    title: 'UI/UX Design: Create Modern Web Experiences',
    instructor: 'David Chen',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80',
    category: 'ux/ui design',
    rating: 4.9,
    reviews: 412,
    price: 79.99,
    duration: '18 hours',
    level: 'Intermediate' as const,
  },
  // Add more courses as needed
];

interface CourseGridProps {
  filters: CourseFilters;
}

const CourseGrid: React.FC<CourseGridProps> = ({ filters }) => {
  const filteredCourses = allCourses.filter((course) => {
    if (filters.category !== 'all' && course.category !== filters.category) return false;
    if (filters.level !== 'all' && course.level.toLowerCase() !== filters.level) return false;
    if (course.price < filters.price[0] || course.price > filters.price[1]) return false;
    if (course.rating < filters.rating) return false;
    if (filters.aiRecommended && !course.aiRecommended) return false;
    return true;
  });

  if (filteredCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No courses match your filters. Try adjusting your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCourses.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </div>
  );
};

export default CourseGrid;
