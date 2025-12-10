
"use client";

import { useEffect, useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useProduct, updateProduct } from "@/lib/products";
import { useCategories } from "@/lib/categories";
import { Combobox } from "@/components/ui/combobox";
import { ImageUploader } from "@/components/ImageUploader";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  shortDescription: z.string().min(10, { message: "Short description must be at least 10 characters." }),
  longDescription: z.string().min(20, { message: "Long description must be at least 20 characters." }),
  originalPrice: z.coerce.number().positive({ message: "Original price must be a positive number." }),
  discountedPrice: z.coerce.number().positive({ message: "Discounted price must be a positive number." }),
  quantity: z.coerce.number().int().positive({ message: "Quantity must be a positive integer." }),
  imageUrl: z.string().url({ message: "Please provide a valid image URL." }),
  category: z.string().min(1, { message: "Please select a category." }),
});

export default function EditProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { id } = useParams();
  const productId = Array.isArray(id) ? id[0] : id;

  const { product, loading: productLoading } = useProduct(productId);
  const { categories: categoryData, loading: categoriesLoading } = useCategories();
  const [isLoading, setIsLoading] = useState(false);
  
  const categories = categoryData.map(c => ({
      value: c.name.toLowerCase(),
      label: c.name,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", shortDescription: "", longDescription: "",
      originalPrice: 0, discountedPrice: 0, quantity: 1,
      imageUrl: "", category: "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice,
        quantity: product.quantity,
        imageUrl: product.imageUrl,
        category: product.category,
      });
    }
  }, [product, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const productData = {
        ...values,
        price: values.discountedPrice // Use discounted price as the main price
    };
    try {
      await updateProduct(productId, productData);
      toast({
        title: "Product Updated",
        description: `Product "${values.name}" has been successfully updated.`,
      });
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product.",
      });
    } finally {
        setIsLoading(false);
    }
  }

  if (productLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
        </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Edit Product</h1>
        <p className="text-muted-foreground">Update the details for "{product?.name}".</p>
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
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief, catchy description for product cards."
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
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A detailed description for the product page."
                        className="resize-vertical min-h-[120px]"
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
                                placeholder={categoriesLoading ? "Loading..." : "Select category..."}
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
                        <FormLabel>Product Image URL</FormLabel>
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
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
