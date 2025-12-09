
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
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }),
});

export default function AddCategoryPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const imageUrl = form.watch("imageUrl");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically handle form submission, e.g., saving to a database
    toast({
      title: "Category Added",
      description: `Category "${values.name}" has been successfully added.`,
    });
    form.reset();
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
                    <FormLabel>Category Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/category-image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {imageUrl && (
                  <div className="mt-4">
                    <FormLabel>Image Preview</FormLabel>
                    <div className="mt-2 relative aspect-video w-full max-w-sm rounded-md overflow-hidden border bg-muted">
                       <Image
                        src={imageUrl}
                        alt="Category image preview"
                        fill
                        className="object-contain"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                        onLoad={(e) => e.currentTarget.style.display = 'block'}
                      />
                    </div>
                  </div>
                )}
              <Button type="submit">Add Category</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
