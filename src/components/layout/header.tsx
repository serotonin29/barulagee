"use client";

import Link from 'next/link';
import {
  LayoutDashboard,
  BookCopy,
  FileQuestion,
  Bookmark,
  MessageSquare,
  Users,
  BrainCircuit,
  PanelLeft,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { SearchHandler } from './search-handler';

const navItems = [
    { href: '/materials', icon: BookCopy, label: 'Materi' },
    { href: '/quizzes', icon: FileQuestion, label: 'Quiz' },
    { href: '/bookmarks', icon: Bookmark, label: 'Bookmark' },
    { href: '/forum', icon: Users, label: 'Forum' },
    { href: '/chat', icon: MessageSquare, label: 'Chat AI' },
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
            <Link
                href="/dashboard"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
            </Link>
            {navItems.map((item) => (
                <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                <item.icon className="h-5 w-5" />
                {item.label}
                </Link>
            ))}
             <Link
                href="/settings"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                <Settings className="h-5 w-5" />
                Pengaturan
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex-1">
        <h1 className="text-xl font-semibold">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-4">
        <SearchHandler />
        <ThemeToggle />
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Avatar>
                  <AvatarImage src="https://placehold.co/32x32" alt="@shadcn" />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
    </header>
  );
}
