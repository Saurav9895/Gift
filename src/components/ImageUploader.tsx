
"use client";

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { Card } from './ui/card';

interface ImageUploaderProps {
  onUrlChange: (url: string) => void;
  currentImageUrl: string | null;
}

export function ImageUploader({ onUrlChange, currentImageUrl }: ImageUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = (file: File) => {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, `images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setIsUploading(true);
    setUploadProgress(0);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        setIsUploading(false);
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description: error.message,
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setIsUploading(false);
          onUrlChange(downloadURL);
          toast({
            title: 'Upload successful',
            description: 'Image has been uploaded and URL is set.',
          });
        });
      }
    );
  };

  const removeImage = () => {
    onUrlChange('');
  };

  return (
    <div className="space-y-4">
        <Card className="p-4">
            <div className="flex items-center justify-center w-full">
                <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                    </div>
                    <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
            </div>
        </Card>

      {isUploading && (
        <div>
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-center mt-2">{`Uploading... ${Math.round(uploadProgress)}%`}</p>
        </div>
      )}

      {currentImageUrl && !isUploading && (
        <div className="mt-4">
            <p className="text-sm font-medium mb-2">Image Preview</p>
          <div className="relative group w-full max-w-sm rounded-md overflow-hidden border bg-muted">
            <Image
              src={currentImageUrl}
              alt="Image preview"
              width={400}
              height={225}
              className="object-contain w-full"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
