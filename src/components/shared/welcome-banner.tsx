'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useProfile, isProfileComplete } from '@/hooks/use-profile';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Sparkles, ArrowRight } from 'lucide-react';

export function WelcomeBanner() {
  const { user, isNewUser, clearNewUserFlag } = useAuth();
  const { profile } = useProfile();
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (isNewUser && user && isProfileComplete(profile)) {
      setShowBanner(true);
    }
  }, [isNewUser, user, profile]);

  const handleStartTour = () => {
    clearNewUserFlag();
    setShowBanner(false);
    router.push('/dashboard?tour=true');
  };

  const handleDismiss = () => {
    clearNewUserFlag();
    setShowBanner(false);
  };

  if (!showBanner || !user) return null;

  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/10 to-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">
                Welcome to FiSight, {user.displayName || 'there'}!
              </h3>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Your profile is set up. Take a quick tour of your dashboard or explore the AI advisor.
            </p>
            <div className="flex gap-3">
              <Button onClick={handleStartTour}>
                Take a tour
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleDismiss}>
                Got it
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
