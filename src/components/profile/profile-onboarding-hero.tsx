'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Wallet, BarChart3, Bot } from 'lucide-react';

export function ProfileOnboardingHero() {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-headline text-lg font-semibold">Welcome — set up your profile first</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Before you use the dashboard, AI advisor, or investments, tell us about your finances.
          Everything stays in your browser and powers personalized insights.
        </p>
        <ul className="grid gap-2 text-sm sm:grid-cols-3">
          <li className="flex items-center gap-2 rounded-lg border bg-background/60 px-3 py-2">
            <Wallet className="h-4 w-4 shrink-0 text-primary" />
            Income & amounts
          </li>
          <li className="flex items-center gap-2 rounded-lg border bg-background/60 px-3 py-2">
            <BarChart3 className="h-4 w-4 shrink-0 text-primary" />
            Live charts
          </li>
          <li className="flex items-center gap-2 rounded-lg border bg-background/60 px-3 py-2">
            <Bot className="h-4 w-4 shrink-0 text-primary" />
            Aria advisor
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
