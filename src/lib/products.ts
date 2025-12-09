import { Product } from '@/types';
import { collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore';
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

export const getProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(productsCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(productsCollection, 
      (querySnapshot) => {
        const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
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
  }, []);

  return { products, loading, error };
}
