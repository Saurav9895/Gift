
"use client";

import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile } from '@/types';
import { useState, useEffect } from 'react';

export const useUsers = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const usersCollectionRef = collection(db, 'users');
        const unsubscribe = onSnapshot(usersCollectionRef,
            (querySnapshot) => {
                const usersList = querySnapshot.docs.map(doc => doc.data() as UserProfile);
                setUsers(usersList);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching users:", err);
                setError("Failed to fetch users.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { users, loading, error };
}

export const useUser = (userId?: string) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const userDocRef = doc(db, 'users', userId);
        const unsubscribe = onSnapshot(userDocRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setUser(docSnap.data() as UserProfile);
                } else {
                    setError("User not found.");
                }
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching user:", err);
                setError("Failed to fetch user.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    return { user, loading, error };
}
