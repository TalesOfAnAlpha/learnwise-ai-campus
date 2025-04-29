
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

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      
      if (!visible) {
        // Tab was hidden / user switched tabs
        setTabSwitchCount(prev => prev + 1);
        setLastSwitchTime(new Date());
        
        console.log('Tab switching detected!', {
          time: new Date().toISOString(),
          switchCount: tabSwitchCount + 1
        });
      }
      
      setIsVisible(visible);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Important: Create an interval that detects window focus changes
    const focusInterval = setInterval(() => {
      if (document.hasFocus() !== isVisible) {
        handleVisibilityChange();
      }
    }, 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(focusInterval);
    };
  }, [isVisible, tabSwitchCount]);

  return {
    isVisible,
    tabSwitchCount,
    lastSwitchTime
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
  const { isVisible, tabSwitchCount, lastSwitchTime } = useTabVisibility();
  
  // For exam progress
  const [currentQuestion, setCurrentQuestion] = useState(5);
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [progress, setProgress] = useState(25);

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
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [testStarted, timeRemaining]);

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
      // Enhanced detection logic with categorized warnings
      if (count === 0) {
        if (!warnings.includes("No face detected")) {
          setWarnings(prev => [...prev, "No face detected"]);
        }
      } else if (count > 1) {
        if (!warnings.includes("Multiple faces detected")) {
          setWarnings(prev => [...prev, "Multiple faces detected"]);
        }
      }
      
      // Randomly simulate other detection scenarios
      const detectionRandom = Math.random();
      if (detectionRandom < 0.1) {
        // 10% chance of simulated phone detection
        if (!warnings.includes("Phone detected")) {
          setWarnings(prev => [...prev, "Phone detected"]);
        }
      } else if (detectionRandom < 0.2) {
        // 10% chance of looking away detection
        if (!warnings.includes("Looking away from screen")) {
          setWarnings(prev => [...prev, "Looking away from screen"]);
        }
      } else if (detectionRandom < 0.3) {
        // 10% chance of audio warning
        if (!warnings.includes("Background conversation detected")) {
          setWarnings(prev => [...prev, "Background conversation detected"]);
        }
      }
    }
  };

  const requestCameraAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraEnabled(true);
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
        <Card>
          <CardHeader>
            <MonitoringHeader 
              testStarted={testStarted} 
              timeRemaining={timeRemaining} 
            />
          </CardHeader>
          <CardContent>
            {testStarted ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Webcam onFaceDetection={handleFaceDetection} />
                      <div className="absolute top-2 right-2">
                        <Badge variant={faceDetected ? "success" : "destructive"}>
                          {faceDetected ? `Face Detected (${faceCount})` : "No Face Detected"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <ExamProgress 
                      progress={progress} 
                      currentQuestion={currentQuestion} 
                      totalQuestions={totalQuestions} 
                    />
                    
                    <MonitoringStatus 
                      cameraEnabled={cameraEnabled}
                      micEnabled={micEnabled}
                      isVisible={isVisible}
                    />
                    
                    <DetectionWarnings 
                      warnings={warnings}
                      onDismissWarning={handleDismissWarning}
                    />
                  </div>
                </div>
                
                {tabSwitchCount > 0 && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Tab switching detected!</AlertTitle>
                    <AlertDescription>
                      You've switched tabs {tabSwitchCount} times. This may be flagged as suspicious activity.
                      {lastSwitchTime && ` Last switch at ${lastSwitchTime.toLocaleTimeString()}.`}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleEndTest} 
                    disabled={loading}
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
                  <h3 className="font-medium">Exam Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 border rounded-md">
                      <div className={`p-2 rounded-full ${cameraEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Camera className={`h-5 w-5 ${cameraEnabled ? 'text-green-600' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className="font-medium">Camera Access</p>
                        <p className="text-sm text-gray-500">Required for identity verification</p>
                      </div>
                      <Button 
                        variant={cameraEnabled ? "outline" : "default"} 
                        size="sm" 
                        className="ml-auto"
                        onClick={requestCameraAccess}
                        disabled={cameraEnabled}
                      >
                        {cameraEnabled ? 'Enabled' : 'Enable'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 border rounded-md">
                      <div className={`p-2 rounded-full ${micEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Mic className={`h-5 w-5 ${micEnabled ? 'text-green-600' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className="font-medium">Microphone Access</p>
                        <p className="text-sm text-gray-500">Required for audio monitoring</p>
                      </div>
                      <Button 
                        variant={micEnabled ? "outline" : "default"} 
                        size="sm" 
                        className="ml-auto"
                        onClick={requestMicAccess}
                        disabled={micEnabled}
                      >
                        {micEnabled ? 'Enabled' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Exam Rules</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>You must remain visible in the camera at all times</li>
                    <li>No other person should be visible in the frame</li>
                    <li>Do not switch to other tabs or applications</li>
                    <li>No talking or playing music in the background</li>
                    <li>Your face should be well-lit and clearly visible</li>
                  </ul>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleStartTest} 
                    disabled={!cameraEnabled || !micEnabled || loading}
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
