
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Clock } from 'lucide-react';

interface ExamProgressProps {
  progress: number;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining?: number;
}

const ExamProgress: React.FC<ExamProgressProps> = ({
  progress,
  currentQuestion,
  totalQuestions,
  timeRemaining
}) => {
  const formatTime = (seconds?: number) => {
    if (!seconds) return "00:00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Exam Progress</h3>
        {timeRemaining !== undefined && (
          <div className="flex items-center gap-2 text-amber-600 font-medium">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{formatTime(timeRemaining)}</span>
          </div>
        )}
      </div>
      
      <Progress value={progress} className="h-3 bg-gray-100" />
      
      <div className="flex justify-between mt-1 text-sm">
        <span className="font-medium">Question {currentQuestion} of {totalQuestions}</span>
        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
          {progress}% Complete
        </span>
      </div>
    </div>
  );
};

export default ExamProgress;
