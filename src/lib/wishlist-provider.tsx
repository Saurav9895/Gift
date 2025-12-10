
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '@/types';
import { useToast } from "@/hooks/use-toast"

interface WishlistContextType {
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { toast } = useToast();

   useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('wishlistItems');
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist));
      }
    } catch (error) {
      console.error("Failed to parse wishlist items from localStorage", error);
      setWishlistItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);


  const toggleWishlist = (product: Product) => {
    const itemExists = wishlistItems.some(item => item.id === product.id);

    if (itemExists) {
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== product.id));
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      setWishlistItems(prevItems => [...prevItems, product]);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  };
  
  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  }

  const wishlistCount = wishlistItems.length;

  const value = { wishlistItems, toggleWishlist, isInWishlist, wishlistCount };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
