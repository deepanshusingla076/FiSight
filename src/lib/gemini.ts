import { GoogleGenerativeAI } from '@google/generative-ai';

const DEFAULT_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-2.0-flash',
  'gemini-2.5-flash-preview-05-20',
  'gemini-1.5-flash-8b',
].filter(Boolean) as string[];

function getApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Add it to .env.local');
  }
  return apiKey;
}

function getModelByName(name: string) {
  const genAI = new GoogleGenerativeAI(getApiKey());
  return genAI.getGenerativeModel({ model: name });
}

export function sanitizeGeminiError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (msg.includes('404') && msg.includes('models/')) {
    return 'AI model unavailable. Set GEMINI_MODEL=gemini-2.0-flash in .env.local and restart the dev server.';
  }
  if (msg.includes('API key')) {
    return 'Invalid Gemini API key. Check GEMINI_API_KEY in .env.local.';
  }
  if (msg.length > 200) {
    return 'AI service error. Check GEMINI_API_KEY and GEMINI_MODEL, then restart npm run dev.';
  }
  return msg;
}

export async function askGemini(prompt: string, context?: string): Promise<string> {
  if (!prompt?.trim()) {
    throw new Error('Prompt is required and must be a non-empty string');
  }

  const systemPrompt = `You are FiSight AI - an expert financial advisor.
Provide helpful, accurate financial guidance. Use simple language. Reference the user's actual numbers from context when provided.
Keep responses under 200 words unless they ask for detail.`;

  const fullPrompt = [
    systemPrompt,
    context ? `User financial context:\n${context}` : '',
    `Question: ${prompt.trim()}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  const modelsToTry = [...new Set(DEFAULT_MODELS)];
  let lastError: unknown;

  for (const modelName of modelsToTry) {
    try {
      const result = await getModelByName(modelName).generateContent(fullPrompt);

      const responseText =
        typeof result?.response?.text === 'function'
          ? await result.response.text()
          : result?.response?.text;

      const text = String(responseText ?? '').trim();
      if (text) return text;
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : '';
      if (!msg.includes('404') && !msg.includes('not found')) {
        throw err;
      }
    }
  }

  throw lastError ?? new Error('Gemini returned an empty response');
}
