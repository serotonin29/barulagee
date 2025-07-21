import Link from 'next/link';
import { BookCopy, FileQuestion, Bookmark, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '../ui/button';

const shortcutItems = [
  { href: '/materials', icon: BookCopy, label: 'Katalog Materi' },
  { href: '/quizzes', icon: FileQuestion, label: 'Quiz Interaktif' },
  { href: '/bookmarks', icon: Bookmark, label: 'Materi Tersimpan' },
  { href: '/chat', icon: MessageSquare, label: 'Tanya AI' },
];

export function FeatureShortcuts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Akses Cepat</CardTitle>
        <CardDescription>Navigasi ke fitur utama dengan satu klik.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {shortcutItems.map((item) => (
            <Link href={item.href} key={item.label}>
              <div className="flex flex-col items-center justify-center p-4 text-center rounded-lg border hover:bg-accent transition-colors">
                <item.icon className="h-8 w-8 mb-2 text-primary" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
