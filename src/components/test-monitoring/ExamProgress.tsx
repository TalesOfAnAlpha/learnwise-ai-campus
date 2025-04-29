
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface ExamProgressProps {
  progress: number;
  currentQuestion: number;
  totalQuestions: number;
}

const ExamProgress: React.FC<ExamProgressProps> = ({
  progress,
  currentQuestion,
  totalQuestions
}) => {
  return (
    <div>
      <h3 className="font-medium mb-2">Exam Progress</h3>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between mt-1 text-sm text-gray-500">
        <span>Question {currentQuestion} of {totalQuestions}</span>
        <span>{progress}% Complete</span>
      </div>
    </div>
  );
};

export default ExamProgress;
