import { MarketingShell } from '@/components/marketing/marketing-shell';
import { AboutSection } from '@/components/landing/about-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { CtaSection } from '@/components/landing/cta-section';

export const metadata = {
  title: 'About | FiSight',
  description: 'Our mission: democratize financial intelligence with AI.',
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <AboutSection />
      <HowItWorksSection />
      <CtaSection />
    </MarketingShell>
  );
}
