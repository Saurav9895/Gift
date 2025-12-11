
"use client";

import { useProducts, SortOption } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/lib/categories';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PaginationControls } from '@/components/ui/pagination';

const PRODUCTS_PER_PAGE = 15;

export default function ProductsClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [currentPage, setCurrentPage] = useState(1);

  const { products, loading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  useEffect(() => {
    setSelectedCategory(searchParams.get('category'));
    setSearchTerm(searchParams.get('search') || '');
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchParams]);

  const handleCategorySelect = (categoryName: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryName) {
      params.set('category', categoryName);
    } else {
      params.delete('category');
    }
    params.delete('search'); // Clear search when changing category
    setSearchTerm('');
    router.push(`/products?${params.toString()}`);
  };
  
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }
        router.push(`/products?${params.toString()}`);
    }
  }

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(lowercasedSearch));
    }

    if (sortOption) {
        const [field, direction] = sortOption.split('-');
        filtered.sort((a, b) => {
            const valA = field === 'name' ? a.name : a.price;
            const valB = field === 'name' ? b.name : b.price;
            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }
    
    return filtered;
  }, [products, selectedCategory, searchTerm, sortOption]);


  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);

  return (
    <>
      {/* Category Filters */}
      <div className="space-y-6 mb-8">
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
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {loading 
          ? Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[250px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))
          : paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
        }
      </div>
      {!loading && paginatedProducts.length === 0 && (
        <div className="text-center col-span-full py-16">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      )}

      {!loading && filteredAndSortedProducts.length > PRODUCTS_PER_PAGE && (
        <div className="mt-12 flex justify-center">
            <PaginationControls 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
      )}
    </>
  );
}
