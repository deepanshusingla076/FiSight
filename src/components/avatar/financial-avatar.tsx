'use client';

import { motion } from 'framer-motion';
import type { AvatarState } from '@/lib/avatar-emotion';
import { cn } from '@/lib/utils';

type FinancialAvatarProps = {
  state: AvatarState;
  mouthOpen: number;
  className?: string;
  compact?: boolean;
};

const ringColor: Record<AvatarState, string> = {
  idle: 'ring-emerald-500/40',
  listening: 'ring-blue-500/60',
  thinking: 'ring-violet-500/50',
  speaking: 'ring-primary/70',
  happy: 'ring-green-500/50',
  warning: 'ring-amber-500/70',
  concerned: 'ring-rose-500/60',
  celebrating: 'ring-teal-400/60',
};

const statusLabel: Record<AvatarState, string> = {
  idle: 'Online',
  listening: 'Listening',
  thinking: 'Analyzing',
  speaking: 'Speaking',
  happy: 'Positive outlook',
  warning: 'Risk alert',
  concerned: 'Review needed',
  celebrating: 'Goal on track',
};

/** Professional bust portrait — enterprise fintech advisor (not cartoon). */
export function FinancialAvatar({ state, mouthOpen, className, compact }: FinancialAvatarProps) {
  const dim = compact ? 88 : 220;
  const lipH = 2 + mouthOpen * (compact ? 8 : 14);
  const lipW = (compact ? 18 : 36) + mouthOpen * (compact ? 8 : 16);

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      <motion.div
        className={cn(
          'relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 shadow-2xl ring-4 ring-offset-2 ring-offset-background',
          ringColor[state],
          compact ? 'h-[88px] w-[88px] rounded-full ring-2' : 'h-[220px] w-[200px] min-h-[220px] min-w-[200px]'
        )}
      >
        <svg
          viewBox="0 0 200 240"
          width={dim}
          height={compact ? dim : dim * 1.1}
          className="block"
          aria-hidden
        >
          <defs>
            <linearGradient id="suitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e8c4a8" />
              <stop offset="100%" stopColor="#c9a882" />
            </linearGradient>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a5f" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          <rect width="200" height="240" fill="url(#bgGrad)" />

          {/* Shoulders / blazer */}
          <path d="M20 175 L100 145 L180 175 L200 240 L0 240 Z" fill="url(#suitGrad)" />
          <path d="M75 155 L100 148 L125 155 L130 200 L70 200 Z" fill="#334155" opacity="0.6" />
          <path d="M92 148 L108 148 L105 210 L95 210 Z" fill="#047857" />
          <path d="M96 148 L104 148 L102 215 L98 215 Z" fill="#059669" />

          {/* Neck */}
          <rect x="88" y="128" width="24" height="28" fill="url(#skinGrad)" />

          {/* Head — mature proportions */}
          <ellipse cx="100" cy="88" rx="42" ry="48" fill="url(#skinGrad)" />
          <ellipse cx="100" cy="92" rx="38" ry="42" fill="#d4b896" opacity="0.35" />

          {/* Hair */}
          <path
            d="M58 78 Q100 28 142 78 Q138 52 100 42 Q62 52 58 78 Z"
            fill="#1e293b"
          />
          <path d="M58 78 Q70 65 85 72" fill="#334155" opacity="0.5" />

          {/* Glasses — professional */}
          <rect x="62" y="82" width="32" height="22" rx="4" fill="none" stroke="#475569" strokeWidth="2" />
          <rect x="106" y="82" width="32" height="22" rx="4" fill="none" stroke="#475569" strokeWidth="2" />
          <line x1="94" y1="92" x2="106" y2="92" stroke="#475569" strokeWidth="2" />

          {/* Eyes */}
          <g>
            <ellipse cx="78" cy="92" rx="6" ry="7" fill="#1e293b" />
            <ellipse cx="122" cy="92" rx="6" ry="7" fill="#1e293b" />
            <circle cx="80" cy="90" r="2" fill="#f8fafc" opacity="0.9" />
            <circle cx="124" cy="90" r="2" fill="#f8fafc" opacity="0.9" />
          </g>

          {/* Brows */}
          <path
            d={
              state === 'warning' || state === 'concerned'
                ? 'M64 74 L86 70 L90 74'
                : 'M64 76 L86 72 L90 76'
            }
            stroke="#3f2e1f"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={
              state === 'warning' || state === 'concerned'
                ? 'M110 74 L132 70 L136 74'
                : 'M110 76 L132 72 L136 76'
            }
            stroke="#3f2e1f"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Mouth — lip sync */}
          <ellipse
            cx="100"
            cy="118"
            rx={lipW / 2}
            ry={lipH / 2}
            fill={mouthOpen > 0.08 ? '#7c4a3a' : 'none'}
            stroke="#7c4a3a"
            strokeWidth={mouthOpen > 0.08 ? 0 : 2}
          />

          {/* Subtle smile when happy */}
          {(state === 'happy' || state === 'celebrating') && mouthOpen < 0.1 && (
            <path d="M88 120 Q100 126 112 120" stroke="#7c4a3a" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}
        </svg>

        {(state === 'listening' || state === 'speaking') && !compact && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-0.5 px-4">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-emerald-400/90 h-1"
              />
            ))}
          </div>
        )}
      </motion.div>

      {!compact && (
        <div className="mt-4 flex flex-col items-center gap-1">
          <p className="font-headline text-sm font-semibold text-foreground">Sophia Sterling</p>
          <p className="text-xs text-muted-foreground">CFP® · AI Financial Advisor</p>
          <span
            className={cn(
              'mt-1 rounded-full px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider',
              state === 'warning' && 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
              state === 'concerned' && 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
              (state === 'listening' || state === 'speaking') && 'bg-primary/15 text-primary',
              state === 'idle' && 'bg-muted text-muted-foreground',
              !['warning', 'concerned', 'listening', 'speaking', 'idle'].includes(state) &&
                'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
            )}
          >
            {statusLabel[state]}
          </span>
        </div>
      )}
    </div>
  );
}
