
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useCategories } from "@/lib/categories";
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
} from "@/components/ui/dropdown-menu";

export default function CategoriesPage() {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { products, loading: productsLoading, error: productsError } = useProducts();

  const getProductCount = (categoryName: string) => {
    if (productsLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    return products.filter(p => p.category.toLowerCase() === categoryName.toLowerCase()).length;
  }
  
  const isLoading = categoriesLoading || productsLoading;
  const error = categoriesError || productsError;

  return (
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
                                    <DropdownMenuItem>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                     <DropdownMenuItem className="text-destructive">
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
  );
}
