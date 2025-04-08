import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDmeIkdsnCOazWVLYFRxZ05c_QxoleSlbE",
  authDomain: "athletes-d7be9.firebaseapp.com",
  projectId: "athletes-d7be9",
  storageBucket: "athletes-d7be9.firebasestorage.app",
  messagingSenderId: "458245853947",
  appId: "1:458245853947:web:72c88c27937c31c9ab565e",
  measurementId: "G-PEPEH8Y80D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
