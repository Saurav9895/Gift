
"use client";

import { useProduct, useProducts } from "@/lib/products";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-provider";
import { Loader2, ShoppingCart, Minus, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProductReviews } from "@/components/ProductReviews";
import ProductCard from "@/components/ProductCard";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const productId = typeof id === "string" ? id : "";
  const { product, loading, error } = useProduct(productId);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { products: relatedProducts, loading: relatedLoading } = useProducts({
      category: product?.category,
      limit: 5,
      excludeId: productId,
  });

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return <div className="container mx-auto py-20 text-center">{error || "Product not found."}</div>;
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  }
  
  const handleAddToCart = () => {
    if (product) {
        addToCart(product, quantity);
    }
  }

  const handleBuyNow = () => {
    if (product) {
        addToCart(product, quantity);
        router.push('/cart');
    }
  }

  const hasDiscount = product.discountedPrice < product.originalPrice;

  return (
    <>
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
                onError={(e) => {
                  if (e.target instanceof HTMLImageElement) {
                    e.target.style.display = 'none';
                  }
                }}
              />
            )}
           </div>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">{product.name}</h1>
           <div className="mb-4">
              <Badge variant="outline" className="text-sm capitalize">{product.category}</Badge>
            </div>
          <p className="text-muted-foreground text-lg mb-6">{product.shortDescription}</p>
          
          <div className="flex items-baseline gap-4 mb-6">
            {hasDiscount && (
                <p className="text-3xl font-semibold text-primary">${product.discountedPrice.toFixed(2)}</p>
            )}
            <p className={cn("text-2xl font-medium", hasDiscount ? "text-muted-foreground line-through" : "text-primary")}>
                ${product.originalPrice.toFixed(2)}
            </p>
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4"/>
                </Button>
                <Input 
                    type="number" 
                    className="w-16 text-center" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                />
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                    <Plus className="h-4 w-4"/>
                </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="outline" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5"/>
                Add to Cart
            </Button>
            <Button size="lg" onClick={handleBuyNow}>
                Buy Now
            </Button>
          </div>
        </div>
      </div>
      
       <Separator className="my-16" />

        <div>
            <h3 className="text-2xl font-headline font-bold mb-4">About this Gift</h3>
            <div className="prose prose-lg max-w-none text-muted-foreground">
                 <p>{product.longDescription}</p>
            </div>
        </div>

       <Separator className="my-16" />

       <ProductReviews productId={productId} />

    </div>
    
    {!relatedLoading && relatedProducts.length > 0 && (
         <div className="bg-muted/50">
            <div className="container mx-auto px-4 py-16">
                 <h2 className="text-3xl font-headline font-bold text-center mb-8">You May Also Like</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                     {relatedProducts.map(p => (
                         <ProductCard key={p.id} product={p} />
                     ))}
                 </div>
            </div>
         </div>
    )}
   </>
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
