// Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

/* 
🔥 FIREBASE SETUP REQUIRED 🔥

To get your Firebase configuration:
1. Go to https://console.firebase.google.com/project/video-quizz/settings/general
2. Scroll down to "Your apps" section
3. Click on the web app (</>) or create one if none exists
4. Copy the firebaseConfig object values
5. Replace the placeholder values below

Required values:
- apiKey: Your Firebase Web API key
- messagingSenderId: Your project's sender ID  
- appId: Your Firebase app ID

The project appears to be "video-quizz" based on existing code.
*/

// Firebase configuration object
// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDR9aRD07pliV-6NkhmNIrT70u9ZzslV9M", // Get from Firebase Console
  authDomain: "video-quizz.firebaseapp.com",
  projectId: "video-quizz",
  storageBucket: "video-quizz.firebasestorage.app",
  messagingSenderId: "864046349433", // Get from Firebase Console
  appId: "video-quizz-id" // Get from Firebase Console
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export app for any additional configuration
export default app;
