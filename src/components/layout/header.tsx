"use client";

import Link from 'next/link';
import {
  LayoutDashboard,
  BookCopy,
  FileQuestion,
  Bookmark,
  BrainCircuit,
  PanelLeft,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { SearchHandler } from './search-handler';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/materials', icon: BookCopy, label: 'Materials' },
    { href: '/quizzes', icon: FileQuestion, label: 'Quizzes' },
    { href: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
];

export function Header({ pageTitle }: { pageTitle: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <BrainCircuit className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">NeuroZsis</span>
            </Link>
            {navItems.map((item) => (
                <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                <item.icon className="h-5 w-5" />
                {item.label}
                </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex-1">
        <h1 className="text-xl font-semibold">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-2">
        <SearchHandler />
        <ThemeToggle />
      </div>
    </header>
  );
}
