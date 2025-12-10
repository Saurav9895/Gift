
"use client";

import { useProducts, SortOption } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useCategories } from '@/lib/categories';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Search, LayoutGrid, List } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function AllProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  
  const { products, loading } = useProducts({
    category: selectedCategory || undefined,
    search: searchTerm,
    sort: sortOption,
  });
  const { categories, loading: categoriesLoading } = useCategories();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-8">
         <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-4xl font-headline font-bold text-foreground mt-4">
          All Products
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Browse our entire collection of unique and thoughtful gifts.
        </p>
      </header>

      {/* Filters */}
      <div className="space-y-6 mb-8">
        {/* Category Filters */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Button
                variant={!selectedCategory ? 'secondary' : 'outline'}
                className="rounded-lg h-14 px-6"
                onClick={() => setSelectedCategory(null)}
            >
                All
            </Button>
          {categoriesLoading ? (
             Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-40 rounded-lg" />)
          ) : (
            categories.map(category => (
                <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? 'secondary' : 'outline'}
                    onClick={() => setSelectedCategory(category.name)}
                    className="rounded-lg flex items-center gap-3 h-14 whitespace-nowrap p-2 pr-4"
                >
                    <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                       {category.imageUrl && <Image src={category.imageUrl} alt={category.name} fill className="object-cover"/>}
                    </div>
                   <span className="text-base font-medium">{category.name}</span>
                </Button>
            ))
          )}
        </div>
        
        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 h-11" 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex items-center gap-4">
            <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                <SelectTrigger className="w-full md:w-[180px] h-11">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="name-asc">Name: A-Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z-A</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
            </Select>
             <div className="hidden md:flex items-center gap-1 bg-muted p-1 rounded-md">
                <Button variant="ghost" size="icon" className="bg-background shadow-sm h-9 w-9">
                    <LayoutGrid className="h-5 w-5"/>
                </Button>
                 <Button variant="ghost" size="icon" className="h-9 w-9">
                    <List className="h-5 w-5"/>
                </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading 
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[225px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
        }
      </div>
      {!loading && products.length === 0 && (
        <div className="text-center col-span-full py-16">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
