
import { Product } from '@/types';
import { collection, addDoc, getDocs, onSnapshot, doc, getDoc, query, where, limit, updateDoc, deleteDoc, orderBy, QueryConstraint } from 'firebase/firestore';
import { db } from './firebase';
import { useEffect, useState } from 'react';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const constraints: QueryConstraint[] = [];
    
    if (options?.category) {
        constraints.push(where('category', '==', options.category));
    }
    if (options?.sort) {
        const [field, direction] = options.sort.split('-');
        constraints.push(orderBy(field === 'name' ? 'name' : 'price', direction as 'asc' | 'desc'));
    }
    if (options?.limit) {
        constraints.push(limit(options.limit));
    }

    const q = query(productsCollection, ...constraints);

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        let productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        if (options?.search) {
            const searchTerm = options.search.toLowerCase();
            productsList = productsList.filter(p => p.name.toLowerCase().includes(searchTerm));
        }

        if (options?.excludeId) {
            productsList = productsList.filter(p => p.id !== options.excludeId);
        }

        setProducts(productsList);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [options?.category, options?.limit, options?.excludeId, options?.search, options?.sort]);

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
