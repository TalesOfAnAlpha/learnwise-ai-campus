
import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, AlertTriangle } from 'lucide-react';

interface WebcamProps {
  onFaceDetection?: (detected: boolean, count: number) => void;
}

export const Webcam: React.FC<WebcamProps> = ({ onFaceDetection }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [detectionStatus, setDetectionStatus] = useState<{
    status: 'normal' | 'warning' | 'error';
    message: string;
  }>({ status: 'normal', message: 'Monitoring active' });

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Enhanced face detection with more realistic behaviors and detection
  useEffect(() => {
    let detectionInterval: NodeJS.Timeout;
    
    if (isActive && onFaceDetection) {
      detectionInterval = setInterval(() => {
        // More sophisticated detection simulation with realistic patterns
        // This creates a more natural pattern of detections
        const timeOfDay = new Date().getHours();
        const userActivity = Math.random(); // Simulate user behavior
        
        // Base detection chance - higher during expected work hours
        let detectionChance = timeOfDay >= 9 && timeOfDay <= 17 ? 0.85 : 0.75;
        
        // Adjust for simulated user fatigue over time
        const sessionDuration = Math.floor(Date.now() / 60000) % 30; // Minutes in current session
        if (sessionDuration > 20) {
          detectionChance -= 0.15; // Users tend to look away more after 20 minutes
        }
        
        // Make detection decisions
        if (userActivity < detectionChance) {
          // Normal case - single face detected
          onFaceDetection(true, 1);
          setDetectionStatus({ status: 'normal', message: 'Face properly detected' });
        } 
        else if (userActivity < detectionChance + 0.08) {
          // No face detected
          onFaceDetection(false, 0);
          setDetectionStatus({ 
            status: 'error', 
            message: 'No face detected - please stay visible' 
          });
        } 
        else if (userActivity < detectionChance + 0.13) {
          // Multiple faces
          const faceCount = Math.floor(Math.random() * 2) + 2; // 2-3 faces
          onFaceDetection(true, faceCount);
          setDetectionStatus({ 
            status: 'error', 
            message: `${faceCount} faces detected - only one person allowed` 
          });
        } 
        else if (userActivity < detectionChance + 0.17) {
          // Looking away
          onFaceDetection(true, 1);
          setDetectionStatus({ 
            status: 'warning', 
            message: 'Looking away from screen detected' 
          });
        }
        else {
          // Phone or other object detection
          onFaceDetection(true, 1);
          setDetectionStatus({ 
            status: 'error', 
            message: 'Unauthorized object detected' 
          });
        }
      }, 1500); // More frequent checks for responsive monitoring
    }
    
    return () => {
      if (detectionInterval) clearInterval(detectionInterval);
    };
  }, [isActive, onFaceDetection]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setError(null);
      setIsActive(true);
      
      // Initial face detection after camera starts
      if (onFaceDetection) {
        setTimeout(() => onFaceDetection(true, 1), 1000);
        setDetectionStatus({ status: 'normal', message: 'Face properly detected' });
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
      setIsActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-md">
        <CameraOff className="h-10 w-10 text-red-500 mb-2" />
        <p className="text-red-500 font-medium">{error}</p>
        <p className="text-sm text-red-400 mt-2">
          Please check your browser permissions and try again
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <video 
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-64 bg-gray-100 rounded-md object-cover"
      />
      
      {/* Status overlay */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-2">
        <div className="flex items-center gap-1 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
          <Camera className="h-3 w-3" />
          <span className="animate-pulse">Live</span>
        </div>
        
        {detectionStatus.status !== 'normal' && (
          <div className={`flex items-center gap-1 ${
            detectionStatus.status === 'warning' 
              ? 'bg-yellow-500' 
              : 'bg-red-500'
          } text-white px-3 py-1 rounded-full text-xs animate-pulse`}>
            <AlertTriangle className="h-3 w-3" />
            <span>{detectionStatus.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
