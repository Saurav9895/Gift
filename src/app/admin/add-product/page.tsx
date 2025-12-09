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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  imageId: z.string().min(1, { message: "Image ID is required." }),
  category: z.string().min(2, { message: "Category must be at least 2 characters." }),
});

export default function AddProductPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imageId: "",
      category: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically handle form submission, e.g., saving to a database
    toast({
      title: "Product Added",
      description: `Product "${values.name}" has been successfully added.`,
    });
    form.reset();
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Add New Product</h1>
        <p className="text-muted-foreground">Fill out the form below to add a new product to your store.</p>
      </header>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Artisan Chocolate Box" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A curated selection of hand-crafted chocolates..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 39.99" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Gourmet" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
               <FormField
                    control={form.control}
                    name="imageId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image ID</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., gift-1" {...field} />
                        </FormControl>
                         <p className="text-sm text-muted-foreground">
                            This should match an ID from the placeholder images file.
                        </p>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              <Button type="submit">Add Product</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
