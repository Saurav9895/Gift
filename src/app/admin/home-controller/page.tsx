
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/lib/products";
import { useCategories } from "@/lib/categories";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import type { Product, Category } from "@/types";

const formSchema = z.object({
  featuredProductIds: z.array(z.string()).max(8, "You can select a maximum of 8 products."),
  featuredCategoryIds: z.array(z.string()).max(5, "You can select a maximum of 5 categories."),
});

export default function HomeControllerPage() {
  const { toast } = useToast();
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      featuredProductIds: [],
      featuredCategoryIds: [],
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setPageLoading(true);
      const docRef = doc(db, "site-settings", "homepage");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        form.reset(docSnap.data());
      }
      setPageLoading(false);
    };
    fetchSettings();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const docRef = doc(db, "site-settings", "homepage");
      await setDoc(docRef, values);
      toast({
        title: "Settings Saved",
        description: "Your homepage content has been updated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const loading = productsLoading || categoriesLoading || pageLoading;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Home Page Controller</h1>
        <p className="text-muted-foreground">Select which products and categories to display on the home page.</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Featured Products</CardTitle>
                <CardDescription>Select up to 8 products to feature in the carousel on the home page.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="featuredProductIds"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product: Product) => (
                          <FormField
                            key={product.id}
                            control={form.control}
                            name="featuredProductIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={product.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(product.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), product.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== product.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{product.name}</FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>Select up to 5 categories to display on the home page.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="featuredCategoryIds"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {categories.map((category: Category) => (
                          <FormField
                            key={category.id}
                            control={form.control}
                            name="featuredCategoryIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={category.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(category.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), category.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== category.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{category.name}</FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Settings"}</Button>
          </form>
        </Form>
      )}
    </div>
  );
}
