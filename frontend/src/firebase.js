import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDGbIO8LBDMUXBq1PEYiPtVJCz2j6ue6ds",
  authDomain: "e-commerce-53aab.firebaseapp.com",
    storageBucket: "e-commerce-53aab.firebasestorage.app",
  projectId: "e-commerce-53aab",
    messagingSenderId: "425962201104",
   appId: "1:425962201104:web:25d708e06b3fc131d8ea95",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);