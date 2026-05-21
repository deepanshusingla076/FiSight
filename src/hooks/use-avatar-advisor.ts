'use client';

import { useCallback, useState } from 'react';
import {
  useProfile,
  profileToFinancialSituation,
  profileToMlPayload,
  isProfileComplete,
} from '@/hooks/use-profile';
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';
import { useLipSync } from '@/hooks/use-lip-sync';
import { isFinancialQuery, FINANCE_ONLY_REJECTION } from '@/lib/finance-guard';
import {
  detectEmotionFromText,
  detectEmotionFromMetrics,
  emotionToAvatarState,
  type AvatarEmotion,
  type AvatarState,
} from '@/lib/avatar-emotion';
import { buildVisualsFromProfile, type AvatarVisualData } from '@/lib/avatar-visuals';

export type AdvisorMessage = {
  id: string;
  role: 'user' | 'advisor';
  content: string;
  emotion?: AvatarEmotion;
};

export function useAvatarAdvisor() {
  const { profile } = useProfile();
  const [messages, setMessages] = useState<AdvisorMessage[]>([
    {
      id: 'welcome',
      role: 'advisor',
      content:
        "Hello! I'm Sophia, your FiSight financial advisor. Ask me about affordability, EMIs, investments, or savings—I'll explain with voice and live charts.",
      emotion: 'calm',
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [emotion, setEmotion] = useState<AvatarEmotion>('calm');
  const [visuals, setVisuals] = useState<AvatarVisualData | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const voice = useVoiceAssistant({ language: 'en-US', voiceRate: 0.95, voicePitch: 1.05 });
  const mouthOpen = useLipSync(voice.isSpeaking);

  const avatarState: AvatarState = emotionToAvatarState(
    emotion,
    voice.isSpeaking,
    voice.isListening,
    isThinking
  );

  const speakResponse = useCallback(
    (text: string) => {
      if (!voiceEnabled || !voice.isSupported) return;
      const plain = text.replace(/[*#`_]/g, '').slice(0, 1200);
      voice.speak(plain);
    },
    [voice, voiceEnabled]
  );

  const sendMessage = useCallback(
    async (textOverride?: string) => {
      const text = (textOverride ?? input).trim();
      if (!text || isThinking) return;

      setInput('');
      const userMsg: AdvisorMessage = { id: crypto.randomUUID(), role: 'user', content: text };
      setMessages((m) => [...m, userMsg]);

      if (!isFinancialQuery(text)) {
        const rejection = FINANCE_ONLY_REJECTION;
        setEmotion('concerned');
        setMessages((m) => [
          ...m,
          { id: crypto.randomUUID(), role: 'advisor', content: rejection, emotion: 'concerned' },
        ]);
        speakResponse(rejection);
        return;
      }

      setIsThinking(true);
      setEmotion('calm');

      if (!isProfileComplete(profile)) {
        const msg =
          'Please complete your financial profile first (/profile): annual income, monthly expenses, and at least one asset amount.';
        setEmotion('concerned');
        setMessages((m) => [
          ...m,
          { id: crypto.randomUUID(), role: 'advisor', content: msg, emotion: 'concerned' },
        ]);
        speakResponse(msg);
        setIsThinking(false);
        return;
      }

      const baseVisuals = buildVisualsFromProfile(profile, text);
      setVisuals(baseVisuals);

      try {
        const res = await fetch('/api/ai/avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: text,
            userContext: profileToFinancialSituation(profile),
            profile,
          }),
        });

        let answer: string;
        let nextVisuals = baseVisuals;
        let nextEmotion: AvatarEmotion = 'calm';

        if (res.ok) {
          const data = await res.json();
          answer = data.answer;
          if (data.visuals) nextVisuals = data.visuals;
          nextEmotion =
            data.emotion ??
            detectEmotionFromMetrics({
              healthScore: nextVisuals.healthScore,
              emiBurdenPercent: nextVisuals.emiBurdenPercent,
            });
          nextEmotion = detectEmotionFromText(answer, text) || nextEmotion;
        } else {
          const errBody = await res.json().catch(() => ({}));
          answer =
            typeof errBody.error === 'string'
              ? errBody.error
              : `Service unavailable (${res.status}). Check GEMINI_API_KEY in .env.local and restart the dev server.`;
          nextEmotion = detectEmotionFromText(answer, text);
        }

        setVisuals(nextVisuals);
        setEmotion(nextEmotion);
        setMessages((m) => [
          ...m,
          { id: crypto.randomUUID(), role: 'advisor', content: answer, emotion: nextEmotion },
        ]);
        speakResponse(answer);
      } catch {
        const fallback =
          'Something went wrong. Please check your connection and ensure GEMINI_API_KEY is set.';
        setEmotion('concerned');
        setMessages((m) => [
          ...m,
          { id: crypto.randomUUID(), role: 'advisor', content: fallback, emotion: 'concerned' },
        ]);
      } finally {
        setIsThinking(false);
      }
    },
    [input, isThinking, profile, speakResponse]
  );

  const startVoiceInput = useCallback(() => {
    voice.resetTranscript();
    voice.startListening();
  }, [voice]);

  const stopVoiceInput = useCallback(() => {
    voice.stopListening();
    if (voice.transcript.trim()) {
      void sendMessage(voice.transcript.trim());
      voice.resetTranscript();
    }
  }, [voice, sendMessage]);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isThinking,
    emotion,
    avatarState,
    mouthOpen,
    visuals,
    voiceEnabled,
    setVoiceEnabled,
    voiceSupported: voice.isSupported,
    isListening: voice.isListening,
    isSpeaking: voice.isSpeaking,
    startVoiceInput,
    stopVoiceInput,
    stopSpeaking: voice.stopSpeaking,
  };
}
