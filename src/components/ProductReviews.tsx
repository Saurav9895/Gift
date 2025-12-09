
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth-provider";
import { useReviews, addReview } from "@/lib/reviews";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Rating } from "@/components/Rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

const reviewFormSchema = z.object({
  rating: z.number().min(1, "Rating is required.").max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters.").max(500),
});

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user, userProfile } = useAuth();
  const { reviews, loading: reviewsLoading } = useReviews(productId);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof reviewFormSchema>) => {
    if (!user || !userProfile) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to submit a review.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview({
        productId,
        userId: user.uid,
        userName: userProfile.name || "Anonymous",
        rating: values.rating,
        comment: values.comment,
      });
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Could not submit your review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string | undefined | null) => {
    if (!name) return "A";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-headline font-bold mb-2">Customer Reviews</h3>
         {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
                <Rating rating={averageRating} />
                <span className="text-muted-foreground">({averageRating.toFixed(1)} out of 5)</span>
            </div>
        )}

        {reviewsLoading && <Loader2 className="animate-spin" />}
        
        {!reviewsLoading && reviews.length === 0 && (
          <p className="text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
        )}
        
        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-4">
              <Avatar>
                <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">{review.userName}</p>
                        <p className="text-xs text-muted-foreground">
                            {review.createdAt && formatDistanceToNow(review.createdAt.toDate(), { addSuffix: true })}
                        </p>
                    </div>
                    <Rating rating={review.rating} />
                </div>
                <p className="text-foreground/90 mt-2">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {user ? (
        <div>
          <h3 className="text-2xl font-headline font-bold mb-4">Write a Review</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Rating</FormLabel>
                    <FormControl>
                        <Rating rating={field.value} onRatingChange={field.onChange} size={24}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Review</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What did you like or dislike?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Review
              </Button>
            </form>
          </Form>
        </div>
      ) : (
         <div className="text-center p-8 bg-card border rounded-lg">
            <p className="text-muted-foreground">You must be logged in to write a review.</p>
         </div>
      )}
    </div>
  );
}
