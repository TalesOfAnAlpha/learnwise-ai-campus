
import React, { useRef, useEffect, useState } from 'react';

interface WebcamProps {
  onFaceDetection?: (detected: boolean, count: number) => void;
}

export const Webcam: React.FC<WebcamProps> = ({ onFaceDetection }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Simulate basic face detection for demo purposes
  useEffect(() => {
    let detectionInterval: NodeJS.Timeout;
    
    if (isActive && onFaceDetection) {
      detectionInterval = setInterval(() => {
        // Simulate face detection (70% chance of detecting a single face)
        const random = Math.random();
        if (random < 0.7) {
          onFaceDetection(true, 1);
        } else if (random < 0.85) {
          // 15% chance of detecting no face
          onFaceDetection(false, 0);
        } else {
          // 15% chance of detecting multiple faces
          onFaceDetection(true, 2);
        }
      }, 3000);
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
        <p className="text-red-500">{error}</p>
        <p className="text-sm text-red-400 mt-2">
          Please check your browser permissions and try again
        </p>
      </div>
    );
  }

  return (
    <video 
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="w-full h-64 bg-gray-100 rounded-md object-cover"
    />
  );
};
