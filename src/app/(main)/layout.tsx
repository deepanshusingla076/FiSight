'use client';

import { ClientLayoutWrapper } from '@/components/layout/client-layout-wrapper';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ProfileOnboardingGate } from '@/components/profile/profile-onboarding-gate';
import { useAuth } from '@/contexts/auth-context';
import {
  ProfileContext,
  defaultProfile,
  normalizeProfile,
  type UserProfile,
} from '@/hooks/use-profile';
import {
  loadUserProfileFast,
  saveProfileToLocal,
  saveProfileToCloud,
  syncProfileFromCloud,
} from '@/lib/profile-storage';
import { useState, useEffect, ReactNode, useCallback, useRef } from 'react';

const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfileState] = useState<UserProfile>(defaultProfile);
  const [profileReady, setProfileReady] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const syncedUidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setProfileState(defaultProfile);
      setProfileReady(false);
      syncedUidRef.current = null;
      return;
    }

    const uid = user.uid;
    const local = loadUserProfileFast(uid);
    setProfileState(local ? normalizeProfile(local) : defaultProfile);
    setProfileReady(true);

    if (syncedUidRef.current !== uid) {
      syncedUidRef.current = uid;
      syncProfileFromCloud(uid, (cloud) => {
        setProfileState(normalizeProfile(cloud));
      });
    }
  }, [user?.uid]);

  const setProfile = useCallback(
    (newProfile: UserProfile) => {
      const normalized = normalizeProfile(newProfile);
      setProfileState(normalized);

      if (!user?.uid) return;

      saveProfileToLocal(user.uid, normalized);
      setProfileSaving(true);
      saveProfileToCloud(user.uid, normalized).finally(() => setProfileSaving(false));
    },
    [user?.uid]
  );

  return (
    <ProfileContext.Provider value={{ profile, setProfile, profileReady, profileSaving }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <ProfileProvider>
        <ProfileOnboardingGate>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </ProfileOnboardingGate>
      </ProfileProvider>
    </ProtectedRoute>
  );
}
