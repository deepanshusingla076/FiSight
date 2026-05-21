'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FinancialAvatar } from '@/components/avatar/financial-avatar';

export function AvatarPreviewSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} id="avatar" className="py-20 md:py-28">
      <div className="container grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            <Bot className="h-4 w-4" />
            New · AI Financial Avatar
          </div>
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            A humanized advisor—not a chat bubble
          </h2>
          <p className="mt-4 text-muted-foreground">
            Meet Aria: she listens, thinks, speaks with lip-sync, reacts emotionally, and explains EMIs and affordability with live animated charts.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>✓ Voice + finance-only AI guardrails</li>
            <li>✓ Listening, speaking, warning & celebration states</li>
            <li>✓ Dynamic EMI, savings & health visualizations</li>
            <li>✓ Floating assistant on every dashboard page</li>
          </ul>
          <Button asChild size="lg" className="mt-8 gap-2">
            <Link href="/login">
              Try the avatar advisor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          className="relative flex justify-center rounded-3xl border bg-gradient-to-br from-slate-900/5 via-primary/10 to-indigo-500/10 p-10 dark:from-slate-800/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <FinancialAvatar state="speaking" mouthOpen={0.45} className="scale-110" />
        </motion.div>
      </div>
    </section>
  );
}
