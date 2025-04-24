
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Award } from 'lucide-react';

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  price: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  aiRecommended?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  instructor,
  image,
  category,
  rating,
  reviews,
  price,
  duration,
  level,
  aiRecommended = false,
}) => {
  return (
    <Link to={`/courses/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 hover-card-gradient">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
          />
          <Badge variant="outline" className="absolute top-3 left-3 bg-white/90">
            {category}
          </Badge>
          {aiRecommended && (
            <div className="absolute top-3 right-3 bg-brand-600 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
              <Award className="h-3 w-3" />
              <span>AI Recommended</span>
            </div>
          )}
        </div>
        <CardContent className="pt-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-2">by {instructor}</p>
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">({reviews} reviews)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
            <Badge variant={level === 'Beginner' ? 'outline' : level === 'Intermediate' ? 'secondary' : 'default'}>
              {level}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <div className="text-brand-600 font-semibold">${price.toFixed(2)}</div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;
