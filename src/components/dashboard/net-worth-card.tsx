'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';
import { useProfile } from '@/hooks/use-profile';
import { getFinancialSnapshot } from '@/lib/profile-derived-data';

const chartConfig = {
  amount: { label: 'Amount', color: 'hsl(var(--primary))' },
};

const COLORS = ['#34d399', '#60a5fa', '#a78bfa', '#f59e0b', '#94a3b8'];

export function NetWorthCard() {
  const { profile } = useProfile();
  const snap = getFinancialSnapshot(profile);

  const breakdown = [
    ...snap.assetItems.map((a) => ({ name: a.name, amount: a.amount, type: 'asset' as const })),
    ...snap.liabilityItems.map((l) => ({ name: l.name, amount: -l.amount, type: 'debt' as const })),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Net worth</CardTitle>
        <CardDescription>Assets minus debt from your saved profile</CardDescription>
        <div className="pt-2 text-4xl font-bold text-primary">
          ${snap.netWorth.toLocaleString()}
        </div>
        <p className="text-sm text-muted-foreground">
          Assets ${snap.totalAssets.toLocaleString()} · Debt ${snap.totalDebt.toLocaleString()}
        </p>
      </CardHeader>
      <CardContent>
        {breakdown.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Add asset amounts in Profile to see your breakdown.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={breakdown} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${Math.abs(Number(v)) / 1000}k`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent formatter={(v) => `$${Math.abs(Number(v)).toLocaleString()}`} />}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {breakdown.map((row, i) => (
                  <Cell key={i} fill={row.type === 'debt' ? '#f43f5e' : COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
