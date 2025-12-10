
"use client";

import Image from "next/image";
import type { Product } from "@/types";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/lib/cart-provider";
import { useWishlist } from "@/lib/wishlist-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useReviews } from "@/lib/reviews";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { reviews } = useReviews(product.id);

  const isWishlisted = isInWishlist(product.id);
  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <Card className="w-full overflow-visible transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group border">
       <div className="relative">
            <Button size="icon" className="absolute top-0 right-4 h-12 w-12 rounded-b-lg rounded-t-none bg-primary z-10" onClick={(e) => {e.preventDefault(); addToCart(product, 1)}}>
                <ShoppingCart className="h-5 w-5" />
            </Button>
             <Button variant="ghost" size="icon" className="absolute top-2 left-2 h-8 w-8 bg-background/70 hover:bg-background rounded-full z-10" onClick={(e) => { e.preventDefault(); toggleWishlist(product)}}>
                <Heart className={cn("h-4 w-4", isWishlisted ? "fill-primary text-primary" : "text-muted-foreground")} />
            </Button>
            <Link href={`/product/${product.id}`} className="block">
                <CardContent className="p-6 pt-12 text-center">
                    <div className="aspect-square relative w-40 h-40 mx-auto mb-4">
                        {product.imageUrl && (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        )}
                    </div>
                    <h2 className="text-lg font-headline font-bold mb-1 line-clamp-1">{product.name}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-1">{product.shortDescription}</p>

                    <div className="flex justify-between items-center mt-4">
                        <p className="text-lg font-semibold text-primary">{product.price.toFixed(2)} Rs</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 text-primary fill-primary"/>
                            <span>{averageRating.toFixed(1)}</span>
                        </div>
                    </div>
                </CardContent>
            </Link>
       </div>
    </Card>
  );
}
