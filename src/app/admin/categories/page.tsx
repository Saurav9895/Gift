
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
import { useCategories, deleteCategory, duplicateCategory } from "@/lib/categories";
import { useProducts } from "@/lib/products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const getProductCount = (categoryName: string) => {
    if (productsLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    return products.filter(p => p.category.toLowerCase() === categoryName.toLowerCase()).length;
  }
  
  const isLoading = categoriesLoading || productsLoading;
  const error = categoriesError || productsError;

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
        await deleteCategory(categoryToDelete.id);
        toast({
            title: "Category Deleted",
            description: `"${categoryToDelete.name}" has been successfully deleted.`,
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete category.",
        });
    } finally {
        setIsDeleting(false);
        setCategoryToDelete(null);
    }
  };

  const handleDuplicate = async (category: Category) => {
    try {
        await duplicateCategory(category);
        toast({
            title: "Category Duplicated",
            description: `A copy of "${category.name}" has been created.`,
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to duplicate category.",
        });
    }
  };


  return (
    <>
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Categories</h1>
          <p className="text-muted-foreground">Organize your products into categories.</p>
        </div>
        <Button asChild>
          <Link href="/admin/add-category">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </header>
      
       {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && <div className="text-center text-destructive">{error}</div>}

      {!isLoading && !error && (
        <div className="bg-card rounded-lg border">
          <Table>
              <TableHeader>
                  <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Category Name</TableHead>
                      <TableHead className="text-right">Product Count</TableHead>
                      <TableHead className="w-[50px] text-right">Actions</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {categories.map((category) => (
                      <TableRow key={category.id}>
                           <TableCell>
                              {category.imageUrl && (
                                  <Image
                                      src={category.imageUrl}
                                      alt={category.name}
                                      width={48}
                                      height={48}
                                      className="rounded-md object-cover"
                                  />
                              )}
                          </TableCell>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell className="text-right">
                              <Badge variant="secondary">{getProductCount(category.name)}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Actions</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/admin/categories/edit/${category.id}`}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDuplicate(category)}>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                     <DropdownMenuItem className="text-destructive" onClick={() => setCategoryToDelete(category)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                      </TableRow>
                  ))}
              </TableBody>
          </Table>
        </div>
      )}
    </div>
    <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the category
                &quot;{categoryToDelete?.name}&quot; and may affect products in this category.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
