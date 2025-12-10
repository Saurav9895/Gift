
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/lib/products";
import { useCategories } from "@/lib/categories";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import type { Product, Category } from "@/types";
import { Combobox } from "@/components/ui/combobox";
import Image from "next/image";


const formSchema = z.object({
  featuredProductIds: z.array(z.string()).max(8, "You can select a maximum of 8 products."),
  featuredCategoryIds: z.array(z.string()).max(5, "You can select a maximum of 5 categories."),
});

type FormData = z.infer<typeof formSchema>;

const ReorderableList = ({
    items,
    onRemove,
    onMove,
} : {
    items: (Product[] | Category[]),
    onRemove: (id: string) => void,
    onMove: (startIndex: number, endIndex: number) => void,
}) => {
    
    return (
        <div className="space-y-2 mt-4">
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className="flex items-center gap-4 p-2 border rounded-lg bg-background"
                >
                    <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                    <Image src={item.imageUrl} alt={item.name} width={32} height={32} className="rounded-md object-cover"/>
                    <span className="flex-grow font-medium text-sm">{item.name}</span>
                    <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onMove(index, index - 1)} disabled={index === 0}>
                            <ArrowUp className="h-4 w-4"/>
                        </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onMove(index, index + 1)} disabled={index === items.length - 1}>
                            <ArrowDown className="h-4 w-4"/>
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onRemove(item.id)}>
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}


export default function HomeControllerPage() {
  const { toast } = useToast();
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      featuredProductIds: [],
      featuredCategoryIds: [],
    },
  });

  const { fields: productFields, append: appendProduct, remove: removeProduct, move: moveProduct } = useFieldArray({
      control: form.control,
      name: "featuredProductIds"
  });

  const { fields: categoryFields, append: appendCategory, remove: removeCategory, move: moveCategory } = useFieldArray({
      control: form.control,
      name: "featuredCategoryIds"
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

  async function onSubmit(values: FormData) {
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

  const productOptions = products
    .filter(p => !form.getValues("featuredProductIds").includes(p.id))
    .map(p => ({ label: p.name, value: p.id }));

  const categoryOptions = categories
    .filter(c => !form.getValues("featuredCategoryIds").includes(c.id))
    .map(c => ({ label: c.name, value: c.id }));

  const selectedProducts = form.watch('featuredProductIds').map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
  const selectedCategories = form.watch('featuredCategoryIds').map(id => categories.find(c => c.id === id)).filter(Boolean) as Category[];

  const handleAddProduct = (id: string) => {
    if (form.getValues('featuredProductIds').length < 8) {
        appendProduct(id);
    } else {
        toast({ variant: 'destructive', title: "Limit reached", description: "You can only feature up to 8 products."});
    }
  };
  
  const handleAddCategory = (id: string) => {
    if (form.getValues('featuredCategoryIds').length < 5) {
        appendCategory(id);
    } else {
        toast({ variant: 'destructive', title: "Limit reached", description: "You can only feature up to 5 categories."});
    }
  };

  const handleRemoveProduct = (id: string) => {
    const index = form.getValues('featuredProductIds').findIndex(pId => pId === id);
    if(index > -1) removeProduct(index);
  }

  const handleRemoveCategory = (id: string) => {
    const index = form.getValues('featuredCategoryIds').findIndex(cId => cId === id);
    if(index > -1) removeCategory(index);
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Home Page Controller</h1>
        <p className="text-muted-foreground">Select and order products and categories to display on the home page.</p>
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
                <CardDescription>Select up to 8 products to feature prominently. Drag to reorder.</CardDescription>
              </CardHeader>
              <CardContent>
                <Combobox
                    options={productOptions}
                    onChange={handleAddProduct}
                    placeholder="Add a product..."
                    searchPlaceholder="Search products..."
                    notFoundText="No products found."
                />
                <ReorderableList
                    items={selectedProducts}
                    onRemove={handleRemoveProduct}
                    onMove={(from, to) => moveProduct(from, to)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>Select up to 5 categories for the homepage grid. Drag to reorder.</CardDescription>
              </CardHeader>
              <CardContent>
                 <Combobox
                    options={categoryOptions}
                    onChange={handleAddCategory}
                    placeholder="Add a category..."
                    searchPlaceholder="Search categories..."
                    notFoundText="No categories found."
                />
                <ReorderableList
                    items={selectedCategories}
                    onRemove={handleRemoveCategory}
                    onMove={(from, to) => moveCategory(from, to)}
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
