import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCPcusGF688cdWZofoz1INQbH4HbpnSn6Y",
  authDomain: "ytt-platform.firebaseapp.com",
  projectId: "ytt-platform",
  storageBucket: "ytt-platform.firebasestorage.app",
  messagingSenderId: "614721583761",
  appId: "1:614721583761:web:a6356af006743343445d30",
  measurementId: "G-C20ZCX8EFT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async () => {
  try {
    // Try popup first, fallback to redirect if CORS issues
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, error: null };
    } catch (popupError: any) {
      // If popup blocked by CORS, the error will be caught here
      // User can still authenticate, just won't see the popup close
      if (popupError.code === 'auth/popup-closed-by-user') {
        return { user: null, error: 'Popup kapatıldı. Lütfen tekrar deneyin.' };
      }
      // For other errors, re-throw
      throw popupError;
    }
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export type { FirebaseUser };

