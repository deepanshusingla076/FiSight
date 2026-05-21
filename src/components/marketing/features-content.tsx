'use client';

import Link from 'next/link';
import {
  BarChart3,
  Bot,
  Calculator,
  Globe,
  LineChart,
  Mic,
  Shield,
  Target,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Bot,
    title: 'AI Financial Advisor',
    description: 'Finance-only conversational AI with guardrails—budgeting, investing, loans, taxes, and goals.',
  },
  {
    icon: LineChart,
    title: 'Predictive Analytics',
    description: 'Expense forecasting, trend analysis, and health scoring powered by ML models.',
  },
  {
    icon: Calculator,
    title: 'Affordability Engine',
    description: 'Simulate major purchases and see maximum safe spend before you commit.',
  },
  {
    icon: BarChart3,
    title: 'Portfolio Intelligence',
    description: 'Track allocations, risk, and AI-assisted rebalancing suggestions.',
  },
  {
    icon: Target,
    title: 'Goal-Based Planning',
    description: 'Set milestones for emergency funds, retirement, and big life events with progress tracking.',
  },
  {
    icon: Wallet,
    title: 'Real-Time Dashboard',
    description: 'Command-center UI with net worth, cash flow, and draggable insight widgets.',
  },
  {
    icon: Globe,
    title: 'Multilingual (EN / HI)',
    description: 'Switch languages across marketing and app surfaces for inclusive guidance.',
  },
  {
    icon: Mic,
    title: 'Voice + Chat',
    description: 'Hands-free questions via speech recognition and spoken responses.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Firebase authentication, encrypted transport, and finance-only AI moderation.',
  },
];

export function FeaturesContent() {
  return (
    <>
      <section className="container py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">Platform capabilities</p>
          <h1 className="mt-4 font-headline text-4xl font-bold md:text-5xl">
            Everything you need for financial clarity
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            FiSight combines Bloomberg-style analytics, Notion-level UX, and ChatGPT-like intelligence—scoped strictly to personal finance.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border bg-card/60 backdrop-blur transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="font-headline text-lg">{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Button asChild size="lg">
            <Link href="/login">Start free</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
