import Link from 'next/link';
import { BookCopy, FileQuestion, Bookmark, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const shortcutItems = [
  { href: '/materials', icon: BookCopy, label: 'Katalog Materi' },
  { href: '/quizzes', icon: FileQuestion, label: 'Quiz' },
  { href: '/bookmarks', icon: Bookmark, label: 'Bookmark' },
  { href: '/chat', icon: MessageSquare, label: 'Chat AI' },
];

export function FeatureShortcuts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {shortcutItems.map((item) => (
        <Link href={item.href} key={item.label}>
          <Card className="hover:bg-accent hover:text-accent-foreground transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* You can add more content here if needed */}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
