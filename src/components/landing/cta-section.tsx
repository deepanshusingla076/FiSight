'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 md:py-28">
      <motion.div
        className="container rounded-3xl bg-gradient-to-br from-primary/90 to-primary px-8 py-16 text-center text-primary-foreground shadow-xl md:px-16"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-headline text-3xl font-bold md:text-4xl">
          Your AI financial brain starts here
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">
          Join FiSight—analytics, forecasting, and a finance-only assistant in one workspace.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link href="/login">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
            <Link href="/features">Explore features</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
