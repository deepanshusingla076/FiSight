export type AvatarEmotion = 'calm' | 'happy' | 'warning' | 'concerned' | 'celebrating';

export type AvatarState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'happy'
  | 'warning'
  | 'concerned'
  | 'celebrating';

export function emotionToAvatarState(emotion: AvatarEmotion, isSpeaking: boolean, isListening: boolean, isThinking: boolean): AvatarState {
  if (isListening) return 'listening';
  if (isThinking) return 'thinking';
  if (isSpeaking) return 'speaking';
  if (emotion === 'celebrating') return 'celebrating';
  if (emotion === 'happy') return 'happy';
  if (emotion === 'warning') return 'warning';
  if (emotion === 'concerned') return 'concerned';
  return 'idle';
}

export function detectEmotionFromText(text: string, query?: string): AvatarEmotion {
  const combined = `${query ?? ''} ${text}`.toLowerCase();

  if (/congrat|achieved|goal reached|well done|celebrat|milestone/.test(combined)) return 'celebrating';
  if (/risk|danger|warning|high debt|overdue|critical|reduce expense|burden|stress/.test(combined)) return 'warning';
  if (/concern|worry|tight|struggle|shortfall|deficit|unable|cannot afford/.test(combined)) return 'concerned';
  if (/healthy|great job|on track|positive|strong|good shape|comfortable/.test(combined)) return 'happy';
  return 'calm';
}

export function detectEmotionFromMetrics(metrics?: {
  healthScore?: number;
  emiBurdenPercent?: number;
}): AvatarEmotion {
  if (!metrics) return 'calm';
  if (metrics.healthScore != null && metrics.healthScore >= 75) return 'happy';
  if (metrics.emiBurdenPercent != null && metrics.emiBurdenPercent > 45) return 'warning';
  if (metrics.healthScore != null && metrics.healthScore < 45) return 'concerned';
  return 'calm';
}
