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
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters." }),
});

export default function AddCategoryPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

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
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
            <Link href="/admin/categories">
                <ArrowLeft className="mr-2 h-4 w-4"/>
                Back to Categories
            </Link>
        </Button>
      </div>
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
              <Button type="submit">Add Category</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
