
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { products } from "@/lib/products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
  return (
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
      
      <div className="bg-card rounded-lg border">
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => {
                    const placeholder = PlaceHolderImages.find(p => p.id === product.imageId);
                    return (
                        <TableRow key={product.id}>
                            <TableCell>
                                {placeholder && (
                                    <Image
                                        src={placeholder.imageUrl}
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
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
