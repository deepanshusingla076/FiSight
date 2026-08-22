import { LandingHeader } from './landing-header';
import { LandingHero } from './landing-hero';
import ServicesSection from './services-section';
import { StatsSection } from './stats-section';
import { HowItWorksSection } from './how-it-works-section';
import { AvatarPreviewSection } from './avatar-preview-section';
import { AboutSection } from './about-section';
import { FaqSection } from './faq-section';
import { CtaSection } from './cta-section';
import { ContactSection } from './contact-section';
import { LandingFooter } from './landing-footer';
import { LandingFinancialChatWidget } from '@/components/shared/landing-financial-chat';

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <StatsSection />
        <ServicesSection />
        <AvatarPreviewSection />
        <HowItWorksSection />
        <AboutSection />
        <FaqSection />
        <CtaSection />
        <ContactSection />
      </main>
      <LandingFooter />
      <LandingFinancialChatWidget />
    </div>
  );
}
