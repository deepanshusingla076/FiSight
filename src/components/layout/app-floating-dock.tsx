'use client';

/**
 * Single bottom-right dock: AI advisor + quick actions (no overlapping FABs).
 */
import { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Calculator,
  LayoutDashboard,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FloatingAvatarAssistant } from '@/components/avatar/floating-avatar-assistant';

const quickLinks = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'bg-blue-600 hover:bg-blue-700' },
  { href: '/affordability', icon: Calculator, label: 'Affordability', color: 'bg-violet-600 hover:bg-violet-700' },
  { href: '/advisor', icon: Bot, label: 'Full advisor', color: 'bg-emerald-600 hover:bg-emerald-700' },
];

export function AppFloatingDock() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <FloatingAvatarAssistant />

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {menuOpen && (
          <div className="flex flex-col-reverse items-end gap-2.5">
            {quickLinks.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105',
                  item.color
                )}
                style={{ transitionDelay: `${i * 40}ms` }}
                title={item.label}
              >
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        <Button
          size="icon"
          className={cn(
            'h-12 w-12 rounded-full shadow-lg',
            menuOpen && 'rotate-45'
          )}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Quick actions'}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </Button>
      </div>
    </>
  );
}
