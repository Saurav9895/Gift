
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
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-provider";
import { useWishlist } from "@/lib/wishlist-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);
  const hasDiscount = product.discountedPrice < product.originalPrice;


  return (
    <Card className="w-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/product/${product.id}`} className="flex-grow flex flex-col">
        <CardHeader className="p-0">
          <div className="aspect-video relative">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <h2 className="text-lg font-headline font-semibold mb-1">{product.name}</h2>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 flex justify-between items-center">
        <div className="flex items-baseline gap-2">
            {hasDiscount && (
                <p className="text-lg font-semibold text-primary">${product.discountedPrice.toFixed(2)}</p>
            )}
             <p className={cn("font-medium", hasDiscount ? "text-sm text-muted-foreground line-through" : "text-lg text-primary")}>
                ${product.originalPrice.toFixed(2)}
            </p>
        </div>
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => toggleWishlist(product)}>
                <Heart className={cn("h-5 w-5", isWishlisted ? "fill-primary text-primary" : "text-muted-foreground")} />
                <span className="sr-only">Add to wishlist</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => addToCart(product)}>
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Add to cart</span>
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
