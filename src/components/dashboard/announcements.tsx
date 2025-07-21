import { Megaphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { announcements } from '@/lib/data';

export function Announcements() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Pengumuman Penting</CardTitle>
        <Megaphone className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="grid gap-1">
              <p className="font-semibold">{announcement.title}</p>
              <p className="text-sm text-muted-foreground">{announcement.content}</p>
              <p className="text-xs text-muted-foreground">{new Date(announcement.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
