
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface TestMonitoringCameraProps {
  isActive: boolean;
  onDetection: (detection: string) => void;
}

const TestMonitoringCamera: React.FC<TestMonitoringCameraProps> = ({ 
  isActive,
  onDetection
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Start camera stream
  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  // Simulate AI detections for demo purposes
  useEffect(() => {
    let detectionInterval: NodeJS.Timeout;
    
    if (isActive) {
      const possibleDetections = [
        "Multiple faces detected",
        "Looking away from screen",
        "Person left visible area",
        "Unknown person detected",
        "Phone detected in frame"
      ];
      
      detectionInterval = setInterval(() => {
        // Only trigger detections occasionally for demo purposes (20% chance)
        if (Math.random() < 0.2) {
          const randomDetection = possibleDetections[
            Math.floor(Math.random() * possibleDetections.length)
          ];
          onDetection(`Camera: ${randomDetection}`);
        }
      }, 15000); // Check every 15 seconds
    }
    
    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [isActive, onDetection]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
      onDetection("Camera access error - permissions denied");
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
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-md">
        <Eye className="h-12 w-12 text-red-400 mb-2" />
        <p className="text-red-500">{error}</p>
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
      
      {isActive && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs animate-pulse">
          <span className="h-2 w-2 rounded-full bg-white"></span> Live
        </div>
      )}
      
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-md">
          <p className="text-white font-medium">Camera Paused</p>
        </div>
      )}
    </div>
  );
};

export default TestMonitoringCamera;
