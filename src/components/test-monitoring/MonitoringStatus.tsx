
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
      <h3 className="font-medium mb-2">Monitoring Status</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-gray-500" />
            <span>Camera</span>
          </div>
          <Badge variant={cameraEnabled ? "outline" : "destructive"}>
            {cameraEnabled ? "Active" : "Disabled"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-gray-500" />
            <span>Microphone</span>
          </div>
          <Badge variant={micEnabled ? "outline" : "destructive"}>
            {micEnabled ? "Active" : "Disabled"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-500" />
            <span>Tab Focus</span>
          </div>
          <Badge variant={isVisible ? "outline" : "destructive"}>
            {isVisible ? "In Focus" : "Out of Focus"}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default MonitoringStatus;
