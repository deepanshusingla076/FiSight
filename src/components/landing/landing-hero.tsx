'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export function LandingHero() {
  const { t } = useLanguage();
  
  return (
    <section className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
      <motion.div 
        className="space-y-6 text-center lg:text-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {t('hero.titlePrefix')}
          <span className="text-primary">{t('hero.titleHighlight')}</span>
          {t('hero.titleSuffix')}
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          {t('hero.subtitle')}
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <Button asChild size="lg">
            <Link href="/login">{t('hero.dashboard')}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/features">{t('hero.learnMore')}</Link>
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="flex justify-center relative overflow-hidden"
        initial={{ opacity: 0, x: 50, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        <motion.div
          className="relative"
          whileHover={{ 
            rotateY: 5,
            rotateX: 2,
            transition: { duration: 0.3 }
          }}
          style={{ perspective: 1000 }}
        >
          <Image 
            src="/banner.png"
            alt="FiSight Financial Dashboard Preview"
            width={600}
            height={452}
            className="h-auto rounded-xl shadow-2xl"
            priority
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
