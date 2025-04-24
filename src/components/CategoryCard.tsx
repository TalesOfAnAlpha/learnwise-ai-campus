
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  courseCount: number;
  color: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  icon,
  courseCount,
  color,
}) => {
  return (
    <Link to={`/categories/${id}`}>
      <div className="rounded-xl border bg-white p-5 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-2">{name}</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <BookOpen className="h-4 w-4" />
              <span>{courseCount} courses</span>
            </div>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <img src={icon} alt={name} className="w-8 h-8" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
