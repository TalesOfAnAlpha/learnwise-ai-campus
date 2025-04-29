
import React from 'react';
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Clock } from 'lucide-react';

interface MonitoringHeaderProps {
  testStarted: boolean;
  timeRemaining: number;
}

const MonitoringHeader: React.FC<MonitoringHeaderProps> = ({
  testStarted,
  timeRemaining
}) => {
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle>Exam Monitoring System</CardTitle>
        <CardDescription>
          {testStarted 
            ? "Your exam is in progress. Please remain visible in the camera."
            : "Complete the setup to begin your exam"}
        </CardDescription>
      </div>
      {testStarted && (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
        </div>
      )}
    </div>
  );
};

export default MonitoringHeader;
