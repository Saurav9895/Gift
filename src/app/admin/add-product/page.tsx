
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
import { products } from "@/lib/products";
import { Combobox } from "@/components/ui/combobox";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  originalPrice: z.coerce.number().positive({ message: "Original price must be a positive number." }),
  discountedPrice: z.coerce.number().positive({ message: "Discounted price must be a positive number." }),
  quantity: z.coerce.number().int().positive({ message: "Quantity must be a positive integer." }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }),
  category: z.string().min(2, { message: "Category must be at least 2 characters." }),
});

export default function AddProductPage() {
  const { toast } = useToast();
  
  const categories = [...new Set(products.map(p => p.category))].map(category => ({
      value: category.toLowerCase(),
      label: category,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      originalPrice: 0,
      discountedPrice: 0,
      quantity: 1,
      imageUrl: "",
      category: "",
    },
  });

  const imageUrl = form.watch("imageUrl");

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Original Price</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 49.99" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="discountedPrice"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Discounted Price</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 39.99" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="e.g., 100" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
               <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Category</FormLabel>
                            <Combobox
                                options={categories}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select category..."
                                searchPlaceholder="Search categories..."
                                notFoundText="No category found."
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
               <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
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
                        alt="Product image preview"
                        fill
                        className="object-contain"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                        onLoad={(e) => e.currentTarget.style.display = 'block'}
                      />
                    </div>
                  </div>
                )}
              <Button type="submit">Add Product</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
