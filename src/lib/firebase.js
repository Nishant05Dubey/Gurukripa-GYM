import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration
// For security, we use environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
// We wrap this in a try-catch to prevent the app from crashing if keys are missing
let app;
let auth;
let db;
let googleProvider;

try {
  // Only initialize if we have an API key (basic check)
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Enable Offline Persistence
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code == 'failed-precondition') {
        console.warn('Persistence failed: Multiple tabs open');
      } else if (err.code == 'unimplemented') {
        console.warn('Persistence not supported by browser');
      }
    });

    googleProvider = new GoogleAuthProvider();
    console.log("🔥 Firebase initialized successfully");
  } else {
    console.warn("⚠️ Firebase keys missing. App running in offline/local mode.");
  }
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
}

export { auth, db, googleProvider };
