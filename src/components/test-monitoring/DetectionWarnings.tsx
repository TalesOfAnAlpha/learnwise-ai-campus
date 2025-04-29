
import React from 'react';
import { AlertCircle, X } from 'lucide-react';
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
    const mediumWarnings = ['Looking away', 'Background conversation detected'];
    const highWarnings = [
      'No face detected',
      'Multiple faces detected',
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

  const getWarningColor = (priority: 'high' | 'medium' | 'low') => {
    switch(priority) {
      case 'high': return 'bg-red-50 text-red-600';
      case 'medium': return 'bg-yellow-50 text-yellow-600';
      case 'low': return 'bg-blue-50 text-blue-600';
    }
  };

  return (
    <div>
      <h3 className="font-medium mb-2 text-red-600">Warnings</h3>
      <div className="space-y-2">
        {warnings.map((warning, index) => {
          const priority = getWarningPriority(warning);
          const colorClass = getWarningColor(priority);
          
          return (
            <div key={index} className={`flex items-center justify-between p-2 rounded-md ${colorClass}`}>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{warning} <span className="text-xs opacity-75">({priority} priority)</span></span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDismissWarning(index)}
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
