"use client";

import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <SidebarProvider>
          {children}
          <Toaster />
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
