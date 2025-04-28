import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Webcam } from '@/components/Webcam';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Camera, Clock, Eye, Loader2, Mic, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
      if (count === 0) {
        if (!warnings.includes("No face detected")) {
          setWarnings(prev => [...prev, "No face detected"]);
        }
      } else if (count > 1) {
        if (!warnings.includes("Multiple faces detected")) {
          setWarnings(prev => [...prev, "Multiple faces detected"]);
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
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
                    <div>
                      <h3 className="font-medium mb-2">Exam Progress</h3>
                      <Progress value={25} className="h-2" />
                      <div className="flex justify-between mt-1 text-sm text-gray-500">
                        <span>Question 5 of 20</span>
                        <span>25% Complete</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Monitoring Status</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Camera className="h-4 w-4 text-gray-500" />
                            <span>Camera</span>
                          </div>
                          <Badge variant={cameraEnabled ? "outline" : "destructive"}>
                            {cameraEnabled ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mic className="h-4 w-4 text-gray-500" />
                            <span>Microphone</span>
                          </div>
                          <Badge variant={micEnabled ? "outline" : "destructive"}>
                            {micEnabled ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-gray-500" />
                            <span>Tab Focus</span>
                          </div>
                          <Badge variant={isVisible ? "outline" : "destructive"}>
                            {isVisible ? "In Focus" : "Out of Focus"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {warnings.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2 text-red-600">Warnings</h3>
                        <div className="space-y-2">
                          {warnings.map((warning, index) => (
                            <div key={index} className="flex items-center justify-between bg-red-50 p-2 rounded-md">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <span className="text-red-600">{warning}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setWarnings(prev => prev.filter((_, i) => i !== index))}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
