import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { LandingFinancialChatWidget } from '@/components/shared/landing-financial-chat';

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <LandingFooter />
      <LandingFinancialChatWidget />
    </div>
  );
}
