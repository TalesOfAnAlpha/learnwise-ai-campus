
import React from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DetectionWarningsProps {
  warnings: string[];
  onDismissWarning: (index: number) => void;
}

const DetectionWarnings: React.FC<DetectionWarningsProps> = ({
  warnings,
  onDismissWarning
}) => {
  if (warnings.length === 0) {
    return null;
  }

  const getWarningPriority = (warning: string): 'high' | 'medium' | 'low' => {
    const lowWarnings = ['Audio level changed', 'Background noise detected'];
    const mediumWarnings = ['Looking away', 'Background conversation', 'Tab switching detected'];
    const highWarnings = [
      'No face detected',
      'faces detected', // Matches "Multiple faces detected" or "2 faces detected"
      'Unknown person detected',
      'Phone detected'
    ];

    if (highWarnings.some(hw => warning.includes(hw))) {
      return 'high';
    } else if (mediumWarnings.some(mw => warning.includes(mw))) {
      return 'medium';
    } else {
      return 'low';
    }
  };

  const getWarningIcon = (priority: 'high' | 'medium' | 'low') => {
    switch(priority) {
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <Info className="h-4 w-4" />;
    }
  };

  const getWarningColor = (priority: 'high' | 'medium' | 'low') => {
    switch(priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  // Sort warnings by priority (high to low)
  const sortedWarnings = [...warnings].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[getWarningPriority(a)] - priorityOrder[getWarningPriority(b)];
  });

  return (
    <div>
      <h3 className="font-medium mb-3 text-red-600 flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        Warnings ({warnings.length})
      </h3>
      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
        {sortedWarnings.map((warning, index) => {
          const priority = getWarningPriority(warning);
          const colorClass = getWarningColor(priority);
          const icon = getWarningIcon(priority);
          const originalIndex = warnings.indexOf(warning);
          
          return (
            <div 
              key={index} 
              className={`flex items-center justify-between p-2 rounded-md border ${colorClass} ${priority === 'high' ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center gap-2">
                {icon}
                <div>
                  <span className="font-medium">{warning}</span>
                  <div className="text-xs opacity-75 mt-0.5">
                    {priority === 'high' 
                      ? 'Immediate action required' 
                      : priority === 'medium'
                        ? 'Please address this issue'
                        : 'Advisory warning'}
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-70 hover:opacity-100"
                onClick={() => onDismissWarning(originalIndex)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetectionWarnings;
