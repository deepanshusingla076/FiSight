import { z } from 'zod';

const serverSchema = z.object({
  GEMINI_API_KEY: z.string().min(1).optional(),
  ML_API_URL: z.string().url().optional(),
  FASTAPI_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_ML_API_URL: z.string().url().optional(),
});

export function validateServerEnv() {
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    console.warn('[FiSight] Server env validation:', parsed.error.flatten().fieldErrors);
  }
  return parsed.success;
}

export function getMlApiUrl(): string {
  return (
    process.env.ML_API_URL ||
    process.env.FASTAPI_URL ||
    process.env.NEXT_PUBLIC_ML_API_URL ||
    'http://localhost:8000'
  );
}

export function requireGeminiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not configured');
  return key;
}
