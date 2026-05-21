import { MarketingShell } from '@/components/marketing/marketing-shell';
import { LegalContent } from '@/components/marketing/legal-content';

export const metadata = { title: 'Terms of Service | FiSight' };

const sections = [
  {
    heading: 'Not financial advice',
    body: 'FiSight provides educational and analytical tools. It is not a registered investment advisor, broker, or tax professional. Consult licensed experts for binding decisions.',
  },
  {
    heading: 'Acceptable use',
    body: 'You agree not to abuse APIs, attempt unauthorized access, or use the platform for illegal activity. We may suspend accounts that violate these terms.',
  },
  {
    heading: 'Subscriptions',
    body: 'Paid plans bill monthly unless cancelled. Refunds follow the policy displayed at purchase time.',
  },
  {
    heading: 'Limitation of liability',
    body: 'FiSight is provided as-is. We are not liable for losses arising from reliance on AI or ML outputs. You remain responsible for your financial choices.',
  },
];

export default function TermsPage() {
  return (
    <MarketingShell>
      <LegalContent title="Terms of Service" lastUpdated="May 21, 2026" sections={sections} />
    </MarketingShell>
  );
}
