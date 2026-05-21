'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { AvatarVisualData } from '@/lib/avatar-visuals';

const BAR_COLORS = ['#34d399', '#60a5fa', '#a78bfa', '#f59e0b', '#f43f5e'];

type AvatarVisualPanelProps = {
  visuals: AvatarVisualData | null;
};

export function AvatarVisualPanel({ visuals }: AvatarVisualPanelProps) {
  if (!visuals) {
    return (
      <Card className="border-dashed bg-card/50 backdrop-blur">
        <CardContent className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          Charts appear when you ask a financial question
        </CardContent>
      </Card>
    );
  }

  const barData = visuals.chartLabels.map((name, i) => ({
    name,
    value: visuals.chartValues[i] ?? 0,
    label: visuals.chartDisplayValues?.[i] ?? `$${(visuals.chartValues[i] ?? 0).toLocaleString()}`,
  }));

  const pieData = visuals.pieData?.length
    ? visuals.pieData
    : [
        { name: 'Savings', value: visuals.savingsRatePercent },
        { name: 'EMI burden', value: visuals.emiBurdenPercent },
      ];

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-primary/20 bg-card/80 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="font-headline text-lg">{visuals.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{visuals.insight}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Health score</p>
              <p className="text-2xl font-bold text-primary">{visuals.healthScore}</p>
              <Progress value={visuals.healthScore} className="mt-2 h-2" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Debt vs income</p>
              <p className="text-2xl font-bold">{visuals.emiBurdenPercent}%</p>
              <Progress
                value={visuals.emiBurdenPercent}
                className={`mt-2 h-2 ${visuals.emiBurdenPercent > 40 ? '[&>div]:bg-amber-500' : ''}`}
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Savings rate</p>
              <p className="text-2xl font-bold">{visuals.savingsRatePercent}%</p>
              <Progress value={visuals.savingsRatePercent} className="mt-2 h-2" />
            </div>
          </div>
          <p className="text-xs font-medium text-primary">{visuals.affordabilityLabel}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card/80 backdrop-blur">
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Your numbers ($)</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${Number(v) / 1000}k`} />
                <Tooltip formatter={(_, __, item) => [(item.payload as { label: string }).label, '']} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur">
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Monthly cash split (%)</CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  isAnimationActive={false}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
