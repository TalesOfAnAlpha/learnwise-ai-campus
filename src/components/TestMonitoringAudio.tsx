
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume, Volume1, Volume2, VolumeOff } from 'lucide-react';

interface TestMonitoringAudioProps {
  isActive: boolean;
  onDetection: (detection: string) => void;
}

const TestMonitoringAudio: React.FC<TestMonitoringAudioProps> = ({
  isActive,
  onDetection
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Start audio monitoring
  useEffect(() => {
    if (isActive) {
      startAudioMonitoring();
    } else {
      stopAudioMonitoring();
    }

    return () => {
      stopAudioMonitoring();
    };
  }, [isActive]);

  // Simulate AI detections based on audio for demo purposes
  useEffect(() => {
    let detectionInterval: NodeJS.Timeout;
    
    if (isActive) {
      const possibleDetections = [
        "Background conversation detected",
        "Multiple speakers detected",
        "Background noise is too loud",
        "Potential answer sharing detected"
      ];
      
      detectionInterval = setInterval(() => {
        // Increased chance (40% instead of 15%)
        if (Math.random() < 0.4) {
          const randomDetection = possibleDetections[
            Math.floor(Math.random() * possibleDetections.length)
          ];
          onDetection(`Audio: ${randomDetection}`);
        }
      }, 6000); // Reduced from 20s to 6s
      
      // Generate an immediate detection when audio starts
      setTimeout(() => {
        onDetection("Audio: Initial audio monitoring activated");
      }, 3000);
    }
    
    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [isActive, onDetection]);

  const startAudioMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });
      
      streamRef.current = stream;
      
      // Create audio context and analyzer
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Start monitoring audio levels
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const checkAudioLevel = () => {
        if (!analyserRef.current || !isActive) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        
        const average = sum / dataArray.length;
        const normalizedLevel = Math.min(100, Math.round((average / 255) * 100));
        setAudioLevel(normalizedLevel);
        
        // Check for unusual audio levels - lower threshold to detect more often
        if (normalizedLevel > 50) {
          onDetection("Audio: High volume detected");
        }
        
        requestAnimationFrame(checkAudioLevel);
      };
      
      checkAudioLevel();
      setError(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please check permissions.");
      onDetection("Microphone access error - permissions denied");
    }
  };

  const stopAudioMonitoring = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setAudioLevel(0);
  };

  // Determine which volume icon to show based on audio level
  const getVolumeIcon = () => {
    if (audioLevel === 0) return <VolumeOff className="h-5 w-5" />;
    if (audioLevel < 30) return <Volume className="h-5 w-5" />;
    if (audioLevel < 70) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };

  if (!isActive) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Audio Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="py-3 text-red-500 text-sm">{error}</div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {getVolumeIcon()}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  audioLevel < 30 ? 'bg-green-500' : 
                  audioLevel < 70 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`} 
                style={{ width: `${audioLevel}%` }}
              ></div>
            </div>
            <div className="text-xs font-medium w-8">
              {audioLevel}%
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestMonitoringAudio;
