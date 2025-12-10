
"use client";

import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Card } from './ui/card';

interface ImageUploaderProps {
  onUrlChange: (url: string) => void;
  currentImageUrl: string | null;
}

export function ImageUploader({ onUrlChange, currentImageUrl }: ImageUploaderProps) {
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUrlChange(event.target.value);
  };

  return (
    <div className="space-y-4">
        <Card className="p-4">
            <Input
                type="url"
                placeholder="https://example.com/image.png"
                value={currentImageUrl || ''}
                onChange={handleUrlChange}
                className="w-full"
            />
             <p className="mt-2 text-xs text-muted-foreground">
                Paste the URL of an image.
            </p>
        </Card>

      {currentImageUrl && (
        <div className="mt-4">
            <p className="text-sm font-medium mb-2">Image Preview</p>
          <div className="relative group w-full max-w-sm rounded-md overflow-hidden border bg-muted">
            <Image
              src={currentImageUrl}
              alt="Image preview"
              width={400}
              height={225}
              className="object-contain w-full"
              onError={(e) => {
                  // Hide the image element if it fails to load
                  if (e.target instanceof HTMLElement) {
                    e.target.style.display = 'none';
                  }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
