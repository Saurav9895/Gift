
import { Address } from '@/types';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useEffect, useState } from 'react';

export const addAddress = async (userId: string, address: Omit<Address, 'id'>) => {
    try {
        const addressesCollection = collection(db, 'users', userId, 'addresses');
        const docRef = await addDoc(addressesCollection, address);
        return docRef.id;
    } catch (error) {
        console.error('Error adding address: ', error);
        throw new Error('Failed to add address');
    }
};

export const updateAddress = async (userId: string, addressId: string, address: Partial<Address>) => {
    try {
        const docRef = doc(db, 'users', userId, 'addresses', addressId);
        await updateDoc(docRef, address);
    } catch (error) {
        console.error('Error updating address: ', error);
        throw new Error('Failed to update address');
    }
};

export const deleteAddress = async (userId: string, addressId: string) => {
    try {
        const docRef = doc(db, 'users', userId, 'addresses', addressId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting address: ', error);
        throw new Error('Failed to delete address');
    }
}

export const useAddresses = (userId?: string) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setAddresses([]);
            setLoading(false);
            return;
        }

        const addressesCollection = collection(db, 'users', userId, 'addresses');
        const unsubscribe = onSnapshot(addressesCollection,
            (querySnapshot) => {
                const addressesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Address));
                setAddresses(addressesList);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching addresses:", err);
                setError("Failed to fetch addresses.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    return { addresses, loading, error };
}

    