'use client';

import { useEffect, useState } from 'react';

/** Drives mouth openness 0–1 while TTS is active (pseudo lip-sync). */
export function useLipSync(isSpeaking: boolean) {
  const [mouthOpen, setMouthOpen] = useState(0);

  useEffect(() => {
    if (!isSpeaking) {
      setMouthOpen(0);
      return;
    }

    const tick = () => setMouthOpen(0.15 + Math.random() * 0.75);
    tick();
    const id = window.setInterval(tick, 85);
    return () => window.clearInterval(id);
  }, [isSpeaking]);

  return mouthOpen;
}
