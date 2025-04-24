
import React from 'react';
import { CourseFilters as FilterType } from '../pages/Courses';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

const categories = [
  'All Categories',
  'Web Development',
  'Data Science',
  'Mobile Development',
  'Cybersecurity',
  'UX/UI Design',
  'Business & Marketing',
];

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

interface CourseFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-2">Category</Label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {categories.map((category) => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Level</Label>
            <select
              value={filters.level}
              onChange={(e) => onFilterChange({ ...filters, level: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {levels.map((level) => (
                <option key={level} value={level.toLowerCase()}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Price Range</Label>
            <Slider
              min={0}
              max={1000}
              step={10}
              value={[filters.price[0]]}
              onValueChange={(value) => onFilterChange({ ...filters, price: [value[0], filters.price[1]] })}
              className="mt-2"
            />
            <div className="mt-1 text-sm text-gray-500">
              ${filters.price[0]} - ${filters.price[1]}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Minimum Rating</Label>
            <Slider
              min={0}
              max={5}
              step={0.5}
              value={[filters.rating]}
              onValueChange={(value) => onFilterChange({ ...filters, rating: value[0] })}
              className="mt-2"
            />
            <div className="mt-1 text-sm text-gray-500">{filters.rating} stars</div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">AI Recommended</Label>
            <Switch
              checked={filters.aiRecommended}
              onCheckedChange={(checked) => onFilterChange({ ...filters, aiRecommended: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseFilters;
