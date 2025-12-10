
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
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

function PopularCategories() {
  const { categories, loading: categoriesLoading } = useCategories();
  const { products, loading: productsLoading } = useProducts();

  const getProductCount = (categoryName: string) => {
    if (productsLoading) return 0;
    return products.filter(p => p.category === categoryName).length;
  }

  const isLoading = categoriesLoading || productsLoading;

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-12">
        <p className="text-sm font-bold text-primary mb-2">CUSTOMER FAVORITES</p>
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground leading-tight">
          Popular Categories
        </h2>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
             <Card key={i} className="flex flex-col items-center justify-center p-6 text-center border-dashed">
                <Skeleton className="h-24 w-24 rounded-full mb-4"/>
                <Skeleton className="h-6 w-24 mb-2"/>
                <Skeleton className="h-4 w-16"/>
            </Card>
          ))
        ) : (
          <>
            {categories.slice(0, 3).map(category => (
               <Link href="/products" key={category.id}>
                <Card className="flex flex-col items-center justify-center p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
                    <div className="relative h-24 w-24 rounded-full mb-4 bg-secondary flex items-center justify-center overflow-hidden">
                      {category.imageUrl && (
                         <Image src={category.imageUrl} alt={category.name} width={60} height={60} className="object-contain transition-transform duration-300 group-hover:scale-110" />
                      )}
                    </div>
                    <h3 className="font-bold text-lg font-headline">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">({getProductCount(category.name)} items)</p>
                </Card>
              </Link>
            ))}
             <Link href="/products">
                <Card className="flex flex-col items-center justify-center p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group h-full bg-secondary/50 border-dashed">
                    <div className="relative h-24 w-24 rounded-full mb-4 bg-secondary flex items-center justify-center">
                       <ArrowRight className="h-8 w-8 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                    <h3 className="font-bold text-lg font-headline">View All</h3>
                    <p className="text-sm text-muted-foreground">({products.length} items)</p>
                </Card>
            </Link>
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
