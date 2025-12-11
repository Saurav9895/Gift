

import { Product } from '@/types';
import { collection, addDoc, getDocs, onSnapshot, doc, getDoc, query, where, limit, updateDoc, deleteDoc, orderBy, QueryConstraint } from 'firebase/firestore';
import { db } from './firebase';
import { useEffect, useState, useMemo } from 'react';

const productsCollection = collection(db, 'products');

export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const docRef = await addDoc(productsCollection, product);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product: ', error);
    throw new Error('Failed to add product');
  }
};

export const duplicateProduct = async (product: Product) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...productData } = product;
        const newProduct = {
            ...productData,
            name: `${product.name} (Copy)`,
        };
        await addProduct(newProduct);
    } catch (error) {
        console.error('Error duplicating product: ', error);
        throw new Error('Failed to duplicate product');
    }
}

export const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, product);
    } catch (error) {
        console.error('Error updating product: ', error);
        throw new Error('Failed to update product');
    }
};

export const deleteProduct = async (id: string) => {
    try {
        const docRef = doc(db, 'products', id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting product: ', error);
        throw new Error('Failed to delete product');
    }
};

export const getProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(productsCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const getProductById = async (id: string): Promise<Product | null> => {
    try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Product;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        throw new Error("Failed to fetch product");
    }
};

export type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

export const useProducts = (options?: { category?: string; limit?: number; excludeId?: string; search?: string; sort?: SortOption }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(productsCollection);

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setAllProducts(productsList);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const products = useMemo(() => {
    let filteredProducts = [...allProducts];

    if (options?.category) {
        filteredProducts = filteredProducts.filter(p => p.category === options.category);
    }

    if (options?.search) {
        const searchTerm = options.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
    }
    
    if (options?.sort) {
        const [field, direction] = options.sort.split('-');
        filteredProducts.sort((a, b) => {
            const valA = field === 'name' ? a.name : a.price;
            const valB = field === 'name' ? b.name : b.price;
            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    if (options?.excludeId) {
        filteredProducts = filteredProducts.filter(p => p.id !== options.excludeId);
    }
    
    if (options?.limit) {
        return filteredProducts.slice(0, options.limit);
    }

    return filteredProducts;
  }, [allProducts, options]);

  return { products, loading, error };
}


export const useProduct = (id: string) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        };

        const docRef = doc(db, 'products', id);
        const unsubscribe = onSnapshot(docRef, 
            (docSnap) => {
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
                } else {
                    setError("Product not found.");
                }
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching product:", err);
                setError("Failed to fetch product.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [id]);

    return { product, loading, error };
};
