
import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Mic, MicOff, Video, VideoOff, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TestMonitoringCamera from '../components/TestMonitoringCamera';
import TestMonitoringAudio from '../components/TestMonitoringAudio';
import AIMonitoringSummary from '../components/AIMonitoringSummary';

const TestMonitoring: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [detections, setDetections] = useState<string[]>([]);
  const { toast } = useToast();

  const startMonitoring = () => {
    if (!cameraEnabled && !audioEnabled) {
      toast({
        title: "Error",
        description: "Please enable at least one monitoring method",
        variant: "destructive"
      });
      return;
    }
    
    setIsMonitoring(true);
    setDetections([]);
    toast({
      title: "Monitoring Started",
      description: "AI test monitoring is now active"
    });
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    toast({
      title: "Monitoring Stopped",
      description: "AI test monitoring has been deactivated"
    });
  };

  const handleDetection = (detection: string) => {
    setDetections(prev => [...prev, detection]);
    toast({
      title: "Activity Detected",
      description: detection,
      variant: "destructive"
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Test Monitoring</h1>
          <p className="mt-2 text-gray-600">AI-powered monitoring for online tests and exams</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Live Monitoring Feed</CardTitle>
                  <Badge variant={isMonitoring ? "destructive" : "outline"}>
                    {isMonitoring ? "Monitoring Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription>
                  AI-powered proctoring ensures academic integrity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cameraEnabled ? (
                  <TestMonitoringCamera
                    isActive={isMonitoring}
                    onDetection={handleDetection}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-md">
                    <VideoOff className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">Camera is disabled</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCameraEnabled(!cameraEnabled)}
                    className={cameraEnabled ? "bg-green-50 text-green-700" : ""}
                  >
                    {cameraEnabled ? <Camera className="h-4 w-4 mr-2" /> : <VideoOff className="h-4 w-4 mr-2" />}
                    {cameraEnabled ? "Camera On" : "Enable Camera"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={audioEnabled ? "bg-green-50 text-green-700" : ""}
                  >
                    {audioEnabled ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
                    {audioEnabled ? "Audio On" : "Enable Audio"}
                  </Button>
                </div>
                <Button 
                  onClick={isMonitoring ? stopMonitoring : startMonitoring}
                  variant={isMonitoring ? "destructive" : "default"}
                >
                  {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
                </Button>
              </CardFooter>
            </Card>

            {audioEnabled && (
              <TestMonitoringAudio 
                isActive={isMonitoring} 
                onDetection={handleDetection} 
              />
            )}
          </div>

          <div>
            <AIMonitoringSummary detections={detections} isActive={isMonitoring} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TestMonitoring;
