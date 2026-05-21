'use client';

import { useState } from 'react';
import { Bot, Maximize2, X, UserRound } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AvatarAdvisorExperience } from './avatar-advisor-experience';

export function FloatingAvatarAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-[5.75rem] right-6 z-[45] flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-emerald-500/50 bg-slate-900 shadow-xl transition hover:scale-105 hover:border-emerald-400"
            onClick={() => setOpen(true)}
            aria-label="Open AI financial advisor"
          >
            <UserRound className="h-7 w-7 text-emerald-400" strokeWidth={1.5} />
            <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </motion.button>
        )}
      </AnimatePresence>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="flex w-full flex-col overflow-hidden p-0 sm:max-w-xl md:max-w-2xl"
        >
          <SheetHeader className="shrink-0 space-y-0 border-b px-6 py-4 pr-14">
            <div className="flex items-center justify-between gap-3">
              <SheetTitle className="flex items-center gap-2 font-headline text-base">
                <Bot className="h-5 w-5 text-primary" />
                Aria · Financial Advisor
              </SheetTitle>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/advisor" onClick={() => setOpen(false)}>
                    <Maximize2 className="mr-1.5 h-4 w-4" />
                    Expand
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setOpen(false)}
                  aria-label="Close advisor panel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-4 pb-8">
            <AvatarAdvisorExperience />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
