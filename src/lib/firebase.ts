import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCJuMDWG0DH2un-yDbXrCeZEWodEtctvzs",
  authDomain: "test-260d3.firebaseapp.com",
  projectId: "test-260d3",
  storageBucket: "test-260d3.appspot.com",
  messagingSenderId: "544668026132",
  appId: "1:544668026132:web:5977ae2e49f469933b6e01",
  measurementId: "G-S5QGTH4Q4P"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

if (typeof window !== 'undefined') {
    isSupported().then(supported => {
      if (supported) {
        getAnalytics(app);
      }
    });
    
    try {
        enableIndexedDbPersistence(db)
    } catch (err: any) {
        if (err.code == 'failed-precondition') {
            console.warn('Firebase: Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
            console.warn('Firebase: The current browser does not support all of the features required to enable persistence.');
        }
    }
}

export { app, auth, db, storage };
