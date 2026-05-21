'use client';

import { CommandCenterLayout } from '@/components/layout/command-center-layout';

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <CommandCenterLayout>{children}</CommandCenterLayout>;
}
