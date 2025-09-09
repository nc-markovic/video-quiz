// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Your Firebase configuration object
// Replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyDR9aRD07pliV-6NkhmNIrT70u9ZzslV9M",
  authDomain: "video-quizz.firebaseapp.com",
  projectId: "video-quizz",
  storageBucket: "video-quizz.firebasestorage.app",
  messagingSenderId: "864046349433",
  appId: "1:864046349433:web:12542a0136845c2590e8a8",
  measurementId: "G-PZD2J256V4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export the app instance
export default app;
