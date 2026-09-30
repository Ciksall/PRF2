import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  getDocs,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { PRFItem } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Must pass firebaseConfig.firestoreDatabaseId as per skill directive
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standard operation types for error handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Global Firestore Error Handler as specified in Skill
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test as required by skill
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
// Run connection test on module load
testConnection();

// Firestore PRF Collection path
const PRF_COLLECTION = 'prf_items';

/**
 * Realtime listener for PRF records
 */
export function subscribeToPrfs(
  onSuccess: (items: PRFItem[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, PRF_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: PRFItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as PRFItem);
      });
      // Sort by creation date descending
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onSuccess(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, PRF_COLLECTION);
      } catch (e) {
        if (onError && e instanceof Error) {
          onError(e);
        }
      }
    }
  );
}

/**
 * Add or overwrite a PRF item in Firestore
 */
export async function savePrfToFirestore(prf: PRFItem): Promise<void> {
  const docRef = doc(db, PRF_COLLECTION, prf.id);
  try {
    await setDoc(docRef, prf);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PRF_COLLECTION}/${prf.id}`);
  }
}

/**
 * Update partial fields of a PRF item
 */
export async function updatePrfInFirestore(prfId: string, updates: Partial<PRFItem>): Promise<void> {
  const docRef = doc(db, PRF_COLLECTION, prfId);
  try {
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PRF_COLLECTION}/${prfId}`);
  }
}

/**
 * Seed initial sample PRF data into Firestore if empty
 */
export async function seedPrfDataIfEmpty(initialData: PRFItem[]): Promise<void> {
  try {
    const colRef = collection(db, PRF_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty && initialData.length > 0) {
      console.log('Seeding initial PRF data to Firestore...');
      for (const item of initialData) {
        await setDoc(doc(db, PRF_COLLECTION, item.id), item);
      }
      console.log('Seeding completed.');
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, PRF_COLLECTION);
  }
}

/**
 * Auth helper - Sign in with Google Popup
 */
export async function signInWithGoogleAuth(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

/**
 * Auth helper - Sign out
 */
export async function signOutFromAuth(): Promise<void> {
  await signOut(auth);
}

/**
 * Auth state listener
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
