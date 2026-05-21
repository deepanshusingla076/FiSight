import { MarketingShell } from '@/components/marketing/marketing-shell';
import { PricingContent } from '@/components/marketing/pricing-content';

export const metadata = {
  title: 'Pricing | FiSight',
  description: 'Starter, Pro, and Family plans for AI-powered financial planning.',
};

export default function PricingPage() {
  return (
    <MarketingShell>
      <PricingContent />
    </MarketingShell>
  );
}
