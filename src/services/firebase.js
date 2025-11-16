// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyDiBf7qD83vZ8-hRz_Pv0H-9zjOA-6Vhs0",
  authDomain: "farmsync-cb0de.firebaseapp.com",
  projectId: "farmsync-cb0de",
  storageBucket: "farmsync-cb0de.appspot.com",
  messagingSenderId: "571208113570",
  appId: "1:571208113570:web:8a7195103d1832ed6b26fb",
  measurementId: "G-GBV01CLHSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services you need
export const auth = getAuth(app);       // For login/signup
export const db = getFirestore(app);    // For database if needed

export default app;
