'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useProfile, isProfileComplete } from '@/hooks/use-profile';
import { Loader2 } from 'lucide-react';

export function ProfileOnboardingGate({ children }: { children: React.ReactNode }) {
  const { profile, profileReady } = useProfile();
  const pathname = usePathname();
  const router = useRouter();
  const complete = isProfileComplete(profile);
  const onProfilePage = pathname === '/profile';

  useEffect(() => {
    if (!profileReady || complete || onProfilePage) return;
    router.replace('/profile?onboarding=true');
  }, [profileReady, complete, onProfilePage, router]);

  if (!profileReady) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Loading your profile…</p>
      </div>
    );
  }

  if (!complete && !onProfilePage) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Setting up your financial profile…</p>
      </div>
    );
  }

  return <>{children}</>;
}
