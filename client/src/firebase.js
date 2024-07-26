// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// dotenv.config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
  
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "first-6d6e4.firebaseapp.com",
  projectId: "first-6d6e4",
  storageBucket: "first-6d6e4.appspot.com",
  messagingSenderId: "61967086299",
  appId: "1:61967086299:web:8de0c156d70deb34b912fe"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);