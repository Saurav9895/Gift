
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
import { Badge } from "@/components/ui/badge";

export default function CategoriesPage() {
  const categories = [...new Set(products.map(p => p.category))].map(category => ({
      name: category,
      productCount: products.filter(p => p.category === category).length
  }));

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
      
      <div className="bg-card rounded-lg border">
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Category Name</TableHead>
                    <TableHead className="text-right">Product Count</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((category) => (
                    <TableRow key={category.name}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right">
                            <Badge variant="secondary">{category.productCount}</Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>
    </div>
  );
}
