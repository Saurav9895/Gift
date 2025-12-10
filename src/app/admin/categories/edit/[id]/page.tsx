
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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImageUploader } from "@/components/ImageUploader";
import { updateCategory } from "@/lib/categories";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Category } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters." }),
  imageUrl: z.string().url({ message: "Please provide a valid image URL." }),
});

export default function EditCategoryPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { id } = useParams();
  const categoryId = Array.isArray(id) ? id[0] : id;

  const [category, setCategory] = useState<Category | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", imageUrl: "" },
  });

  useEffect(() => {
    if (!categoryId) return;
    const fetchCategory = async () => {
        setPageLoading(true);
        const docRef = doc(db, "categories", categoryId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const catData = { id: docSnap.id, ...docSnap.data() } as Category;
            setCategory(catData);
            form.reset(catData);
        }
        setPageLoading(false);
    }
    fetchCategory();
  }, [categoryId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await updateCategory(categoryId, values);
      toast({
        title: "Category Updated",
        description: `Category "${values.name}" has been successfully updated.`,
      });
      router.push("/admin/categories");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update category.",
      });
    } finally {
        setIsLoading(false);
    }
  }

  if (pageLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
        </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Edit Category</h1>
        <p className="text-muted-foreground">Update the details for "{category?.name}".</p>
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
