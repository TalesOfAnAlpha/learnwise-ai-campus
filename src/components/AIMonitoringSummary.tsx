
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AIMonitoringSummaryProps {
  detections: string[];
  isActive: boolean;
}

const AIMonitoringSummary: React.FC<AIMonitoringSummaryProps> = ({
  detections,
  isActive
}) => {
  const formattedDetections = useMemo(() => {
    return detections.map((detection, index) => {
      const time = new Date().toLocaleTimeString();
      return {
        id: `${index}-${time}`,
        message: detection,
        time: time
      };
    });
  }, [detections]);

  const severityCount = useMemo(() => {
    return {
      high: formattedDetections.filter(d => 
        d.message.includes("Multiple faces") || 
        d.message.includes("Person left") ||
        d.message.includes("Phone detected") ||
        d.message.includes("Unknown person")
      ).length,
      medium: formattedDetections.filter(d => 
        d.message.includes("Looking away") || 
        d.message.includes("Background conversation") ||
        d.message.includes("Multiple speakers")
      ).length,
      low: formattedDetections.filter(d => 
        d.message.includes("Background noise") ||
        d.message.includes("access error")
      ).length
    };
  }, [formattedDetections]);

  const getSeverityClass = (message: string) => {
    if (
      message.includes("Multiple faces") || 
      message.includes("Person left") ||
      message.includes("Phone detected") ||
      message.includes("Unknown person")
    ) {
      return "bg-red-100 text-red-800 border-red-200";
    } else if (
      message.includes("Looking away") || 
      message.includes("Background conversation") ||
      message.includes("Multiple speakers")
    ) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    } else {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">AI Monitoring Summary</CardTitle>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Status: {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Badge variant="outline" className="bg-red-50 text-red-700">
            High: {severityCount.high}
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            Medium: {severityCount.medium}
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Low: {severityCount.low}
          </Badge>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {formattedDetections.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              {isActive 
                ? "No suspicious activities detected yet" 
                : "Start monitoring to detect activities"}
            </div>
          ) : (
            formattedDetections.map((detection) => (
              <div 
                key={detection.id}
                className={`p-3 border rounded-md text-sm ${getSeverityClass(detection.message)}`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{detection.message}</span>
                  <span className="text-xs opacity-70">{detection.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-500 justify-center">
        AI-powered analysis helps ensure test integrity
      </CardFooter>
    </Card>
  );
};

export default AIMonitoringSummary;
