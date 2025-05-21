// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_LynsPS59R2WsgpM9DWlX9-tLIsI8WPI",
  authDomain: "assignment6-31c16.firebaseapp.com",
  projectId: "assignment6-31c16",
  storageBucket: "assignment6-31c16.firebasestorage.app",
  messagingSenderId: "636220126261",
  appId: "1:636220126261:web:b1a4d5c2fa89574af4ed7c",
  measurementId: "G-MDNQ5BP056"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);