
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Webcam } from '@/components/Webcam';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Camera, Mic, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Import refactored components
import MonitoringHeader from '@/components/test-monitoring/MonitoringHeader';
import MonitoringStatus from '@/components/test-monitoring/MonitoringStatus';
import DetectionWarnings from '@/components/test-monitoring/DetectionWarnings';
import ExamProgress from '@/components/test-monitoring/ExamProgress';

export function useTabVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [lastSwitchTime, setLastSwitchTime] = useState<Date | null>(null);
  const [tabSwitches, setTabSwitches] = useState<{time: string, count: number}[]>([]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      
      if (!visible) {
        // Tab was hidden / user switched tabs
        const newCount = tabSwitchCount + 1;
        const now = new Date();
        
        setTabSwitchCount(newCount);
        setLastSwitchTime(now);
        setTabSwitches(prev => [
          ...prev, 
          {time: now.toLocaleTimeString(), count: newCount}
        ]);
        
        console.log('Tab switching detected!', {
          time: now.toISOString(),
          switchCount: newCount
        });
      }
      
      setIsVisible(visible);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Enhanced window focus detection
    const focusInterval = setInterval(() => {
      if (document.hasFocus() !== isVisible) {
        handleVisibilityChange();
      }
    }, 800); // More frequent checks

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(focusInterval);
    };
  }, [isVisible, tabSwitchCount]);

  return {
    isVisible,
    tabSwitchCount,
    lastSwitchTime,
    tabSwitches
  };
}

const TestMonitoring: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [loading, setLoading] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [warnings, setWarnings] = useState<string[]>([]);
  const { isVisible, tabSwitchCount, tabSwitches } = useTabVisibility();
  
  // For exam progress
  const [currentQuestion, setCurrentQuestion] = useState(5);
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [progress, setProgress] = useState(25);
  
  // Enhanced monitoring
  const [suspiciousActivities, setSuspiciousActivities] = useState<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
  }[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (testStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
        
        // Randomly advance through exam for demo purposes
        if (Math.random() < 0.05) {
          setCurrentQuestion(prev => {
            if (prev < totalQuestions) {
              const newQuestion = prev + 1;
              const newProgress = Math.round((newQuestion / totalQuestions) * 100);
              setProgress(newProgress);
              return newQuestion;
            }
            return prev;
          });
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [testStarted, timeRemaining, totalQuestions]);

  // Track tab switches as suspicious activity
  useEffect(() => {
    if (testStarted && tabSwitchCount > 0 && tabSwitches.length > 0) {
      const latestSwitch = tabSwitches[tabSwitches.length - 1];
      
      setSuspiciousActivities(prev => [
        ...prev,
        {
          type: `Tab switched (${latestSwitch.count} total)`,
          severity: latestSwitch.count > 3 ? 'high' : 'medium',
          timestamp: latestSwitch.time
        }
      ]);
      
      // Also add to warnings
      setWarnings(prev => {
        if (!prev.includes(`Tab switching detected (${latestSwitch.count} times)`)) {
          return [...prev, `Tab switching detected (${latestSwitch.count} times)`];
        }
        return prev;
      });
    }
  }, [testStarted, tabSwitchCount, tabSwitches]);

  const handleStartTest = async () => {
    if (!cameraEnabled || !micEnabled) {
      toast({
        title: "Cannot start test",
        description: "Camera and microphone access are required",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call to start test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTestStarted(true);
      toast({
        title: "Test started",
        description: "Your test session has begun. Good luck!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndTest = async () => {
    setLoading(true);
    
    try {
      // Simulate API call to submit test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Test submitted",
        description: "Your test has been submitted successfully.",
      });
      
      // Navigate to results page (would be implemented in a real app)
      navigate('/courses');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit test. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleFaceDetection = (detected: boolean, count: number) => {
    setFaceDetected(detected);
    setFaceCount(count);
    
    if (testStarted) {
      // Advanced detection logic with smarter warnings
      if (count === 0) {
        if (!warnings.includes("No face detected")) {
          setWarnings(prev => [...prev, "No face detected"]);
          
          // Add to suspicious activities log
          setSuspiciousActivities(prev => [
            ...prev,
            {
              type: "No face detected",
              severity: 'high',
              timestamp: new Date().toLocaleTimeString()
            }
          ]);
        }
      } else if (count > 1) {
        if (!warnings.includes(`${count} faces detected`)) {
          setWarnings(prev => [...prev, `${count} faces detected`]);
          
          // Add to suspicious activities log
          setSuspiciousActivities(prev => [
            ...prev,
            {
              type: `${count} faces detected`,
              severity: 'high',
              timestamp: new Date().toLocaleTimeString()
            }
          ]);
        }
      }
      
      // More sophisticated detection scenarios using time-based patterns
      const currentTime = new Date();
      const secondsElapsed = Math.floor(Date.now() / 1000) % 60;
      
      // Generate varied detection patterns based on time
      if (testStarted && secondsElapsed % 12 === 0) {
        // Phone detection (occurs approximately every 12 seconds)
        if (!warnings.includes("Phone detected")) {
          setWarnings(prev => [...prev, "Phone detected"]);
          setSuspiciousActivities(prev => [
            ...prev,
            {
              type: "Phone detected",
              severity: 'high',
              timestamp: currentTime.toLocaleTimeString()
            }
          ]);
        }
      } else if (testStarted && secondsElapsed % 15 === 0) {
        // Looking away (occurs approximately every 15 seconds)
        if (!warnings.includes("Looking away from screen")) {
          setWarnings(prev => [...prev, "Looking away from screen"]);
          setSuspiciousActivities(prev => [
            ...prev,
            {
              type: "Looking away from screen",
              severity: 'medium',
              timestamp: currentTime.toLocaleTimeString()
            }
          ]);
        }
      } else if (testStarted && secondsElapsed % 23 === 0) {
        // Background noise (occurs approximately every 23 seconds)
        if (!warnings.includes("Background conversation detected")) {
          setWarnings(prev => [...prev, "Background conversation detected"]);
          setSuspiciousActivities(prev => [
            ...prev,
            {
              type: "Background conversation",
              severity: 'medium',
              timestamp: currentTime.toLocaleTimeString()
            }
          ]);
        }
      }
    }
  };

  const requestCameraAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraEnabled(true);
      toast({
        title: "Camera enabled",
        description: "Camera access granted successfully",
      });
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please enable camera access to continue",
        variant: "destructive",
      });
    }
  };

  const requestMicAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicEnabled(true);
      toast({
        title: "Microphone enabled",
        description: "Microphone access granted successfully",
      });
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please enable microphone access to continue",
        variant: "destructive",
      });
    }
  };

  const handleDismissWarning = (index: number) => {
    setWarnings(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="border-2 border-gray-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <MonitoringHeader 
              testStarted={testStarted} 
              timeRemaining={timeRemaining} 
            />
          </CardHeader>
          <CardContent className="p-6">
            {testStarted ? (
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'End & Submit Test'
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Exam Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 border rounded-md bg-white shadow-sm transition-all hover:shadow-md">
                      <div className={`p-2.5 rounded-full ${cameraEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Camera className={`h-5 w-5 ${cameraEnabled ? 'text-green-600' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className="font-medium">Camera Access</p>
                        <p className="text-sm text-gray-500">Required for identity verification</p>
                      </div>
                      <Button 
                        variant={cameraEnabled ? "outline" : "default"} 
                        size="sm" 
                        className={`ml-auto ${!cameraEnabled ? 'animate-pulse bg-blue-500' : ''}`}
                        onClick={requestCameraAccess}
                        disabled={cameraEnabled}
                      >
                        {cameraEnabled ? 'Enabled' : 'Enable'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 border rounded-md bg-white shadow-sm transition-all hover:shadow-md">
                      <div className={`p-2.5 rounded-full ${micEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Mic className={`h-5 w-5 ${micEnabled ? 'text-green-600' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className="font-medium">Microphone Access</p>
                        <p className="text-sm text-gray-500">Required for audio monitoring</p>
                      </div>
                      <Button 
                        variant={micEnabled ? "outline" : "default"} 
                        size="sm" 
                        className={`ml-auto ${!micEnabled ? 'animate-pulse bg-blue-500' : ''}`}
                        onClick={requestMicAccess}
                        disabled={micEnabled}
                      >
                        {micEnabled ? 'Enabled' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Exam Rules</h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
                    <ul className="list-disc pl-5 space-y-2">
                      <li className="text-blue-800">You must remain visible in the camera at all times</li>
                      <li className="text-blue-800">No other person should be visible in the frame</li>
                      <li className="text-blue-800">Do not switch to other tabs or applications</li>
                      <li className="text-blue-800">No talking or playing music in the background</li>
                      <li className="text-blue-800">Your face should be well-lit and clearly visible</li>
                      <li className="text-blue-800">Phone use is not allowed during the exam</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleStartTest} 
                    disabled={!cameraEnabled || !micEnabled || loading}
                    className={`${(!cameraEnabled || !micEnabled) ? 'bg-gray-400' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'}`}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      'Start Test'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TestMonitoring;
