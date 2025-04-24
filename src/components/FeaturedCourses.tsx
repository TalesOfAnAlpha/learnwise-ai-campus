
import React from 'react';
import { Button } from '@/components/ui/button';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Sample course data
const featuredCourses = [
  {
    id: '1',
    title: 'Machine Learning Fundamentals with Python',
    instructor: 'Dr. Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    category: 'Data Science',
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
    image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    category: 'Web Development',
    rating: 4.7,
    reviews: 518,
    price: 69.99,
    duration: '24 hours',
    level: 'Advanced' as const,
  },
  {
    id: '3',
    title: 'Digital Marketing Masterclass: Complete Marketing Course',
    instructor: 'Jennifer Adams',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    category: 'Marketing',
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
    image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    category: 'Design',
    rating: 4.9,
    reviews: 412,
    price: 79.99,
    duration: '18 hours',
    level: 'Intermediate' as const,
  },
];

const FeaturedCourses: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
          <Link to="/courses">
            <Button variant="ghost" className="flex items-center gap-1 text-brand-600 hover:text-brand-700">
              View all courses
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
