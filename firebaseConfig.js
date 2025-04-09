import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDmeIkdsnCOazWVLYFRxZ05c_QxoleSlbE",
  authDomain: "athletes-d7be9.firebaseapp.com",
  projectId: "athletes-d7be9",
  storageBucket: "athletes-d7be9.appspot.com", //firebasestorage.app
  messagingSenderId: "458245853947",
  appId: "1:458245853947:web:72c88c27937c31c9ab565e",
  measurementId: "G-PEPEH8Y80D",
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);

// Initialise Firebase Services
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
