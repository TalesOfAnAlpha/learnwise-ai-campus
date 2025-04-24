
import React, { useState } from 'react';
import Layout from '../components/Layout';
import CourseFilters from '../components/CourseFilters';
import CourseGrid from '../components/CourseGrid';
import { BadgeCheck } from 'lucide-react';

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
