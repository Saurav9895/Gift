
import { collection, onSnapshot } from 'firebase/firestore';
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
