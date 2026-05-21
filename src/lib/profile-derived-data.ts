import {
  type UserProfile,
  sumAssets,
  sumDebt,
  getAssetLineItems,
  getDebtLineItems,
} from '@/lib/user-profile';

export function getFinancialSnapshot(profile: UserProfile) {
  const totalAssets = sumAssets(profile);
  const totalDebt = sumDebt(profile);
  const monthlyIncome = profile.annualIncome / 12;
  const monthlyNet = monthlyIncome - profile.monthlyExpenses;
  const savingsRate =
    monthlyIncome > 0 ? Math.round((monthlyNet / monthlyIncome) * 100) : 0;

  return {
    totalAssets,
    totalDebt,
    netWorth: totalAssets - totalDebt,
    monthlyIncome,
    monthlyExpenses: profile.monthlyExpenses,
    monthlyNet,
    savingsRate,
    assetItems: getAssetLineItems(profile),
    liabilityItems: getDebtLineItems(profile),
  };
}
