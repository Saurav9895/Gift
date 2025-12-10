
"use client"

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/lib/products';
import { Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const { products, loading } = useProducts({ search: debouncedSearchTerm, limit: 5 });
    const router = useRouter();


    const showResults = isFocused && debouncedSearchTerm.length > 0;

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(searchTerm) {
            router.push(`/products?search=${searchTerm}`);
        }
    }

    return (
        <div className="relative w-full">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 bg-white p-2 rounded-lg shadow-lg">
                <Input 
                    type="text" 
                    placeholder="Search for gifts..." 
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow click on results
                />
                <Button type="submit" size="lg">
                    <SearchIcon className="mr-2 h-5 w-5" />
                    Search
                </Button>
            </form>
            {showResults && (
                <Card className="absolute top-full mt-2 w-full z-20">
                    <CardContent className="p-2">
                        {loading ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                        ) : products.length > 0 ? (
                            <ul className="space-y-1">
                                {products.map(product => (
                                    <li key={product.id}>
                                        <Link href={`/product/${product.id}`} className="flex items-center gap-4 p-2 rounded-md hover:bg-accent">
                                            <div className="relative h-10 w-10 flex-shrink-0 rounded-sm overflow-hidden border">
                                                <Image src={product.imageUrl} alt={product.name} fill className="object-cover"/>
                                            </div>
                                            <span className="text-sm font-medium text-foreground">{product.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">No results found.</div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
