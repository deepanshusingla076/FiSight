'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProfile } from '@/hooks/use-profile';
import { getFinancialSnapshot } from '@/lib/profile-derived-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function RecentTransactions() {
  const { profile } = useProfile();
  const snap = getFinancialSnapshot(profile);

  const entries = [
    ...snap.assetItems.map((a) => ({ ...a, type: 'asset' as const })),
    ...snap.liabilityItems.map((l) => ({ name: l.name, amount: -l.amount, type: 'debt' as const })),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your financial ledger</CardTitle>
        <CardDescription>
          Parsed from your profile assets & liabilities.{' '}
          <Link href="/profile" className="underline">
            Edit profile
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[330px]">
          {entries.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              Add assets and liabilities in Profile to see your real breakdown here.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((row, i) => (
                  <TableRow key={`${row.type}-${i}`}>
                    <TableCell>
                      <div className="font-medium">{row.name}</div>
                      <div className="text-xs capitalize text-muted-foreground">{row.type}</div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-semibold',
                        row.amount >= 0 ? 'text-green-600' : 'text-rose-600'
                      )}
                    >
                      {row.amount >= 0 ? '+' : '-'}${Math.abs(row.amount).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
