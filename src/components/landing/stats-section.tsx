'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, Shield, TrendingUp, Users } from 'lucide-react';

const stats = [
  { icon: Users, label: 'Core features', value: '4' },
  { icon: Brain, label: 'AI modules', value: '3' },
  { icon: TrendingUp, label: 'Planning workflows', value: '6+' },
  { icon: Shield, label: 'Project stage', value: 'Demo' },
];

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="border-y bg-muted/40 py-16">
      <div className="container grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <p className="font-headline text-3xl font-bold">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
