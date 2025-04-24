
import React from 'react';
import { Button } from '@/components/ui/button';
import CategoryCard from './CategoryCard';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Sample categories data
const categories = [
  {
    id: '1',
    name: 'Web Development',
    icon: 'https://cdn-icons-png.flaticon.com/512/1336/1336494.png',
    courseCount: 235,
    color: 'bg-blue-50',
  },
  {
    id: '2',
    name: 'Data Science',
    icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
    courseCount: 189,
    color: 'bg-green-50',
  },
  {
    id: '3',
    name: 'Mobile Development',
    icon: 'https://cdn-icons-png.flaticon.com/512/2586/2586488.png',
    courseCount: 156,
    color: 'bg-orange-50',
  },
  {
    id: '4',
    name: 'Cybersecurity',
    icon: 'https://cdn-icons-png.flaticon.com/512/2057/2057930.png',
    courseCount: 112,
    color: 'bg-red-50',
  },
  {
    id: '5',
    name: 'UX/UI Design',
    icon: 'https://cdn-icons-png.flaticon.com/512/2351/2351891.png',
    courseCount: 98,
    color: 'bg-purple-50',
  },
  {
    id: '6',
    name: 'Business & Marketing',
    icon: 'https://cdn-icons-png.flaticon.com/512/1968/1968641.png',
    courseCount: 175,
    color: 'bg-yellow-50',
  },
];

const PopularCategories: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Popular Categories</h2>
          <Link to="/categories">
            <Button variant="ghost" className="flex items-center gap-1 text-brand-600 hover:text-brand-700">
              All categories
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
