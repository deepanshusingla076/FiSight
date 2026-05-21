import { Suspense } from 'react';
import { ProfilePageContent } from '@/components/profile/profile-page-content';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}
