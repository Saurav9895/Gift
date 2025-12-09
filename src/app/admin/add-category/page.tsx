
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImageUploader } from "@/components/ImageUploader";
import { addCategory } from "@/lib/categories";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters." }),
  imageUrl: z.string().url({ message: "Please upload an image for the category." }),
});

export default function AddCategoryPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await addCategory(values);
      toast({
        title: "Category Added",
        description: `Category "${values.name}" has been successfully added.`,
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add category.",
      });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Add New Category</h1>
        <p className="text-muted-foreground">Fill out the form below to add a new category for your products.</p>
      </header>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Home Decor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Image</FormLabel>
                    <FormControl>
                       <ImageUploader 
                            onUrlChange={field.onChange} 
                            currentImageUrl={field.value}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>{isLoading ? "Adding..." : "Add Category"}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
