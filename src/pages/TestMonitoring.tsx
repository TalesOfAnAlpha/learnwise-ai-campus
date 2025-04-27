
import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Mic, MicOff, Video, VideoOff, Eye, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TestMonitoringCamera from '../components/TestMonitoringCamera';
import TestMonitoringAudio from '../components/TestMonitoringAudio';
import AIMonitoringSummary from '../components/AIMonitoringSummary';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const TestMonitoring: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [detections, setDetections] = useState<string[]>([]);
  const [tabSwitchAttempts, setTabSwitchAttempts] = useState<string[]>([]);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const originalTitle = useRef(document.title);
  const { toast } = useToast();

  // Monitor tab focus/visibility
  useEffect(() => {
    if (isMonitoring) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          const timestamp = new Date().toISOString();
          setTabSwitchAttempts(prev => [...prev, timestamp]);
          setDetections(prev => [...prev, `Tab switch detected at ${new Date().toLocaleTimeString()}`]);
          setIsWarningDialogOpen(true);
          
          // Flash the title to get attention
          let titleFlash = setInterval(() => {
            document.title = document.title === "⚠️ RETURN TO TEST" 
              ? "⚠️ MONITORING ACTIVE" 
              : "⚠️ RETURN TO TEST";
          }, 1000);
          
          // Clear interval when tab is visible again
          const clearTitleFlash = () => {
            if (document.visibilityState === 'visible') {
              clearInterval(titleFlash);
              document.title = originalTitle.current;
              document.removeEventListener('visibilitychange', clearTitleFlash);
            }
          };
          
          document.addEventListener('visibilitychange', clearTitleFlash);
          
          toast({
            title: "Warning",
            description: "Tab switching detected! This has been recorded.",
            variant: "destructive",
          });
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Warn before closing/refreshing
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
        return '';
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.title = originalTitle.current;
      };
    }
  }, [isMonitoring, toast]);

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
    setTabSwitchAttempts([]);
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
            
            {tabSwitchAttempts.length > 0 && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-700">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Tab Switch Attempts
                  </CardTitle>
                  <CardDescription className="text-red-600">
                    {tabSwitchAttempts.length} attempt{tabSwitchAttempts.length !== 1 ? 's' : ''} to leave the test page detected
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-red-700">
                    {tabSwitchAttempts.map((timestamp, index) => (
                      <li key={index} className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Tab switch at {new Date(timestamp).toLocaleTimeString()}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <AIMonitoringSummary 
              detections={[...detections, ...tabSwitchAttempts.map(time => 
                `Tab switch at ${new Date(time).toLocaleTimeString()}`
              )]} 
              isActive={isMonitoring} 
            />
          </div>
        </div>
      </div>
      
      {/* Warning Dialog for Tab Switching */}
      <Dialog 
        open={isWarningDialogOpen} 
        onOpenChange={(open) => {
          // Only allow closing if we're back in the tab
          if (document.visibilityState === 'visible') {
            setIsWarningDialogOpen(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" /> 
              Warning: Tab Switch Detected
            </DialogTitle>
            <DialogDescription className="text-red-600">
              Leaving the test tab is not allowed during monitoring. This activity has been recorded.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-sm text-red-700">
              Multiple instances of tab switching may result in test invalidation. 
              Please remain on this tab until your test is complete.
            </p>
            <p className="mt-2 font-medium text-red-600">
              Recorded tab switches: {tabSwitchAttempts.length}
            </p>
          </div>
          <div className="flex justify-center">
            <Button 
              className="bg-red-600 hover:bg-red-700 mt-2"
              onClick={() => setIsWarningDialogOpen(false)}
            >
              I Understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TestMonitoring;
