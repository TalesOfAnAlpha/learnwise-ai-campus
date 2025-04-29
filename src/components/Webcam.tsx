
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

  // Enhanced face detection with more detailed simulations
  useEffect(() => {
    let detectionInterval: NodeJS.Timeout;
    
    if (isActive && onFaceDetection) {
      detectionInterval = setInterval(() => {
        // Improved face detection simulation with more scenarios
        const scenario = Math.random();
        
        // 60% chance of normal face detection (single face)
        if (scenario < 0.6) {
          onFaceDetection(true, 1);
        } 
        // 15% chance of detecting no face
        else if (scenario < 0.75) {
          onFaceDetection(false, 0);
        } 
        // 15% chance of detecting multiple faces
        else if (scenario < 0.9) {
          onFaceDetection(true, Math.floor(Math.random() * 2) + 2); // 2-3 faces
        } 
        // 5% chance of detecting a phone
        else if (scenario < 0.95) {
          onFaceDetection(true, 1); // Face is detected
          // In a real implementation, we would have a separate callback for phone detection
        } 
        // 5% chance of looking away
        else {
          onFaceDetection(true, 1); // Face is detected but looking away
          // In a real implementation, we would track face orientation
        }
      }, 2000); // More frequent checks
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
