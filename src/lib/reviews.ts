
import { Review } from '@/types';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { useState, useEffect } from 'react';

export const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
    try {
        const reviewData = {
            ...review,
            createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, 'products', review.productId, 'reviews'), reviewData);
        return docRef.id;
    } catch (error) {
        console.error("Error adding review: ", error);
        throw new Error("Failed to add review");
    }
};

export const useReviews = (productId: string) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!productId) {
            setLoading(false);
            setReviews([]);
            return;
        }

        const reviewsCollection = collection(db, 'products', productId, 'reviews');
        const q = query(reviewsCollection);

        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
                const reviewsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
                setReviews(reviewsList);
                setLoading(false);
            },
            (err) => {
                console.error(`Error fetching reviews for product ${productId}:`, err);
                setError("Failed to fetch reviews.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [productId]);

    return { reviews, loading, error };
};
