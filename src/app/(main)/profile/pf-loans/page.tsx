'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { PiggyBank, Plus } from 'lucide-react';
import Link from 'next/link';
import { useProfile } from '@/hooks/use-profile';
import { getFinancialSnapshot } from '@/lib/profile-derived-data';

export default function PFLoansPage() {
  const { profile } = useProfile();
  const snap = getFinancialSnapshot(profile);
  const loans = snap.liabilityItems;
  const totalDebt = snap.totalDebt;
  const monthlyEmiEstimate = Math.round(profile.monthlyExpenses * 0.35);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Loans & liabilities"
          description="From your profile liabilities (EMI estimate uses 35% of expenses)"
        />
        <Button asChild variant="outline">
          <Link href="/profile">
            <Plus className="mr-2 h-4 w-4" />
            Edit profile
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total debt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-rose-600">${totalDebt.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Est. monthly EMI load</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${monthlyEmiEstimate.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {loans.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Add loans in Profile → Liabilities, e.g. &quot;Student loan: $12,000&quot;.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {loans.map((loan, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center gap-2">
                <PiggyBank className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>{loan.name}</CardTitle>
                  <CardDescription>Outstanding balance</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">${loan.amount.toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
