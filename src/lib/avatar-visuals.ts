import type { UserProfile } from '@/hooks/use-profile';
import { getFinancialSnapshot } from '@/lib/profile-derived-data';
import { sumAssets, sumDebt } from '@/lib/user-profile';

export type AvatarVisualData = {
  title: string;
  emiBurdenPercent: number;
  savingsRatePercent: number;
  healthScore: number;
  affordabilityLabel: string;
  chartLabels: string[];
  chartValues: number[];
  chartDisplayValues: string[];
  pieData: { name: string; value: number }[];
  insight: string;
  netWorth: number;
};

export function buildVisualsFromProfile(
  profile: UserProfile,
  topic: string,
  mlHints?: { healthScore?: number; affordability?: number; emiBurden?: number }
): AvatarVisualData {
  const snap = getFinancialSnapshot(profile);
  const monthlyIncome = snap.monthlyIncome;
  const monthlyNet = Math.max(0, snap.monthlyNet);

  const savingsRatePercent =
    monthlyIncome > 0 ? Math.max(0, Math.round((monthlyNet / monthlyIncome) * 100)) : 0;

  const monthlyDebtService =
    snap.totalDebt > 0 ? Math.round(snap.totalDebt / 100) : 0;
  const emiBurdenPercent =
    mlHints?.emiBurden ??
    (monthlyIncome > 0
      ? Math.min(100, Math.round((monthlyDebtService / monthlyIncome) * 100))
      : 0);

  let healthScore = mlHints?.healthScore;
  if (healthScore == null) {
    healthScore = savingsRatePercent;
    if (snap.totalDebt > snap.totalAssets && snap.totalAssets > 0) {
      healthScore = Math.max(0, healthScore - 20);
    } else if (snap.netWorth > 0) {
      healthScore = Math.min(100, healthScore + 5);
    }
    healthScore = Math.round(Math.min(100, Math.max(0, healthScore)));
  }

  const chartLabels = ['Income/mo', 'Expenses/mo', 'Net/mo', 'Assets', 'Debt'];
  const chartValues = [
    Math.round(monthlyIncome),
    Math.round(profile.monthlyExpenses),
    Math.round(monthlyNet),
    Math.round(snap.totalAssets),
    Math.round(snap.totalDebt),
  ];
  const chartDisplayValues = chartValues.map((v) => `$${v.toLocaleString()}`);

  const expenseShare = monthlyIncome > 0 ? Math.round((profile.monthlyExpenses / monthlyIncome) * 100) : 0;
  const savingsShare = savingsRatePercent;
  const debtShare = emiBurdenPercent;
  const otherShare = Math.max(0, 100 - expenseShare - savingsShare - debtShare);

  const pieData = [
    { name: 'Expenses', value: expenseShare },
    { name: 'Savings', value: savingsShare },
    { name: 'Debt service', value: debtShare },
    ...(otherShare > 0 ? [{ name: 'Other', value: otherShare }] : []),
  ].filter((d) => d.value > 0);

  const q = topic.toLowerCase();
  let title = 'Your financial snapshot';
  let insight = `Net worth $${snap.netWorth.toLocaleString()} · Savings rate ${savingsRatePercent}% · Assets $${sumAssets(profile).toLocaleString()}`;

  if (q.includes('home') || q.includes('loan') || q.includes('emi') || q.includes('afford')) {
    title = 'EMI & affordability';
    insight =
      emiBurdenPercent > 40
        ? `Debt service ~${emiBurdenPercent}% of monthly income ($${monthlyIncome.toLocaleString()}/mo). Consider lowering EMI before new loans.`
        : `Debt service ~${emiBurdenPercent}% of income — within a typical range vs $${monthlyIncome.toLocaleString()}/mo income.`;
  } else if (q.includes('invest') || q.includes('portfolio') || q.includes('bank')) {
    title = 'Investments & cash';
    const inv = profile.investments ?? 0;
    const cash = profile.cashSavings ?? 0;
    insight = `Investments $${inv.toLocaleString()} · Cash $${cash.toLocaleString()} · Total assets $${snap.totalAssets.toLocaleString()}.`;
  } else if (q.includes('save') || q.includes('emergency')) {
    title = 'Savings & cash flow';
    insight = `You save ~$${monthlyNet.toLocaleString()}/mo (${savingsRatePercent}% of $${monthlyIncome.toLocaleString()} income). Debt: $${sumDebt(profile).toLocaleString()}.`;
  }

  return {
    title,
    emiBurdenPercent,
    savingsRatePercent,
    healthScore: Math.round(healthScore),
    affordabilityLabel: mlHints?.affordability
      ? `Max purchase ~$${Math.round(mlHints.affordability).toLocaleString()}`
      : `Net worth $${snap.netWorth.toLocaleString()}`,
    chartLabels,
    chartValues,
    chartDisplayValues,
    pieData,
    insight,
    netWorth: snap.netWorth,
  };
}
