
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2WSRP9gqf3KqhePKRkAWmpRaLzU9CT2A",
  authDomain: "food-waste-management-f2755.firebaseapp.com",
  projectId: "food-waste-management-f2755",
  storageBucket: "food-waste-management-f2755.firebasestorage.app",
  messagingSenderId: "443297759708",
  appId: "1:443297759708:web:2fffafb5801b99b8c30f19",
  measurementId: "G-9N8K562YFX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
