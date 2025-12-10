
"use client";

import Image from "next/image";
import type { Product } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/lib/cart-provider";
import { useWishlist } from "@/lib/wishlist-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useReviews } from "@/lib/reviews";
import { Badge } from "./ui/badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { reviews } = useReviews(product.id);

  const isWishlisted = isInWishlist(product.id);
  const hasDiscount = product.discountedPrice < product.originalPrice;

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;


  return (
    <Card className="w-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <Link href={`/product/${product.id}`} className="flex-grow flex flex-col">
        <CardHeader className="p-0">
          <div className="aspect-video relative">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
             <div className="absolute top-2 right-2 flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/70 hover:bg-background rounded-full" onClick={(e) => { e.preventDefault(); toggleWishlist(product)}}>
                    <Heart className={cn("h-4 w-4", isWishlisted ? "fill-primary text-primary" : "text-muted-foreground")} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/70 hover:bg-background rounded-full" onClick={(e) => {e.preventDefault(); addToCart(product, 1)}}>
                    <ShoppingCart className="h-4 w-4" />
                </Button>
            </div>
             {hasDiscount && (
                <Badge variant="destructive" className="absolute top-2 left-2">SALE</Badge>
             )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <h2 className="text-lg font-headline font-semibold mb-1 line-clamp-1">{product.name}</h2>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 flex justify-between items-center">
        <div className="flex items-baseline gap-2">
            <p className="text-lg font-semibold text-primary">{product.price.toFixed(2)} Rs</p>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-primary fill-primary"/>
            <span>{averageRating.toFixed(1)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
