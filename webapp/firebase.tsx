// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAL99zZitiLzgJUmdQWR3yrabubIsHmJ04",
  authDomain: "assignment-6-unging2jeng.firebaseapp.com",
  projectId: "assignment-6-unging2jeng",
  storageBucket: "assignment-6-unging2jeng.firebasestorage.app",
  messagingSenderId: "948670458724",
  appId: "1:948670458724:web:812418d0186f5a211ae871",
  measurementId: "G-9LYBYK4LQ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);