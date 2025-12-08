"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPersonalizedGiftRecommendations } from "@/ai/flows/personalized-gift-recommendations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";

const formSchema = z.object({
  purchaseHistory: z.string().min(10, {
    message: "Purchase history must be at least 10 characters.",
  }),
  browsingData: z.string().min(10, {
    message: "Browsing data must be at least 10 characters.",
  }),
});

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchaseHistory: "",
      browsingData: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    try {
      const result = await getPersonalizedGiftRecommendations(values);
      setRecommendations(result.recommendations);
    } catch (e) {
      setError("Failed to get recommendations. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-2">
          Personalized Recommendations
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Let our AI help you find the perfect gift. Tell us a bit about their
          tastes and we'll do the rest.
        </p>
      </header>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Gift Finder</CardTitle>
            <CardDescription>
              Enter some examples of items the person has liked or bought
              before.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="purchaseHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Past Purchases or Liked Items</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'Loves handmade jewelry, bought a leather journal, enjoys gourmet coffee.'"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="browsingData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests & Hobbies</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'Interested in sustainable products, home decor, and loves to read.'"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Get Recommendations
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {error && (
          <div className="mt-8 text-center text-destructive">{error}</div>
        )}

        {recommendations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-headline font-bold mb-4">
              Here are some ideas...
            </h2>
            <Card>
              <CardContent className="p-6">
                <ul className="list-disc list-inside space-y-2">
                  {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
