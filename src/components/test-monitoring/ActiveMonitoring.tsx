
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Camera } from 'lucide-react';

import { Webcam } from '@/components/Webcam';
import ExamProgress from '@/components/test-monitoring/ExamProgress';
import MonitoringStatus from '@/components/test-monitoring/MonitoringStatus';
import DetectionWarnings from '@/components/test-monitoring/DetectionWarnings';

interface ActivityLog {
  type: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

interface ActiveMonitoringProps {
  progress: number;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  cameraEnabled: boolean;
  micEnabled: boolean;
  isVisible: boolean;
  faceDetected: boolean;
  faceCount: number;
  handleFaceDetection: (detected: boolean, count: number) => void;
  handleEndTest: () => Promise<void>;
  loading: boolean;
  warnings: string[];
  handleDismissWarning: (index: number) => void;
  suspiciousActivities: ActivityLog[];
  tabSwitchCount: number;
  tabSwitches: {time: string, count: number}[];
}

const ActiveMonitoring: React.FC<ActiveMonitoringProps> = ({
  progress,
  currentQuestion,
  totalQuestions,
  timeRemaining,
  cameraEnabled,
  micEnabled,
  isVisible,
  faceDetected,
  faceCount,
  handleFaceDetection,
  handleEndTest,
  loading,
  warnings,
  handleDismissWarning,
  suspiciousActivities,
  tabSwitchCount,
  tabSwitches
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Camera className="h-4 w-4 text-blue-500" />
              <span>Exam Monitoring</span>
              <Badge variant={faceDetected ? "success" : "destructive"} className="ml-auto">
                {faceDetected ? `Face Detected (${faceCount})` : "No Face Detected"}
              </Badge>
            </h3>
            <div className="relative">
              <Webcam onFaceDetection={handleFaceDetection} />
            </div>

            {/* Suspicious Activities Log */}
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Activity Log</h4>
              <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-md p-2">
                {suspiciousActivities.length === 0 ? (
                  <p className="text-gray-400 text-xs text-center py-2">No suspicious activities detected</p>
                ) : (
                  <div className="space-y-1">
                    {suspiciousActivities.map((activity, index) => (
                      <div key={index} className={`text-xs px-2 py-1 rounded ${
                        activity.severity === 'high' ? 'bg-red-50 text-red-600' :
                        activity.severity === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        <div className="flex justify-between">
                          <span>{activity.type}</span>
                          <span className="opacity-70">{activity.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 space-y-5">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <ExamProgress 
              progress={progress} 
              currentQuestion={currentQuestion} 
              totalQuestions={totalQuestions}
              timeRemaining={timeRemaining} 
            />
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <MonitoringStatus 
              cameraEnabled={cameraEnabled}
              micEnabled={micEnabled}
              isVisible={isVisible}
            />
          </div>
          
          {warnings.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <DetectionWarnings 
                warnings={warnings}
                onDismissWarning={handleDismissWarning}
              />
            </div>
          )}
        </div>
      </div>
      
      {tabSwitchCount > 0 && (
        <Alert variant="destructive" className="mt-4 border-2 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Tab switching detected!</AlertTitle>
          <AlertDescription>
            You've switched tabs {tabSwitchCount} times. This activity is recorded and may be flagged for review.
            {tabSwitches.length > 0 && 
              ` Last switch at ${tabSwitches[tabSwitches.length - 1].time}.`
            }
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={handleEndTest} 
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          {loading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
              Submitting...
            </>
          ) : (
            'End & Submit Test'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ActiveMonitoring;
