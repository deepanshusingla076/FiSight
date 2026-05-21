const FINANCE_KEYWORDS = [
  'money', 'budget', 'invest', 'save', 'loan', 'debt', 'bank', 'account', 'credit', 'debit',
  'mutual fund', 'stock', 'equity', 'bond', 'sip', 'emi', 'interest', 'tax', 'income',
  'expense', 'salary', 'pf', 'epf', 'ppf', 'nps', 'insurance', 'retirement', 'pension',
  'portfolio', 'asset', 'liability', 'cash flow', 'financial', 'finance', 'economic',
  'wealth', 'profit', 'loss', 'return', 'dividend', 'inflation', 'market', 'trading',
  'rupee', 'dollar', 'currency', 'payment', 'transaction', 'balance', 'fd', 'rd',
  'gold', 'real estate', 'property', 'mortgage', 'housing', 'home loan', 'car loan',
  'afford', 'affordability', 'net worth', 'savings', 'goal', 'emergency fund', 'cibil',
  'website', 'platform', 'broker', 'robinhood', 'etrade', 'fidelity', 'vanguard',
];

export function isFinancialQuery(query: string): boolean {
  const q = query.toLowerCase();
  return FINANCE_KEYWORDS.some((kw) => q.includes(kw));
}

export const FINANCE_ONLY_REJECTION =
  "I'm FiSight's financial advisor—I only help with money, investing, budgeting, loans, taxes, and goals. Try asking about EMI, savings, or whether you can afford a purchase.";
