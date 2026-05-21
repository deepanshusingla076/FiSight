import { NextRequest, NextResponse } from 'next/server';
import { askGemini, sanitizeGeminiError } from '@/lib/gemini';
import {
  detectEmotionFromText,
  detectEmotionFromMetrics,
  type AvatarEmotion,
} from '@/lib/avatar-emotion';
import { buildVisualsFromProfile } from '@/lib/avatar-visuals';
import { isFinancialQuery, FINANCE_ONLY_REJECTION } from '@/lib/finance-guard';
import { getMlApiUrl } from '@/lib/env';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import {
  normalizeProfile,
  profileToMlPayload,
  type UserProfile,
} from '@/lib/user-profile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface AvatarRequest {
  prompt: string;
  userContext?: string;
  profile?: Partial<UserProfile>;
}

async function callML(endpoint: string, data: Record<string, unknown>) {
  try {
    const res = await fetch(`${getMlApiUrl()}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limited = rateLimit(`avatar:${ip}`, 20, 60_000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Retry in ${limited.retryAfterSec}s` },
        { status: 429 }
      );
    }

    const body: AvatarRequest = await req.json();
    const { prompt, userContext } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
    }

    if (!isFinancialQuery(prompt)) {
      return NextResponse.json({
        answer: FINANCE_ONLY_REJECTION,
        emotion: 'concerned' as AvatarEmotion,
        visuals: null,
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY missing in .env.local' }, { status: 500 });
    }

    const userProfile = normalizeProfile(body.profile ?? null);
    const profilePayload = profileToMlPayload(userProfile);

    const [health, affordability] = await Promise.all([
      callML('/predict/financial-health', profilePayload),
      callML('/predict/affordability', profilePayload),
    ]);

    const healthScore = health?.health_score as number | undefined;
    const affordabilityAmount = affordability?.affordability_amount as number | undefined;
    const monthlyIncome = userProfile.annualIncome / 12 || 1;
    const emiBurdenPercent = Math.min(
      100,
      Math.round((userProfile.monthlyExpenses * 0.35 / monthlyIncome) * 100)
    );

    const visuals = buildVisualsFromProfile(userProfile, prompt, {
      healthScore,
      affordability: affordabilityAmount,
      emiBurden: emiBurdenPercent,
    });

    const mlContext = [
      healthScore != null ? `Health score: ${Math.round(healthScore)}/100` : '',
      affordabilityAmount != null
        ? `Max affordable: $${Math.round(affordabilityAmount).toLocaleString()}`
        : '',
      `EMI burden estimate: ${emiBurdenPercent}%`,
      userContext,
    ]
      .filter(Boolean)
      .join('\n');

    const answer = await askGemini(
      prompt,
      `Respond as Aria, a professional financial advisor. Use the user's real numbers below.\n\n${mlContext}`
    );

    const emotion =
      detectEmotionFromText(answer, prompt) ||
      detectEmotionFromMetrics({ healthScore, emiBurdenPercent });

    return NextResponse.json({
      answer,
      emotion,
      visuals,
      models: { health, affordability },
    });
  } catch (err) {
    console.error('Avatar API error:', err);
    return NextResponse.json({ error: sanitizeGeminiError(err) }, { status: 500 });
  }
}
