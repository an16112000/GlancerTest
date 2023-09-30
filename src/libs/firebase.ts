import { type FirebaseOptions, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const config: FirebaseOptions = {
  apiKey: "AIzaSyAow1d_-BVKjb5jEPBC10pdLFX5CZSfJ88",
  authDomain: "glancer-2a74b.firebaseapp.com",
  projectId: "glancer-2a74b",
  storageBucket: "glancer-2a74b.appspot.com",
  messagingSenderId: "822451101384",
  appId: "1:822451101384:web:79bda51e5e2ac160cc4ffd",
  measurementId: "G-0LFTYDBKL9",
};

const app = initializeApp(config);

export const storage = getStorage(app);
export const db = getFirestore(app);
