'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { Landmark, Plus, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { getFinancialSnapshot } from '@/lib/profile-derived-data';
import Link from 'next/link';

export default function BankAccountsPage() {
  const [showBalances, setShowBalances] = useState(true);
  const { profile } = useProfile();
  const snap = getFinancialSnapshot(profile);
  const accounts = snap.assetItems;
  const totalBalance = accounts.reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Bank accounts"
          description="Parsed from your profile assets (one line per account)"
        />
        <Button asChild variant="outline">
          <Link href="/profile">
            <Plus className="mr-2 h-4 w-4" />
            Edit in profile
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total balance</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowBalances(!showBalances)} className="h-8 w-8 p-0">
            {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {showBalances ? `$${totalBalance.toLocaleString()}` : '••••••'}
          </div>
        </CardContent>
      </Card>

      {accounts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Add lines like &quot;Savings account: $18,000&quot; under Profile → Assets.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.map((account, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{account.name}</CardTitle>
                </div>
                <CardDescription>From your financial profile</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">
                  {showBalances ? `$${account.amount.toLocaleString()}` : '••••••'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
