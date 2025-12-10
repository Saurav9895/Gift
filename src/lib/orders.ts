
import { collection, addDoc, serverTimestamp, doc, getDoc, onSnapshot, query, where, Timestamp, collectionGroup } from 'firebase/firestore';
import { db } from './firebase';
import type { Order } from '@/types';
import { useState, useEffect } from 'react';

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    try {
        const orderPayload = {
            ...orderData,
            createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, 'users', orderData.userId, 'orders'), orderPayload);
        return docRef.id;
    } catch (error) {
        console.error("Error creating order: ", error);
        throw new Error("Failed to create order");
    }
};

export const useOrder = (userId: string | undefined, orderId: string) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId || !orderId) {
            setLoading(false);
            return;
        }

        const docRef = doc(db, 'users', userId, 'orders', orderId);
        const unsubscribe = onSnapshot(docRef, 
            (docSnap) => {
                if (docSnap.exists()) {
                    setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
                } else {
                    setError("Order not found.");
                }
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching order:", err);
                setError("Failed to fetch order.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId, orderId]);

    return { order, loading, error };
};

export const useOrders = (userId?: string) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            setOrders([]);
            return;
        }

        const ordersCollection = collection(db, 'users', userId, 'orders');
        const q = query(ordersCollection);

        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
                const ordersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                setOrders(ordersList);
                setLoading(false);
            },
            (err) => {
                console.error(`Error fetching orders for user ${userId}:`, err);
                setError("Failed to fetch orders.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    return { orders, loading, error };
};

export const useAdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ordersQuery = query(collectionGroup(db, 'orders'));
        const unsubscribe = onSnapshot(ordersQuery,
            (querySnapshot) => {
                const ordersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
                setOrders(ordersList);
                setLoading(false);
            },
            (err) => {
                console.error(`Error fetching all orders:`, err);
                setError("Failed to fetch all orders.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { orders, loading, error };
}
