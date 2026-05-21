'use client';

import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { User } from 'lucide-react';
import { ProfileForm } from '@/components/profile/profile-form';
import { ProfileOnboardingHero } from '@/components/profile/profile-onboarding-hero';
import { isProfileComplete, useProfile } from '@/hooks/use-profile';

export function ProfilePageContent() {
  const searchParams = useSearchParams();
  const onboarding = searchParams.get('onboarding') === 'true';
  const { profile } = useProfile();
  const showOnboarding = onboarding || !isProfileComplete(profile);

  return (
    <div className="space-y-8">
      <PageHeader
        title={showOnboarding ? 'Complete your profile' : 'Your profile'}
        description={
          showOnboarding
            ? 'Required step after registration — enter numbers only; leave fields empty if they do not apply.'
            : 'Saved to your account (browser + Firebase). Empty fields are stored as null.'
        }
        icon={User}
      />
      {showOnboarding && <ProfileOnboardingHero />}
      <div className="mx-auto max-w-2xl">
        <ProfileForm onboarding={showOnboarding} />
      </div>
    </div>
  );
}
