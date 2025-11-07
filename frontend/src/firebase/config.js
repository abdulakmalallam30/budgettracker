// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_-1xzh2ONq0NN6QA_FnCvtLLzzTmWew8",
  authDomain: "finance-c613e.firebaseapp.com",
  projectId: "finance-c613e",
  storageBucket: "finance-c613e.firebasestorage.app",
  messagingSenderId: "449481840315",
  appId: "1:449481840315:web:40192d242c6e6d60b73b9e",
  measurementId: "G-VCHL471S7P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;