'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link2, LineChart, MessageSquare } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Link2,
    title: 'Connect your profile',
    description:
      'Sign in securely and add income, expenses, goals, and portfolio details. Your data stays encrypted and under your control.',
  },
  {
    step: '02',
    icon: LineChart,
    title: 'Run ML + analytics',
    description:
      'FiSight scores affordability, health, investment risk, and scenarios using trained models plus real-time dashboards.',
  },
  {
    step: '03',
    icon: MessageSquare,
    title: 'Act with AI guidance',
    description:
      'Chat with a finance-only AI advisor that explains trade-offs in plain language—English or Hindi.',
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how-it-works" ref={ref} className="py-20 md:py-28">
      <div className="container">
        <motion.div
          className="mx-auto mb-14 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="font-headline text-3xl font-bold md:text-4xl">How FiSight works</h2>
          <p className="mt-4 text-muted-foreground">
            Three steps from confusion to a clear financial plan—built like a real product, not a demo spreadsheet.
          </p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              className="relative rounded-2xl border bg-card/80 p-8 shadow-sm backdrop-blur"
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.12 }}
            >
              <span className="font-headline text-5xl font-bold text-primary/15">{item.step}</span>
              <item.icon className="mt-4 h-8 w-8 text-primary" />
              <h3 className="mt-4 font-headline text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
