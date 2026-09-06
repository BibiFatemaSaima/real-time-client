// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABiYVomq1UJCcZzLPOYD-BmZ5RBqhPxJg",
  authDomain: "real-time-collaborative-d19cd.firebaseapp.com",
  projectId: "real-time-collaborative-d19cd",
  storageBucket: "real-time-collaborative-d19cd.firebasestorage.app",
  messagingSenderId: "648558290728",
  appId: "1:648558290728:web:f98ca7f5828ea426e4921d",
  measurementId: "G-MD3WYGVVFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);