
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CourseProgressProps {
  progress: number;
  lastAccessed?: string;
  estimatedCompletion?: string;
  timeSpent?: string;
}

const CourseProgress: React.FC<CourseProgressProps> = ({
  progress,
  lastAccessed,
  estimatedCompletion,
  timeSpent,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Course Completion</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {lastAccessed && (
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600 mb-2" />
                <span className="text-xs text-gray-500">Last Accessed</span>
                <span className="text-sm font-medium text-center">
                  {formatDistanceToNow(new Date(lastAccessed), { addSuffix: true })}
                </span>
              </div>
            )}
            
            {estimatedCompletion && (
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-gray-600 mb-2" />
                <span className="text-xs text-gray-500">Est. Completion</span>
                <span className="text-sm font-medium">{estimatedCompletion}</span>
              </div>
            )}
            
            {timeSpent && (
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600 mb-2" />
                <span className="text-xs text-gray-500">Time Spent</span>
                <span className="text-sm font-medium">{timeSpent}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseProgress;
