'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useProfile } from '@/hooks/use-profile';
import { getFinancialSnapshot } from '@/lib/profile-derived-data';
import Link from 'next/link';

export function PortfolioOverview() {
  const { profile } = useProfile();
  const snap = getFinancialSnapshot(profile);
  const holdings = snap.assetItems;
  const totalValue = holdings.reduce((acc, item) => acc + item.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your holdings</CardTitle>
        <CardDescription>
          From your profile assets.{' '}
          <Link href="/profile" className="underline">
            Update profile
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {holdings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            List brokerage, 401(k), and other investments in Profile → Assets.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">
                    ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {holdings.length > 0 && (
        <CardFooter className="justify-end text-lg font-bold">
          Total: ${totalValue.toLocaleString()}
        </CardFooter>
      )}
    </Card>
  );
}
