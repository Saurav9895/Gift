import { Category } from '@/types';
import { collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { useEffect, useState } from 'react';

const categoriesCollection = collection(db, 'categories');

export const addCategory = async (category: Omit<Category, 'id'>) => {
  try {
    const docRef = await addDoc(categoriesCollection, category);
    return docRef.id;
  } catch (error) {
    console.error('Error adding category: ', error);
    throw new Error('Failed to add category');
  }
};

export const getCategories = async (): Promise<Category[]> => {
  const querySnapshot = await getDocs(categoriesCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
};

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(categoriesCollection,
            (querySnapshot) => {
                const categoriesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
                setCategories(categoriesList);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching categories:", err);
                setError("Failed to fetch categories.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { categories, loading, error };
}
