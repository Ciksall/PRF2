import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  getDoc,
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

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'staff' | 'manager' | 'hod' | 'finance' | 'admin';
  deptSection?: string;
  staffId?: string;
  createdAt: string;
  lastLoginAt: string;
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
testConnection();

// Firestore Collections
const PRF_COLLECTION = 'prf_items';
const USERS_COLLECTION = 'users';

/**
 * Save user profile in Firestore
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, profile.uid);
  try {
    await setDoc(docRef, profile, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${USERS_COLLECTION}/${profile.uid}`);
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${USERS_COLLECTION}/${uid}`);
    return null;
  }
}

/**
 * Sign up with Email and Password
 */
export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName: string,
  role: 'staff' | 'manager' | 'hod' | 'finance' | 'admin' = 'staff',
  deptSection: string = 'HUMAN RESOURCES',
  staffId: string = ''
): Promise<UserProfile> {
  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(credential.user, { displayName });

  const profile: UserProfile = {
    uid: credential.user.uid,
    email: credential.user.email || email,
    displayName: displayName || email.split('@')[0],
    role,
    deptSection,
    staffId: staffId || `MP-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  await saveUserProfile(profile);
  return profile;
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(email: string, pass: string): Promise<UserProfile> {
  const credential = await signInWithEmailAndPassword(auth, email, pass);
  const uid = credential.user.uid;
  let profile = await getUserProfile(uid);

  if (!profile) {
    profile = {
      uid,
      email: credential.user.email || email,
      displayName: credential.user.displayName || email.split('@')[0],
      role: 'staff',
      deptSection: 'HUMAN RESOURCES',
      staffId: `MP-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    await saveUserProfile(profile);
  } else {
    await saveUserProfile({ ...profile, lastLoginAt: new Date().toISOString() });
  }

  return profile;
}

/**
 * Auth helper - Sign in with Google Popup
 */
export async function signInWithGoogleAuth(): Promise<{ user: User; profile: UserProfile }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    let profile = await getUserProfile(user.uid);

    if (!profile) {
      profile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Staff Member',
        role: 'staff',
        deptSection: 'HUMAN RESOURCES',
        staffId: `MP-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      await saveUserProfile(profile);
    } else {
      await saveUserProfile({ ...profile, lastLoginAt: new Date().toISOString() });
    }

    return { user, profile };
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

/**
 * Realtime listener for PRF records stored in Firebase
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
 * Update partial fields of a PRF item in Firestore
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
