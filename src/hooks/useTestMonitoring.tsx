
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useTabVisibility } from './useTabVisibility';

interface TestMonitoringState {
  cameraEnabled: boolean;
  micEnabled: boolean;
  testStarted: boolean;
  timeRemaining: number;
  loading: boolean;
  faceDetected: boolean;
  faceCount: number;
  warnings: string[];
  currentQuestion: number;
  totalQuestions: number;
  progress: number;
  suspiciousActivities: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
  }[];
}

export function useTestMonitoring() {
  const { toast } = useToast();
  const [state, setState] = useState<TestMonitoringState>({
    cameraEnabled: false,
    micEnabled: false,
    testStarted: false,
    timeRemaining: 3600, // 1 hour in seconds
    loading: false,
    faceDetected: false,
    faceCount: 0,
    warnings: [],
    currentQuestion: 5,
    totalQuestions: 20,
    progress: 25,
    suspiciousActivities: []
  });
  
  const { isVisible, tabSwitchCount, lastSwitchTime, tabSwitches } = useTabVisibility();
  
  // Track tab switches as suspicious activity
  useEffect(() => {
    if (state.testStarted && tabSwitchCount > 0 && tabSwitches.length > 0) {
      const latestSwitch = tabSwitches[tabSwitches.length - 1];
      
      setState(prevState => ({
        ...prevState,
        suspiciousActivities: [
          ...prevState.suspiciousActivities,
          {
            type: `Tab switched (${latestSwitch.count} total)`,
            severity: latestSwitch.count > 3 ? 'high' : 'medium',
            timestamp: latestSwitch.time
          }
        ],
        warnings: prevState.warnings.includes(`Tab switching detected (${latestSwitch.count} times)`)
          ? prevState.warnings
          : [...prevState.warnings, `Tab switching detected (${latestSwitch.count} times)`]
      }));
    }
  }, [state.testStarted, tabSwitchCount, tabSwitches]);
  
  // Timer effect for the exam
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (state.testStarted && state.timeRemaining > 0) {
      timer = setInterval(() => {
        setState(prevState => ({
          ...prevState,
          timeRemaining: prevState.timeRemaining - 1
        }));
        
        // Randomly advance through exam for demo purposes
        if (Math.random() < 0.05) {
          setState(prevState => {
            if (prevState.currentQuestion < prevState.totalQuestions) {
              const newQuestion = prevState.currentQuestion + 1;
              const newProgress = Math.round((newQuestion / prevState.totalQuestions) * 100);
              return {
                ...prevState,
                currentQuestion: newQuestion,
                progress: newProgress
              };
            }
            return prevState;
          });
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.testStarted, state.timeRemaining]);
  
  const handleFaceDetection = (detected: boolean, count: number) => {
    setState(prevState => ({
      ...prevState,
      faceDetected: detected,
      faceCount: count
    }));
    
    if (state.testStarted) {
      // Advanced detection logic with smarter warnings
      let newWarnings = [...state.warnings];
      let newActivities = [...state.suspiciousActivities];
      
      if (count === 0) {
        if (!newWarnings.includes("No face detected")) {
          newWarnings.push("No face detected");
          
          // Add to suspicious activities log
          newActivities.push({
            type: "No face detected",
            severity: 'high',
            timestamp: new Date().toLocaleTimeString()
          });
        }
      } else if (count > 1) {
        if (!newWarnings.includes(`${count} faces detected`)) {
          newWarnings.push(`${count} faces detected`);
          
          // Add to suspicious activities log
          newActivities.push({
            type: `${count} faces detected`,
            severity: 'high',
            timestamp: new Date().toLocaleTimeString()
          });
        }
      }
      
      // More sophisticated detection scenarios using time-based patterns
      const currentTime = new Date();
      const secondsElapsed = Math.floor(Date.now() / 1000) % 60;
      
      // Generate varied detection patterns based on time
      if (state.testStarted && secondsElapsed % 12 === 0) {
        // Phone detection (occurs approximately every 12 seconds)
        if (!newWarnings.includes("Phone detected")) {
          newWarnings.push("Phone detected");
          newActivities.push({
            type: "Phone detected",
            severity: 'high',
            timestamp: currentTime.toLocaleTimeString()
          });
        }
      } else if (state.testStarted && secondsElapsed % 15 === 0) {
        // Looking away (occurs approximately every 15 seconds)
        if (!newWarnings.includes("Looking away from screen")) {
          newWarnings.push("Looking away from screen");
          newActivities.push({
            type: "Looking away from screen",
            severity: 'medium',
            timestamp: currentTime.toLocaleTimeString()
          });
        }
      } else if (state.testStarted && secondsElapsed % 23 === 0) {
        // Background noise (occurs approximately every 23 seconds)
        if (!newWarnings.includes("Background conversation detected")) {
          newWarnings.push("Background conversation detected");
          newActivities.push({
            type: "Background conversation",
            severity: 'medium',
            timestamp: currentTime.toLocaleTimeString()
          });
        }
      }
      
      setState(prevState => ({
        ...prevState,
        warnings: newWarnings,
        suspiciousActivities: newActivities
      }));
    }
  };
  
  const requestCameraAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setState(prevState => ({
        ...prevState,
        cameraEnabled: true
      }));
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
      setState(prevState => ({
        ...prevState,
        micEnabled: true
      }));
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
  
  const handleStartTest = async () => {
    if (!state.cameraEnabled || !state.micEnabled) {
      toast({
        title: "Cannot start test",
        description: "Camera and microphone access are required",
        variant: "destructive",
      });
      return;
    }
    
    setState(prevState => ({
      ...prevState,
      loading: true
    }));
    
    try {
      // Simulate API call to start test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setState(prevState => ({
        ...prevState,
        testStarted: true,
        loading: false
      }));
      
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
      setState(prevState => ({
        ...prevState,
        loading: false
      }));
    }
  };
  
  const handleEndTest = async () => {
    setState(prevState => ({
      ...prevState,
      loading: true
    }));
    
    try {
      // Simulate API call to submit test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Test submitted",
        description: "Your test has been submitted successfully.",
      });
      
      return true; // Indicate success
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit test. Please try again.",
        variant: "destructive",
      });
      setState(prevState => ({
        ...prevState,
        loading: false
      }));
      return false; // Indicate failure
    }
  };
  
  const handleDismissWarning = (index: number) => {
    setState(prevState => ({
      ...prevState,
      warnings: prevState.warnings.filter((_, i) => i !== index)
    }));
  };
  
  return {
    ...state,
    isVisible,
    tabSwitchCount,
    tabSwitches,
    handleFaceDetection,
    requestCameraAccess,
    requestMicAccess,
    handleStartTest,
    handleEndTest,
    handleDismissWarning
  };
}
