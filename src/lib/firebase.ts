import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBd0teOb43XG9m03LaapUlOKgIDgBm5jVM",
  authDomain: "gifting-bb15d.firebaseapp.com",
  projectId: "gifting-bb15d",
  storageBucket: "gifting-bb15d.appspot.com",
  messagingSenderId: "520706551882",
  appId: "1:520706551882:web:eae5399e62309fad4476b3",
  measurementId: "G-8PDK5DFSL1"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

if (typeof window !== 'undefined') {
    try {
        enableIndexedDbPersistence(db)
    } catch (err: any) {
        if (err.code == 'failed-precondition') {
            console.warn('Firebase: Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
            console.warn('Firebase: The current browser does not support all of the features required to enable persistence.');
        }
    }
    isSupported().then(supported => {
      if (supported) {
        getAnalytics(app);
      }
    })
}

export { app, auth, db };
