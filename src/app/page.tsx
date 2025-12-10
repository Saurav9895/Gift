
"use client";

import { useProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/layout/HeroBanner';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function Home() {
  const { products, loading } = useProducts({ limit: 8 });

  return (
    <>
      <HeroBanner />
      <div className="container mx-auto px-4 py-16">
        <header className="flex justify-between items-end mb-12">
            <div>
                 <p className="text-sm font-bold text-primary mb-2">SPECIAL DISHES</p>
                 <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground leading-tight">
                    Standout Dishes<br/>From Our Menu
                </h2>
            </div>
        </header>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {loading 
              ? Array.from({ length: 8 }).map((_, i) => (
                  <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <div className="p-1">
                      <div className="flex flex-col space-y-3">
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                      </div>
                    </div>
                  </CarouselItem>
                ))
              : products.map((product) => (
                  <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                     <div className="p-1">
                        <ProductCard product={product} />
                     </div>
                  </CarouselItem>
                ))
            }
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="absolute top-[-5rem] right-16" />
            <CarouselNext className="absolute top-[-5rem] right-4" />
          </div>
        </Carousel>
         <div className="text-center mt-16">
          <Button asChild size="lg">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
