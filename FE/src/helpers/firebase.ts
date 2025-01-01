import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
const firebaseConfig = {
  apiKey: "AIzaSyCf60mBDlRMqdcnHYcFHN6_O-idjQR4ZwE",
  authDomain: "project-management-f27b0.firebaseapp.com",
  projectId: "project-management-f27b0",
  storageBucket: "project-management-f27b0.appspot.com",
  messagingSenderId: "862928058480",
  appId: "1:862928058480:web:60afda1f06262215415cb5",
  measurementId: "G-027L9F0876",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const firebaseFunction = getFunctions(app);
export { auth, db, firebaseFunction };
