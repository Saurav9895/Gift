
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth-provider";
import { useReviews, addReview } from "@/lib/reviews";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Rating } from "@/components/Rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Loader2, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "./ui/card";

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

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
      const count = reviews.filter(r => r.rating === star).length;
      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
      return { star, count, percentage };
  });

  return (
    <div className="space-y-12">
      <header>
        <h3 className="text-2xl font-headline font-bold mb-4">Rating & Reviews</h3>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Rating Summary */}
        <div className="lg:col-span-1 space-y-6">
             <div className="flex items-end gap-4">
                <span className="text-7xl font-bold">{averageRating.toFixed(1)}</span>
                <div className="flex flex-col">
                    <Rating rating={averageRating} size={24}/>
                    <p className="text-sm text-muted-foreground mt-1">({reviews.length} reviews)</p>
                </div>
            </div>
            <div className="space-y-3">
                {ratingDistribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm">
                            <span>{star}</span>
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400"/>
                        </div>
                        <Progress value={percentage} className="w-full h-2"/>
                    </div>
                ))}
            </div>
        </div>

        {/* Right Side: Reviews Carousel */}
        <div className="lg:col-span-2">
            {reviewsLoading && <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>}
            {!reviewsLoading && reviews.length > 0 && (
                 <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full"
                    >
                    <CarouselContent>
                        {reviews.map((review) => (
                           <CarouselItem key={review.id} className="md:basis-1/2">
                                <Card className="h-full">
                                    <CardContent className="p-6 flex flex-col justify-between h-full">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <Rating rating={review.rating} />
                                                <p className="text-xs text-muted-foreground">
                                                    {review.createdAt && format(review.createdAt.toDate(), "dd MMM yyyy")}
                                                </p>
                                            </div>
                                            <p className="text-foreground/90 text-sm leading-relaxed">&quot;{review.comment}&quot;</p>
                                        </div>
                                        <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                                            <Avatar className="h-10 w-10">
                                                {/* Add avatar image if available */}
                                                <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
                                            </Avatar>
                                            <p className="font-semibold text-sm">{review.userName}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                     <div className="flex gap-2 mt-4">
                        <CarouselPrevious className="static translate-y-0" />
                        <CarouselNext className="static translate-y-0" />
                    </div>
                </Carousel>
            )}
             {!reviewsLoading && reviews.length === 0 && (
                <div className="text-center p-8 bg-card border rounded-lg h-full flex flex-col justify-center">
                    <p className="text-muted-foreground">No reviews yet for this product.</p>
                </div>
            )}
        </div>
      </div>

      {user ? (
        <div>
          <h3 className="text-2xl font-headline font-bold mb-4">Write a Review</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
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
         <div className="text-center p-8 bg-card border rounded-lg max-w-lg mx-auto">
            <p className="text-muted-foreground">You must be logged in to write a review.</p>
         </div>
      )}
    </div>
  );
}
