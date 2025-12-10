
"use client";

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import type { StoreSettings } from '@/types';

export const useStoreSettings = () => {
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const docRef = doc(db, 'site-settings', 'store');
        const unsubscribe = onSnapshot(docRef, 
            (docSnap) => {
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as StoreSettings);
                } else {
                    // Initialize with default settings if none are found
                    setSettings({ 
                        deliveryFee: 10, 
                        freeDeliveryThreshold: 100,
                        promoCodes: [],
                        featuredProductIds: [],
                        featuredCategoryIds: [],
                    });
                }
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching store settings:", err);
                setError("Failed to fetch store settings.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { settings, loading, error };
};
