
"use client";

import { useProduct, useProducts } from "@/lib/products";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-provider";
import { Loader2, ShoppingCart, Minus, Plus, Heart, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductReviews } from "@/components/ProductReviews";
import ProductCard from "@/components/ProductCard";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useWishlist } from "@/lib/wishlist-provider";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Tag, Package, Truck, Calendar } from 'lucide-react';

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const productId = typeof id === "string" ? id : "";
  const { product, loading, error } = useProduct(productId);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("S");
  
  const productImages = [
      product?.imageUrl,
      ...PlaceHolderImages.slice(0, 3).map(p => p.imageUrl)
  ].filter(Boolean) as string[];

  const [mainImage, setMainImage] = useState(productImages[0]);

  const { products: relatedProducts, loading: relatedLoading } = useProducts({
      category: product?.category,
      limit: 8,
      excludeId: productId,
  });
  
  const isWishlisted = isInWishlist(productId);

  if (loading) {
    return <ProductDetailSkeleton />;
  }
  
  if (!mainImage && product?.imageUrl) {
      setMainImage(product.imageUrl);
  }

  if (error || !product) {
    return <div className="container mx-auto py-20 text-center">{error || "Product not found."}</div>;
  }
  
  const handleAddToCart = () => {
    if (product) {
        addToCart(product, quantity);
    }
  }

  return (
    <>
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="bg-card rounded-lg overflow-hidden border">
            <div className="aspect-square relative">
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                className={cn(
                  "aspect-square relative rounded-md overflow-hidden border-2",
                  mainImage === img ? "border-primary" : "border-transparent"
                )}
                onClick={() => setMainImage(img)}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <p className="text-sm text-muted-foreground mb-1 capitalize">{product.category}</p>
          <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">{product.name}</h1>
          <p className="text-3xl font-semibold text-foreground mb-4">${product.price.toFixed(2)}</p>
          
          <div className="flex items-center text-sm text-muted-foreground mb-6">
              <Clock className="h-4 w-4 mr-2"/>
              <span>Order in the next <b>30 minutes</b> to get next-day delivery.</span>
          </div>

          {/* Size Selector */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Select Size</p>
            <div className="flex gap-2">
                {SIZES.map(size => (
                    <Button 
                        key={size} 
                        variant={selectedSize === size ? 'default' : 'outline'}
                        onClick={() => setSelectedSize(size)}
                        className="w-12 h-12"
                    >
                        {size}
                    </Button>
                ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
             <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5"/>
                Add to Cart
            </Button>
             <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => toggleWishlist(product)}>
                <Heart className={cn("h-5 w-5", isWishlisted ? "fill-primary text-primary" : "")}/>
            </Button>
          </div>

          <Accordion type="single" collapsible defaultValue="description" className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger>Description & Fit</AccordionTrigger>
              <AccordionContent className="prose prose-sm text-muted-foreground">
                {product.longDescription}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                        <Tag className="h-5 w-5 text-muted-foreground"/>
                        <div>
                            <p className="font-medium">Discount</p>
                            <p className="text-muted-foreground">Up to 50%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-muted-foreground"/>
                        <div>
                            <p className="font-medium">Package</p>
                            <p className="text-muted-foreground">Regular</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-muted-foreground"/>
                        <div>
                            <p className="font-medium">Delivery Time</p>
                            <p className="text-muted-foreground">3-4 Days</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground"/>
                        <div>
                            <p className="font-medium">Estimated Arrival</p>
                            <p className="text-muted-foreground">10-12 Oct 2024</p>
                        </div>
                    </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
       <Separator className="my-16" />
       <ProductReviews productId={productId} />
    </div>
    
    {!relatedLoading && relatedProducts.length > 0 && (
         <div className="bg-muted/20">
            <div className="container mx-auto px-4 py-16">
                 <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                    >
                    <header className="flex justify-between items-end mb-8">
                        <h2 className="text-3xl font-headline font-bold">You May Also Like</h2>
                        <div className="hidden md:flex gap-2">
                            <CarouselPrevious className="static translate-y-0" />
                            <CarouselNext className="static translate-y-0" />
                        </div>
                    </header>
                    <CarouselContent>
                        {relatedProducts.map(p => (
                            <CarouselItem key={p.id} className="md:basis-1/2 lg:basis-1/4 xl:basis-1/5">
                                <div className="p-1">
                                    <ProductCard product={p} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex md:hidden gap-2 mt-4 justify-center">
                        <CarouselPrevious />
                        <CarouselNext />
                    </div>
                </Carousel>
            </div>
         </div>
    )}
   </>
  );
}


function ProductDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="grid grid-cols-4 gap-4">
                    <Skeleton className="aspect-square w-full rounded-md" />
                    <Skeleton className="aspect-square w-full rounded-md" />
                    <Skeleton className="aspect-square w-full rounded-md" />
                    <Skeleton className="aspect-square w-full rounded-md" />
                </div>
              </div>
                <div className="space-y-6">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-5 w-5/6" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    )
}
