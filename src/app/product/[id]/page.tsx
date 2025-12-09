
"use client";

import { useProduct } from "@/lib/products";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-provider";
import { Loader2, ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = typeof id === "string" ? id : "";
  const { product, loading, error } = useProduct(productId);
  const { addToCart } = useCart();

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return <div className="container mx-auto py-20 text-center">{error || "Product not found."}</div>;
  }

  const hasDiscount = product.discountedPrice < product.originalPrice;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="bg-card rounded-lg overflow-hidden border">
           <div className="aspect-square relative">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
           </div>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">{product.name}</h1>
          <p className="text-muted-foreground text-lg mb-6">{product.description}</p>
          
          <div className="flex items-baseline gap-4 mb-6">
            {hasDiscount && (
                <p className="text-3xl font-semibold text-primary">${product.discountedPrice.toFixed(2)}</p>
            )}
            <p className={cn("text-2xl font-medium", hasDiscount ? "text-muted-foreground line-through" : "text-primary")}>
                ${product.originalPrice.toFixed(2)}
            </p>
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex items-center gap-4">
            <Button size="lg" onClick={() => addToCart(product)}>
                <ShoppingCart className="mr-2 h-5 w-5"/>
                Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


function ProductDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="space-y-6">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                    <Skeleton className="h-12 w-1/2" />
                    <Skeleton className="h-12 w-1/3" />
                </div>
            </div>
        </div>
    )
}
