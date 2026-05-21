import { NextRequest, NextResponse } from 'next/server';
import { askGemini, sanitizeGeminiError } from '@/lib/gemini';
import { getMlApiUrl, requireGeminiKey } from '@/lib/env';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { isFinancialQuery, FINANCE_ONLY_REJECTION } from '@/lib/finance-guard';
import { normalizeProfile, profileToMlPayload, type UserProfile } from '@/lib/user-profile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ChatRequest {
  prompt: string;
  userContext?: string;
  profile?: {
    age?: number;
    income?: number;
    expenses?: number;
    savings?: number;
    debt?: number;
    credit_score?: number;
    investment_amount?: number;
    employment_years?: number;
    num_dependents?: number;
    property_value?: number;
  };
}

interface MLPredictions {
  investment?: Record<string, unknown> | null;
  affordability?: Record<string, unknown> | null;
  health?: Record<string, unknown> | null;
  scenario?: Record<string, unknown> | null;
}

async function callMLEndpoint(endpoint: string, data: Record<string, unknown>) {
  try {
    const response = await fetch(`${getMlApiUrl()}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function resolveProfile(body: ChatRequest) {
  const p = body.profile;
  if (p && 'annualIncome' in p) {
    return profileToMlPayload(normalizeProfile(p as Partial<UserProfile>));
  }
  if (p && typeof p.income === 'number') {
    return {
      age: p.age ?? 28,
      income: p.income,
      expenses: p.expenses ?? 0,
      savings: p.savings ?? 0,
      debt: p.debt ?? 0,
      credit_score: p.credit_score ?? 700,
      investment_amount: p.investment_amount ?? 0,
      employment_years: p.employment_years ?? 0,
      num_dependents: p.num_dependents ?? 0,
      property_value: p.property_value ?? 0,
    };
  }
  return profileToMlPayload(normalizeProfile(null));
}

function buildMlContext(ml: MLPredictions, userContext?: string): string {
  const lines: string[] = [];
  const health = ml.health as { health_score?: number; health_category?: string } | null;
  const investment = ml.investment as { risk_score?: number; risk_category?: string } | null;
  const affordability = ml.affordability as { affordability_amount?: number } | null;
  const scenario = ml.scenario as { recommended_scenario?: string } | null;

  if (health?.health_score != null) {
    lines.push(`Financial health: ${Math.round(health.health_score)}/100 (${health.health_category})`);
  }
  if (investment?.risk_score != null) {
    lines.push(`Investment risk: ${Math.round(investment.risk_score)}/100 (${investment.risk_category})`);
  }
  if (affordability?.affordability_amount != null) {
    lines.push(`Max affordable purchase: $${Math.round(affordability.affordability_amount).toLocaleString()}`);
  }
  if (scenario?.recommended_scenario) {
    lines.push(`Recommended strategy: ${scenario.recommended_scenario}`);
  }

  if (lines.length === 0) return userContext || '';
  return `ML analysis:\n${lines.join('\n')}${userContext ? `\n\nUser notes:\n${userContext}` : ''}`;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limited = rateLimit(`chat:${ip}`, 30, 60_000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Retry in ${limited.retryAfterSec}s` },
        { status: 429 }
      );
    }

    const body: ChatRequest = await req.json();
    const { prompt, userContext } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!isFinancialQuery(prompt)) {
      return NextResponse.json({ answer: FINANCE_ONLY_REJECTION, models: {} });
    }

    try {
      requireGeminiKey();
    } catch {
      return NextResponse.json({ error: 'GEMINI_API_KEY missing' }, { status: 500 });
    }

    const profile = resolveProfile(body);

    const [investment, affordability, health, scenario] = await Promise.all([
      callMLEndpoint('/predict/investment-risk', profile),
      callMLEndpoint('/predict/affordability', profile),
      callMLEndpoint('/predict/financial-health', profile),
      callMLEndpoint('/predict/scenario', profile),
    ]);

    const models: MLPredictions = { investment, affordability, health, scenario };
    const contextString = buildMlContext(models, userContext);
    const answer = await askGemini(prompt, contextString);

    return NextResponse.json({ answer, models });
  } catch (err: unknown) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: sanitizeGeminiError(err) }, { status: 500 });
  }
}
