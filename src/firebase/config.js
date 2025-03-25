import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBE5cGMk4WGYb9S_lpGVLPKGPMTZEx7T5Y",
  authDomain: "music-c0953.firebaseapp.com",
  projectId: "music-c0953",
  storageBucket: "music-c0953.firebasestorage.app",
  messagingSenderId: "753409674828",
  appId: "1:753409674828:web:c6c9b03b070f6614dc2ee9",
};

// Initialize Firebase
const firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore and Storage
const db = getFirestore(firebase_app);
const storage = getStorage(firebase_app);
const auth = getAuth(firebase_app);

// Set authentication persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Session persistence set to LOCAL"))
  .catch((error) => console.error("Failed to set session persistence:", error));

export { firebase_app, db, storage, auth };
export default firebase_app;
