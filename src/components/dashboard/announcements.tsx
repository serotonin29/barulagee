"use client";

import { Megaphone, Calendar, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { announcements } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

const announcementIcons: { [key: string]: React.ReactNode } = {
  'Final Exams Schedule': <Calendar className="h-6 w-6 text-destructive" />,
  'New Course Available': <BookOpen className="h-6 w-6 text-blue-500" />,
  'default': <Megaphone className="h-6 w-6 text-primary" />,
};

export function Announcements() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengumuman Penting</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="flex items-start gap-4 p-4 rounded-lg border bg-muted/40">
              <div className="flex-shrink-0">
                {announcementIcons[announcement.title] || announcementIcons.default}
              </div>
              <div className="flex-grow">
                <p className="font-semibold">{announcement.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
              </div>
              <Badge variant="outline" className="flex-shrink-0">
                {new Date(announcement.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
