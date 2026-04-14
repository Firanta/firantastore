// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqfI_t1UBgBpx2ebNmBbvdBZVdli6087c",
  authDomain: "firantastoree.firebaseapp.com",
  projectId: "firantastoree",
  storageBucket: "firantastoree.firebasestorage.app",
  messagingSenderId: "770796845603",
  appId: "1:770796845603:web:4f7d8c94a8680566d70f96",
  measurementId: "G-W4LEN9YRMM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);

// Set persistence to LOCAL so users stay logged in
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app, "us-central1");

// Export Firebase services for use throughout the app
export { app, analytics, auth, db, storage, functions };
