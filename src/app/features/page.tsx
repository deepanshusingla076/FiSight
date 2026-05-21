import { MarketingShell } from '@/components/marketing/marketing-shell';
import { FeaturesContent } from '@/components/marketing/features-content';

export const metadata = {
  title: 'Features | FiSight',
  description: 'AI financial advisor, ML analytics, affordability, portfolio intelligence, and more.',
};

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <FeaturesContent />
    </MarketingShell>
  );
}
