'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';
import { useProfile } from '@/hooks/use-profile';
import { getFinancialSnapshot } from '@/lib/profile-derived-data';

export default function InvestmentsPage() {
  const { profile } = useProfile();
  const snap = getFinancialSnapshot(profile);
  const holdings = snap.assetItems;
  const totalValue = holdings.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Investments"
          description="Holdings from your profile assets list"
        />
        <Button asChild variant="outline">
          <Link href="/profile">
            <Plus className="mr-2 h-4 w-4" />
            Edit profile
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Portfolio value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-2xl font-bold">
              <TrendingUp className="h-5 w-5 text-green-600" />
              ${totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annual income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${profile.annualIncome.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Savings rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{snap.savingsRate}%</p>
          </CardContent>
        </Card>
      </div>

      {holdings.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            List brokerage, 401(k), and funds in Profile → Assets with dollar amounts.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {holdings.map((inv, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{inv.name}</CardTitle>
                <CardDescription>Current value from profile</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold text-primary">${inv.amount.toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
