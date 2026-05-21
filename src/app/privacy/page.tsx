import { MarketingShell } from '@/components/marketing/marketing-shell';
import { LegalContent } from '@/components/marketing/legal-content';

export const metadata = { title: 'Privacy Policy | FiSight' };

const sections = [
  {
    heading: 'Data we collect',
    body: 'Account information (email, display name), financial profile fields you enter, usage analytics, and AI chat content needed to provide the service. We do not sell personal data.',
  },
  {
    heading: 'How we use data',
    body: 'To authenticate you, render dashboards, run ML predictions, personalize AI responses, and improve product reliability. Aggregated, anonymized metrics may be used for model quality.',
  },
  {
    heading: 'Security',
    body: 'Data in transit uses TLS. Firebase and cloud providers apply industry-standard controls. You are responsible for keeping credentials private.',
  },
  {
    heading: 'Your rights',
    body: 'You may request export or deletion of account data by contacting support. Regional privacy laws (GDPR, etc.) apply where relevant.',
  },
];

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <LegalContent title="Privacy Policy" lastUpdated="May 21, 2026" sections={sections} />
    </MarketingShell>
  );
}
