
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Camera, Mic, Eye } from 'lucide-react';

interface MonitoringStatusProps {
  cameraEnabled: boolean;
  micEnabled: boolean;
  isVisible: boolean;
}

const MonitoringStatus: React.FC<MonitoringStatusProps> = ({
  cameraEnabled,
  micEnabled,
  isVisible
}) => {
  return (
    <div>
      <h3 className="font-medium mb-3">Monitoring Status</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${cameraEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
              <Camera className={`h-4 w-4 ${cameraEnabled ? 'text-green-600' : 'text-red-500'}`} />
            </div>
            <span>Camera</span>
          </div>
          <Badge variant={cameraEnabled ? "outline" : "destructive"} className={cameraEnabled ? "bg-green-50 text-green-700" : ""}>
            {cameraEnabled ? "Active" : "Disabled"}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${micEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
              <Mic className={`h-4 w-4 ${micEnabled ? 'text-green-600' : 'text-red-500'}`} />
            </div>
            <span>Microphone</span>
          </div>
          <Badge variant={micEnabled ? "outline" : "destructive"} className={micEnabled ? "bg-green-50 text-green-700" : ""}>
            {micEnabled ? "Active" : "Disabled"}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${isVisible ? 'bg-green-100' : 'bg-red-100'}`}>
              <Eye className={`h-4 w-4 ${isVisible ? 'text-green-600' : 'text-red-500'}`} />
            </div>
            <span>Tab Focus</span>
          </div>
          <Badge 
            variant={isVisible ? "outline" : "destructive"}
            className={isVisible ? "bg-green-50 text-green-700" : "animate-pulse"}
          >
            {isVisible ? "In Focus" : "Out of Focus"}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default MonitoringStatus;
