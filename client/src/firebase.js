// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "judithouse-31b6c.firebaseapp.com",
  projectId: "judithouse-31b6c",
  storageBucket: "judithouse-31b6c.appspot.com",
  messagingSenderId: "198984161603",
  appId: "1:198984161603:web:499a9e603b3d4c263677f6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);