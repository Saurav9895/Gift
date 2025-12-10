

'use client';

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
import { useCategories } from '@/lib/categories';
import Image from 'next/image';

function PopularCategories() {
  const { categories, loading: categoriesLoading } = useCategories();
  const isLoading = categoriesLoading;
  
  const mainCategory = categories[0];
  const sideCategories = categories.slice(1, 5);

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-12">
        <p className="text-sm font-bold text-primary mb-2">CUSTOMER FAVORITES</p>
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground leading-tight">
          Popular Categories
        </h2>
      </header>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[450px] md:h-[620px]">
        {isLoading ? (
           Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-full w-full rounded-lg"/>)
        ) : (
          <>
            {mainCategory && (
                 <Link href={`/products?category=${mainCategory.name}`} className="lg:col-span-2 col-span-1 md:row-span-2 group relative rounded-lg overflow-hidden">
                    <Image src={mainCategory.imageUrl} alt={mainCategory.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-2xl font-bold font-headline">{mainCategory.name}</h3>
                        <Button variant="secondary" className="mt-2" size="sm">Shop Now</Button>
                    </div>
                </Link>
            )}
            {sideCategories.map(category => (
                <Link href={`/products?category=${category.name}`} key={category.id} className="col-span-1 group relative rounded-lg overflow-hidden">
                    <Image src={category.imageUrl} alt={category.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg font-bold font-headline">{category.name}</h3>
                    </div>
                </Link>
            ))}
          </>
        )}
      </div>
    </div>
  )
}


export default function Home() {
  const { products, loading } = useProducts({ limit: 8 });

  return (
    <>
      <HeroBanner />
      <PopularCategories />
       <div className="container mx-auto px-4 py-16">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
           <header className="flex justify-between items-end mb-12">
              <div>
                  <p className="text-sm font-bold text-primary mb-2">FEATURED GIFTS</p>
                  <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground leading-tight">
                      Standout Gifts<br/>From Our Collection
                  </h2>
              </div>
              <div className="hidden md:flex gap-2">
                  <CarouselPrevious className="static translate-y-0" />
                  <CarouselNext className="static translate-y-0" />
              </div>
          </header>
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
           <div className="flex md:hidden gap-2 mt-4 justify-center">
              <CarouselPrevious />
              <CarouselNext />
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

