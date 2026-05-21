'use client';

import { Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { AvatarAdvisorExperience } from '@/components/avatar/avatar-advisor-experience';

export default function AdvisorPage() {
  return (
    <div className="space-y-8 pb-28">
      <PageHeader
        title="AI Financial Avatar"
        description="Meet Aria—your humanized advisor with voice, lip-sync, live charts, and emotion-aware guidance."
      />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        Finance-only AI · Voice + visuals · Premium consultation mode
      </div>
      <AvatarAdvisorExperience immersive />
    </div>
  );
}
