"use client";

import Image from "next/image";
import type { Product } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-provider";
import { useWishlist } from "@/lib/wishlist-provider";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  return (
    <Card className="w-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
        <CardTitle className="text-lg font-headline mb-1">{product.name}</CardTitle>
        <CardDescription className="text-sm">{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="text-lg font-semibold text-primary">${product.price.toFixed(2)}</p>
        <div className="flex items-center gap-2">
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
