"use client";

import Link from 'next/link';
import {
  LayoutDashboard,
  BookCopy,
  FileQuestion,
  Bookmark,
  Users,
  BrainCircuit,
  PanelLeft,
  Settings,
  LogOut,
  User,
  Sparkles,
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
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';

const navItems = [
    { href: '/materials', icon: BookCopy, label: 'Materi' },
    { href: '/quizzes', icon: FileQuestion, label: 'Quiz' },
    { href: '/bookmarks', icon: Bookmark, label: 'Bookmark' },
    { href: '/ai-learning', icon: Sparkles, label: 'Belajar dengan AI' },
    { href: '/forum', icon: Users, label: 'Forum' },
];

const adminNavItems: Array<{
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [];

export function Header({ pageTitle }: { pageTitle: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logout Successful",
        description: "You have been logged out.",
      });
      router.push('/login');
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  };

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
                className={`flex items-center gap-4 px-2.5 ${pathname === '/dashboard' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
            </Link>
            {navItems.map((item) => (
                <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 px-2.5 ${pathname.startsWith(item.href) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                <item.icon className="h-5 w-5" />
                {item.label}
                </Link>
            ))}
            {adminNavItems.length > 0 && <DropdownMenuSeparator />}
            {adminNavItems.map((item) => (
                 <Link
                 key={item.label}
                 href={item.href}
                 className={`flex items-center gap-4 px-2.5 ${pathname.startsWith(item.href) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                 >
                 <item.icon className="h-5 w-5" />
                 {item.label}
                 </Link>
            ))}
             <DropdownMenuSeparator />
             <Link
                href="/settings"
                className={`flex items-center gap-4 px-2.5 ${pathname === '/settings' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
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
                  <AvatarImage src={user?.photoURL || "https://placehold.co/32x32"} alt={user?.displayName || "User Avatar"} data-ai-hint="user avatar" />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.displayName || 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Pengaturan</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                 <LogOut className="mr-2 h-4 w-4" />
                 <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
    </header>
  );
}
