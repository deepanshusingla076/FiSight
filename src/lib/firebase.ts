// Firebase — auth at startup; Firestore only when profile sync runs (avoids offline init noise)
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

let firestoreDb: Firestore | null = null;

/** Lazy Firestore — not created until cloud profile read/write */
export async function getFirestoreDb(): Promise<Firestore> {
  if (!firestoreDb) {
    const { getFirestore } = await import('firebase/firestore');
    firestoreDb = getFirestore(app);
  }
  return firestoreDb;
}

export default app;
