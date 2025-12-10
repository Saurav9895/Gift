
"use client";

import Image from "next/image";
import type { Product } from "@/types";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star, Expand } from "lucide-react";
import { useCart } from "@/lib/cart-provider";
import { useWishlist } from "@/lib/wishlist-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useReviews } from "@/lib/reviews";
import { Badge } from "@/components/ui/badge";

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

  const hasDiscount = product.originalPrice > product.discountedPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100) 
    : 0;

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 group border">
      <div className="relative aspect-[4/5] w-full">
        <Link href={`/product/${product.id}`} className="block h-full">
            <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
            />
        </Link>
        {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-green-600 text-white hover:bg-green-700">{discountPercentage}% off</Badge>
        )}
         <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/70 hover:bg-background rounded-full" onClick={(e) => { e.preventDefault(); toggleWishlist(product)}}>
                <Heart className={cn("h-4 w-4", isWishlisted ? "fill-primary text-primary" : "text-muted-foreground")} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/70 hover:bg-background rounded-full" onClick={(e) => {e.preventDefault(); addToCart(product, 1)}}>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div>
            <span className="text-xs text-muted-foreground capitalize">{product.category}</span>
            <h2 className="text-md font-semibold mb-1 line-clamp-1">{product.name}</h2>
             <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400"/>
                <span>{averageRating.toFixed(1)}</span>
                <span className="text-xs">({reviews.length})</span>
            </div>
        </div>
        <div>
            <div className="flex items-baseline gap-2">
                <p className="text-lg font-bold text-primary">${product.discountedPrice.toFixed(2)}</p>
                {hasDiscount && (
                    <p className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</p>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
