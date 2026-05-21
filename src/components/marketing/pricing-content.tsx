'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Explore dashboards and limited AI chats.',
    features: ['Dashboard & widgets', '5 AI chats / day', 'Manual profile', 'EN / HI interface'],
    cta: 'Get started',
    href: '/login',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/ month',
    description: 'Full ML predictions and unlimited advisor access.',
    features: [
      'Unlimited AI advisor',
      'All ML models',
      'Scenario & affordability tools',
      'Voice assistant',
      'Priority support',
    ],
    cta: 'Start Pro trial',
    href: '/login',
    highlighted: true,
  },
  {
    name: 'Family',
    price: '$24',
    period: '/ month',
    description: 'Shared goals and profiles for households.',
    features: ['Everything in Pro', 'Up to 5 members', 'Shared goals', 'Export reports (soon)'],
    cta: 'Contact sales',
    href: '/#contact',
    highlighted: false,
  },
];

export function PricingContent() {
  return (
    <section className="container py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold md:text-5xl">Simple, transparent pricing</h1>
        <p className="mt-4 text-muted-foreground">Start free. Upgrade when you need ML depth and unlimited AI guidance.</p>
      </div>
      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              'flex flex-col',
              plan.highlighted && 'border-primary shadow-lg ring-2 ring-primary/20'
            )}
          >
            <CardHeader>
              {plan.highlighted && (
                <span className="mb-2 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Most popular
                </span>
              )}
              <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <p className="pt-4 font-headline text-4xl font-bold">
                {plan.price}
                <span className="text-base font-normal text-muted-foreground">{plan.period}</span>
              </p>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant={plan.highlighted ? 'default' : 'outline'}>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
