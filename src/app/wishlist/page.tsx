"use client";

import { useWishlist } from "@/lib/wishlist-provider";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlistItems, wishlistCount } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          My Wishlist
        </h1>
      </header>

      {wishlistCount === 0 ? (
        <div className="text-center py-20 bg-card rounded-lg border-dashed border-2">
          <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
          <Button asChild>
            <Link href="/">Discover Gifts</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
