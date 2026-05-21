/** Shared profile types & parsers (safe for server + client). */

export type NullableAmount = number | null;

export interface UserProfile {
  annualIncome: number;
  monthlyExpenses: number;
  age: number;
  creditScore: number;
  employmentYears: number;
  dependents: number;
  cashSavings: NullableAmount;
  investments: NullableAmount;
  retirementBalance: NullableAmount;
  propertyValue: NullableAmount;
  otherAssets: NullableAmount;
  creditCardDebt: NullableAmount;
  studentLoans: NullableAmount;
  mortgage: NullableAmount;
  carLoan: NullableAmount;
  otherDebt: NullableAmount;
}

export const ASSET_FIELDS = [
  { key: 'cashSavings' as const, label: 'Cash & savings ($)' },
  { key: 'investments' as const, label: 'Investments / brokerage ($)' },
  { key: 'retirementBalance' as const, label: '401(k) / retirement ($)' },
  { key: 'propertyValue' as const, label: 'Property value ($)' },
  { key: 'otherAssets' as const, label: 'Other assets ($)' },
];

export const DEBT_FIELDS = [
  { key: 'creditCardDebt' as const, label: 'Credit card debt ($)' },
  { key: 'studentLoans' as const, label: 'Student loans ($)' },
  { key: 'mortgage' as const, label: 'Mortgage ($)' },
  { key: 'carLoan' as const, label: 'Car loan ($)' },
  { key: 'otherDebt' as const, label: 'Other debt ($)' },
];

export const emptyProfile: UserProfile = {
  annualIncome: 0,
  monthlyExpenses: 0,
  age: 28,
  creditScore: 700,
  employmentYears: 3,
  dependents: 0,
  cashSavings: null,
  investments: null,
  retirementBalance: null,
  propertyValue: null,
  otherAssets: null,
  creditCardDebt: null,
  studentLoans: null,
  mortgage: null,
  carLoan: null,
  otherDebt: null,
};

export function parseOptionalNumber(value: unknown): NullableAmount {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Legacy: parse "$25,000" from old textarea profile */
function sumLegacyText(text: string): number {
  if (!text?.trim()) return 0;
  const matches = text.match(/\$[\d,]+(?:\.\d+)?/g) ?? [];
  return matches.reduce((sum, token) => {
    const n = parseFloat(token.replace(/[$,]/g, ''));
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);
}

function migrateLegacy(raw: Record<string, unknown>): Partial<UserProfile> {
  const patch: Partial<UserProfile> = {};
  if (typeof raw.assets === 'string' && raw.assets.trim()) {
    const total = sumLegacyText(raw.assets);
    if (total > 0) patch.cashSavings = total;
  }
  if (typeof raw.liabilities === 'string' && raw.liabilities.trim()) {
    const total = sumLegacyText(raw.liabilities);
    if (total > 0) patch.otherDebt = total;
  }
  return patch;
}

export function normalizeProfile(raw: Partial<UserProfile> | Record<string, unknown> | null): UserProfile {
  if (!raw) return { ...emptyProfile };
  const legacy = migrateLegacy(raw as Record<string, unknown>);
  const r = { ...legacy, ...raw } as Partial<UserProfile>;

  return {
    annualIncome: Number(r.annualIncome) || 0,
    monthlyExpenses: Number(r.monthlyExpenses) || 0,
    age: Number(r.age) || 28,
    creditScore: Number(r.creditScore) || 700,
    employmentYears: Number(r.employmentYears) ?? 3,
    dependents: Number(r.dependents) ?? 0,
    cashSavings: parseOptionalNumber(r.cashSavings),
    investments: parseOptionalNumber(r.investments),
    retirementBalance: parseOptionalNumber(r.retirementBalance),
    propertyValue: parseOptionalNumber(r.propertyValue),
    otherAssets: parseOptionalNumber(r.otherAssets),
    creditCardDebt: parseOptionalNumber(r.creditCardDebt),
    studentLoans: parseOptionalNumber(r.studentLoans),
    mortgage: parseOptionalNumber(r.mortgage),
    carLoan: parseOptionalNumber(r.carLoan),
    otherDebt: parseOptionalNumber(r.otherDebt),
  };
}

export function sumAssets(profile: UserProfile): number {
  return ASSET_FIELDS.reduce((sum, { key }) => sum + (profile[key] ?? 0), 0);
}

export function sumDebt(profile: UserProfile): number {
  return DEBT_FIELDS.reduce((sum, { key }) => sum + (profile[key] ?? 0), 0);
}

export function getAssetLineItems(profile: UserProfile): { name: string; amount: number }[] {
  return ASSET_FIELDS.flatMap(({ key, label }) => {
    const amount = profile[key];
    if (amount == null || amount <= 0) return [];
    return [{ name: label.replace(' ($)', ''), amount }];
  });
}

export function getDebtLineItems(profile: UserProfile): { name: string; amount: number }[] {
  return DEBT_FIELDS.flatMap(({ key, label }) => {
    const amount = profile[key];
    if (amount == null || amount <= 0) return [];
    return [{ name: label.replace(' ($)', ''), amount }];
  });
}

export function profileToFinancialSituation(profile: UserProfile): string {
  const assets = sumAssets(profile);
  const debt = sumDebt(profile);
  const assetLines = getAssetLineItems(profile)
    .map((a) => `  ${a.name}: $${a.amount.toLocaleString()}`)
    .join('\n');
  const debtLines = getDebtLineItems(profile)
    .map((d) => `  ${d.name}: $${d.amount.toLocaleString()}`)
    .join('\n');

  return [
    `Age: ${profile.age}`,
    `Annual income: $${profile.annualIncome.toLocaleString()}`,
    `Monthly expenses: $${profile.monthlyExpenses.toLocaleString()}`,
    `Total assets: $${assets.toLocaleString()}`,
    `Total debt: $${debt.toLocaleString()}`,
    `Net worth: $${(assets - debt).toLocaleString()}`,
    `Credit score: ${profile.creditScore}`,
    `Employment years: ${profile.employmentYears}`,
    `Dependents: ${profile.dependents}`,
    `Assets:\n${assetLines || '  (none entered)'}`,
    `Debt:\n${debtLines || '  (none)'}`,
  ].join('\n');
}

export function profileToMlPayload(profile: UserProfile) {
  const savings = sumAssets(profile);
  const debt = sumDebt(profile);
  const investmentGuess = (profile.investments ?? 0) + (profile.retirementBalance ?? 0) * 0.5;

  return {
    age: profile.age,
    income: profile.annualIncome,
    expenses: profile.monthlyExpenses * 12,
    savings: savings || 0,
    debt: debt || 0,
    credit_score: profile.creditScore,
    investment_amount: investmentGuess || Math.max(0, savings * 0.3),
    employment_years: profile.employmentYears,
    num_dependents: profile.dependents,
    property_value: profile.propertyValue ?? 0,
  };
}

export function isProfileComplete(profile: UserProfile): boolean {
  return profile.annualIncome > 0 && profile.monthlyExpenses > 0;
}

/** @deprecated use sumAssets */
export function sumDollarAmounts(_text: string): number {
  return sumLegacyText(_text);
}
