
"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  fill?: boolean;
  className?: string;
  onRatingChange?: (rating: number) => void;
}

export function Rating({
  rating,
  totalStars = 5,
  size = 20,
  fill = true,
  className,
  onRatingChange,
}: RatingProps) {
  const stars = Array.from({ length: totalStars }, (_, i) => i + 1);

  const handleStarClick = (starValue: number) => {
    if (onRatingChange) {
      onRatingChange(starValue);
    }
  };
  
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(
            "transition-colors",
            onRatingChange ? "cursor-pointer" : "cursor-default",
            {
              "text-primary": fill && rating >= star,
              "text-muted-foreground": !fill || rating < star,
              "fill-current text-primary": fill && rating >= star,
              "text-gray-300": !fill && rating < star,
            }
          )}
          onClick={() => handleStarClick(star)}
        />
      ))}
    </div>
  );
}
