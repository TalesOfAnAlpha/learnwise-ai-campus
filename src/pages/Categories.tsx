
import React from 'react';
import Layout from '../components/Layout';
import CategoryCard from '../components/CategoryCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

// Sample categories data (in a real app, this would come from an API)
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
  {
    id: '7',
    name: 'Artificial Intelligence',
    icon: 'https://cdn-icons-png.flaticon.com/512/2171/2171323.png',
    courseCount: 156,
    color: 'bg-indigo-50',
  },
  {
    id: '8',
    name: 'Cloud Computing',
    icon: 'https://cdn-icons-png.flaticon.com/512/957/957384.png',
    courseCount: 123,
    color: 'bg-cyan-50',
  },
  {
    id: '9',
    name: 'Game Development',
    icon: 'https://cdn-icons-png.flaticon.com/512/1067/1067357.png',
    courseCount: 89,
    color: 'bg-emerald-50',
  },
  {
    id: '10',
    name: 'Photography',
    icon: 'https://cdn-icons-png.flaticon.com/512/1042/1042339.png',
    courseCount: 112,
    color: 'bg-rose-50',
  },
  {
    id: '11',
    name: 'Music & Audio',
    icon: 'https://cdn-icons-png.flaticon.com/512/2995/2995101.png',
    courseCount: 97,
    color: 'bg-violet-50',
  },
  {
    id: '12',
    name: 'Personal Development',
    icon: 'https://cdn-icons-png.flaticon.com/512/3281/3281869.png',
    courseCount: 145,
    color: 'bg-amber-50',
  },
];

const Categories: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Categories</h1>
            <p className="mt-2 text-gray-600">Browse courses by their field of study</p>
          </div>
          <Link to="/courses">
            <Button className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700">
              <BookOpen className="h-4 w-4" />
              <span>View All Courses</span>
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
