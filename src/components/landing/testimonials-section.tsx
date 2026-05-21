'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    quote:
      'FiSight helped me understand if I could afford a home loan without drowning in spreadsheets. The affordability score was spot on.',
    name: 'Priya Sharma',
    role: 'Software engineer, Bengaluru',
  },
  {
    quote:
      'The AI chat refuses random questions and stays on finance—that alone makes it more trustworthy than generic ChatGPT for money decisions.',
    name: 'James Chen',
    role: 'Product manager, Singapore',
  },
  {
    quote:
      'Scenario planning showed me what happens if I take a sabbatical. I finally have a plan my partner and I agree on.',
    name: 'Ananya Patel',
    role: 'Designer, Mumbai',
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="bg-muted/30 py-20 md:py-28">
      <div className="container">
        <motion.h2
          className="mb-12 text-center font-headline text-3xl font-bold md:text-4xl"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
        >
          Trusted by people building real plans
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-0 bg-background/80 shadow-md backdrop-blur">
                <CardContent className="flex h-full flex-col p-6">
                  <Quote className="h-8 w-8 text-primary/40" />
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 border-t pt-4">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
