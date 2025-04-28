
import React, { useCallback, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File, type: 'thumbnail' | 'video') => {
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${type}s/${fileName}`;

    try {
      console.log(`Uploading ${type} to course-content bucket: ${filePath}`);
      
      const { error: uploadError, data } = await supabase.storage
        .from('course-content')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      console.log(`Upload successful: ${filePath}`);
      
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
      console.error(`Error uploading ${type}:`, error.message);
      setUploadError(`Failed to upload ${type}: ${error.message}`);
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  }, [setThumbnailUrl, setVideoUrl, setIsUploading, toast]);

  const handleExternalVideo = (url: string) => {
    // Accept YouTube, Google Drive, and other video URLs
    setVideoUrl(url);
    toast({
      title: 'Video link added',
      description: 'External video link has been added successfully.',
    });
  };

  return (
    <div className="space-y-6">
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
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
        <Label>Course Video</Label>
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
          
          <div className="flex items-center">
            <Separator className="flex-1" />
            <span className="px-2 text-xs text-gray-500">OR</span>
            <Separator className="flex-1" />
          </div>
          
          <div className="space-y-2">
            <Label>External Video Link</Label>
            <Input
              type="url"
              placeholder="Paste YouTube, Google Drive, or other video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              disabled={isUploading}
            />
            <p className="text-sm text-gray-500">
              Supported formats: YouTube, Google Drive, Vimeo, etc.
            </p>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading... Please wait</span>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
