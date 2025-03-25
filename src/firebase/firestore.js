import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Storage
import firebase_app from "./config";

// Initialize Firestore
const db = getFirestore(firebase_app);

// Initialize Storage
const storage = getStorage(firebase_app);

export { db, storage }; // Export Storage
