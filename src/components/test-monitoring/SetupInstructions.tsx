
import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Mic } from 'lucide-react';

interface SetupInstructionsProps {
  cameraEnabled: boolean;
  micEnabled: boolean;
  requestCameraAccess: () => Promise<void>;
  requestMicAccess: () => Promise<void>;
  handleStartTest: () => Promise<void>;
  loading: boolean;
}

const SetupInstructions: React.FC<SetupInstructionsProps> = ({
  cameraEnabled,
  micEnabled,
  requestCameraAccess,
  requestMicAccess,
  handleStartTest,
  loading
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Exam Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 border rounded-md bg-white shadow-sm transition-all hover:shadow-md">
            <div className={`p-2.5 rounded-full ${cameraEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Camera className={`h-5 w-5 ${cameraEnabled ? 'text-green-600' : 'text-gray-500'}`} />
            </div>
            <div>
              <p className="font-medium">Camera Access</p>
              <p className="text-sm text-gray-500">Required for identity verification</p>
            </div>
            <Button 
              variant={cameraEnabled ? "outline" : "default"} 
              size="sm" 
              className={`ml-auto ${!cameraEnabled ? 'animate-pulse bg-blue-500' : ''}`}
              onClick={requestCameraAccess}
              disabled={cameraEnabled}
            >
              {cameraEnabled ? 'Enabled' : 'Enable'}
            </Button>
          </div>
          
          <div className="flex items-center gap-4 p-4 border rounded-md bg-white shadow-sm transition-all hover:shadow-md">
            <div className={`p-2.5 rounded-full ${micEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Mic className={`h-5 w-5 ${micEnabled ? 'text-green-600' : 'text-gray-500'}`} />
            </div>
            <div>
              <p className="font-medium">Microphone Access</p>
              <p className="text-sm text-gray-500">Required for audio monitoring</p>
            </div>
            <Button 
              variant={micEnabled ? "outline" : "default"} 
              size="sm" 
              className={`ml-auto ${!micEnabled ? 'animate-pulse bg-blue-500' : ''}`}
              onClick={requestMicAccess}
              disabled={micEnabled}
            >
              {micEnabled ? 'Enabled' : 'Enable'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Exam Rules</h3>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
          <ul className="list-disc pl-5 space-y-2">
            <li className="text-blue-800">You must remain visible in the camera at all times</li>
            <li className="text-blue-800">No other person should be visible in the frame</li>
            <li className="text-blue-800">Do not switch to other tabs or applications</li>
            <li className="text-blue-800">No talking or playing music in the background</li>
            <li className="text-blue-800">Your face should be well-lit and clearly visible</li>
            <li className="text-blue-800">Phone use is not allowed during the exam</li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleStartTest} 
          disabled={!cameraEnabled || !micEnabled || loading}
          className={`${(!cameraEnabled || !micEnabled) ? 'bg-gray-400' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'}`}
          size="lg"
        >
          {loading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
              Starting...
            </>
          ) : (
            'Start Test'
          )}
        </Button>
      </div>
    </div>
  );
};

export default SetupInstructions;
