
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
import { useProducts, deleteProduct, duplicateProduct } from "@/lib/products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
import type { Product } from "@/types";

export default function ProductsPage() {
    const { products, loading, error } = useProducts();
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const handleDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        try {
            await deleteProduct(productToDelete.id);
            toast({
                title: "Product Deleted",
                description: `"${productToDelete.name}" has been successfully deleted.`,
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete product.",
            });
        } finally {
            setIsDeleting(false);
            setProductToDelete(null);
        }
    };
    
    const handleDuplicate = async (product: Product) => {
        try {
            await duplicateProduct(product);
            toast({
                title: "Product Duplicated",
                description: `A copy of "${product.name}" has been created.`,
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to duplicate product.",
            });
        }
    };


  return (
    <>
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Products</h1>
          <p className="text-muted-foreground">Manage all products in your store.</p>
        </div>
        <Button asChild>
          <Link href="/admin/add-product">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </header>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && <div className="text-center text-destructive">{error}</div>}
      
      {!loading && !error && (
        <div className="bg-card rounded-lg border">
          <Table>
              <TableHeader>
                  <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="w-[50px] text-right">Actions</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {products.map((product) => (
                      <TableRow key={product.id}>
                          <TableCell>
                              {product.imageUrl && (
                                  <Image
                                      src={product.imageUrl}
                                      alt={product.name}
                                      width={48}
                                      height={48}
                                      className="rounded-md object-cover"
                                  />
                              )}
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                              <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
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
                                      <Link href={`/admin/products/edit/${product.id}`}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                      </Link>
                                    </DropdownMenuItem>
                                     <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                     <DropdownMenuItem className="text-destructive" onClick={() => setProductToDelete(product)}>
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
    <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the product
                &quot;{productToDelete?.name}&quot;.
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
