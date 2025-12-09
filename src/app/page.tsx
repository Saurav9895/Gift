"use client";

import { useProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/layout/HeroBanner';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { products, loading } = useProducts();

  return (
    <>
      <HeroBanner />
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
            Featured Gifts
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            Handpicked for you, by us.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading 
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[225px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
          }
        </div>
      </div>
    </>
  );
}
