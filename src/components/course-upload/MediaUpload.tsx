
import React, { useCallback } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";

interface MediaUploadProps {
  thumbnailUrl: string;
  setThumbnailUrl: (url: string) => void;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  thumbnailUrl,
  setThumbnailUrl,
  videoUrl,
  setVideoUrl,
  isUploading,
  setIsUploading,
}) => {
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File, type: 'thumbnail' | 'video') => {
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${type}s/${fileName}`;

    try {
      const { error: uploadError, data } = await supabase.storage
        .from('course-content')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-content')
        .getPublicUrl(filePath);

      if (type === 'thumbnail') {
        setThumbnailUrl(publicUrl);
      } else {
        setVideoUrl(publicUrl);
      }

      toast({
        title: 'Upload successful',
        description: `${type} has been uploaded successfully.`,
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  }, [setThumbnailUrl, setVideoUrl, setIsUploading, toast]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Thumbnail Image</Label>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, 'thumbnail');
            }}
            disabled={isUploading}
          />
          {thumbnailUrl && (
            <img src={thumbnailUrl} alt="Thumbnail preview" className="h-16 w-16 object-cover rounded" />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Course Video or Drive Link</Label>
        <div className="flex flex-col gap-4">
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, 'video');
            }}
            disabled={isUploading}
          />
          <div className="- OR -" />
          <Input
            type="url"
            placeholder="Or paste Google Drive/Video link"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            disabled={isUploading}
          />
        </div>
      </div>

      {isUploading && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
