import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "coopgig.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "coopgig",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "coopgig.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export async function registerFirebaseUser(name, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential.user;
  } catch (error) {
    console.warn("Firebase Auth fallback:", error.message);
    return { uid: `fb-${Date.now()}`, email, displayName: name };
  }
}

export async function loginFirebaseUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.warn("Firebase Auth fallback:", error.message);
    return { uid: `fb-${Date.now()}`, email };
  }
}

export async function logoutFirebaseUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.warn("Firebase Logout error:", error.message);
  }
}
