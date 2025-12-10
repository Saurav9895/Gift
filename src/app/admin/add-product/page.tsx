
"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { addProduct } from "@/lib/products";
import { useCategories } from "@/lib/categories";
import { Combobox } from "@/components/ui/combobox";
import { ImageUploader } from "@/components/ImageUploader";
import { useState } from "react";
import { Trash2, PlusCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  shortDescription: z.string().min(10, { message: "Short description must be at least 10 characters." }),
  longDescription: z.string().min(20, { message: "Long description must be at least 20 characters." }),
  originalPrice: z.coerce.number().positive({ message: "Original price must be a positive number." }),
  discountedPrice: z.coerce.number().positive({ message: "Discounted price must be a positive number." }),
  quantity: z.coerce.number().int().positive({ message: "Quantity must be a positive integer." }),
  imageUrls: z.array(z.string().url()).min(1, { message: "Please provide at least one image URL." }),
  category: z.string().min(1, { message: "Please select a category." }),
  deliveryTime: z.string().min(1, { message: "Delivery time is required." }),
  estimatedArrival: z.string().min(1, { message: "Estimated arrival is required." }),
});

export default function AddProductPage() {
  const { toast } = useToast();
  const { categories: categoryData, loading: categoriesLoading } = useCategories();
  const [isLoading, setIsLoading] = useState(false);
  
  const categories = categoryData.map(c => ({
      value: c.name.toLowerCase(),
      label: c.name,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      longDescription: "",
      originalPrice: 0,
      discountedPrice: 0,
      quantity: 1,
      imageUrls: [],
      category: "",
      deliveryTime: "3-4 Days",
      estimatedArrival: "10-12 Oct 2024",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "imageUrls",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const productData = {
        ...values,
        price: values.discountedPrice // Use discounted price as the main price
    };
    try {
      await addProduct(productData);
      toast({
        title: "Product Added",
        description: `Product "${values.name}" has been successfully added.`,
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product.",
      });
    } finally {
        setIsLoading(false);
    }
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="deliveryTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Time</FormLabel>
                      <FormControl><Input placeholder="e.g., 3-4 Days" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estimatedArrival"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Arrival</FormLabel>
                      <FormControl><Input placeholder="e.g., 10-12 Oct 2024" {...field} /></FormControl>
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
               <div>
                <FormLabel>Product Images</FormLabel>
                <div className="space-y-4 pt-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-4">
                        <FormField
                          control={form.control}
                          name={`imageUrls.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-grow">
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
                        <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append("")}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Image
                    </Button>
                    {form.formState.errors.imageUrls && (
                        <p className="text-sm font-medium text-destructive">{form.formState.errors.imageUrls.message}</p>
                    )}
                </div>
               </div>
              <Button type="submit" disabled={isLoading}>{isLoading ? "Adding..." : "Add Product"}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
