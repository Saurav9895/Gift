
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
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PaginationControls } from '@/components/ui/pagination';

const PRODUCTS_PER_PAGE = 15;

export default function AllProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [currentPage, setCurrentPage] = useState(1);

  const { products, loading } = useProducts({
    category: selectedCategory || undefined,
    search: searchTerm,
    sort: sortOption,
  });
  const { categories, loading: categoriesLoading } = useCategories();

  useEffect(() => {
    setSelectedCategory(searchParams.get('category'));
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const handleCategorySelect = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    const params = new URLSearchParams(searchParams);
    if (categoryName) {
      params.set('category', categoryName);
    } else {
      params.delete('category');
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

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
            {selectedCategory && (
                <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">{selectedCategory}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
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
                onClick={() => handleCategorySelect(null)}
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
                    onClick={() => handleCategorySelect(category.name)}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {loading 
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[250px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))
          : paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
        }
      </div>
      {!loading && products.length === 0 && (
        <div className="text-center col-span-full py-16">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      )}

      {!loading && products.length > PRODUCTS_PER_PAGE && (
        <div className="mt-12 flex justify-center">
            <PaginationControls 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
      )}
    </div>
  );
}
