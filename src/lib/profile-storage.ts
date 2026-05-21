import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';
import { normalizeProfile, type UserProfile } from '@/lib/user-profile';

const localKey = (uid: string) => `fisight_profile_${uid}`;

function isOfflineFirestoreError(error: unknown): boolean {
  const code = (error as { code?: string })?.code;
  const msg = error instanceof Error ? error.message : String(error);
  return (
    code === 'unavailable' ||
    code === 'failed-precondition' ||
    msg.includes('offline') ||
    msg.includes('client is offline') ||
    msg.includes('timeout')
  );
}

export function loadProfileFromLocal(uid: string): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(localKey(uid));
    if (!raw) {
      const legacy = window.localStorage.getItem('userProfile');
      if (legacy) return normalizeProfile(JSON.parse(legacy));
      return null;
    }
    return normalizeProfile(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveProfileToLocal(uid: string, profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  const normalized = normalizeProfile(profile);
  window.localStorage.setItem(localKey(uid), JSON.stringify(normalized));
  window.localStorage.setItem('userProfile', JSON.stringify(normalized));
}

export async function loadProfileFromCloud(uid: string): Promise<UserProfile | null> {
  try {
    const db = await getFirestoreDb();
    const ref = doc(db, 'users', uid, 'data', 'financialProfile');
    const snap = await Promise.race([
      getDoc(ref),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
    ]);
    if (!snap.exists()) return null;
    return normalizeProfile(snap.data() as Record<string, unknown>);
  } catch (error) {
    if (!isOfflineFirestoreError(error)) {
      console.warn('[FiSight] Cloud profile load skipped:', error);
    }
    return null;
  }
}

export async function saveProfileToCloud(uid: string, profile: UserProfile): Promise<void> {
  try {
    const db = await getFirestoreDb();
    const normalized = normalizeProfile(profile);
    const ref = doc(db, 'users', uid, 'data', 'financialProfile');
    
    // Add a 5 second timeout to prevent hanging if Firestore is unreachable/unprovisioned
    await Promise.race([
      setDoc(ref, { ...normalized, updatedAt: serverTimestamp() }, { merge: true }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
    ]);
  } catch (error) {
    if (!isOfflineFirestoreError(error)) {
      console.warn('[FiSight] Cloud profile save skipped:', error);
    }
  }
}

/** Fast path: local only (used on first paint) */
export function loadUserProfileFast(uid: string): UserProfile | null {
  return loadProfileFromLocal(uid);
}

/** Background cloud sync — never blocks UI */
export function syncProfileFromCloud(uid: string, onUpdate: (p: UserProfile) => void): void {
  loadProfileFromCloud(uid).then((cloud) => {
    if (cloud) onUpdate(cloud);
  });
}

export async function persistUserProfile(uid: string, profile: UserProfile): Promise<void> {
  saveProfileToLocal(uid, profile);
  await saveProfileToCloud(uid, profile);
}
