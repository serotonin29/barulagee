import Image from 'next/image';
import { FileText, Video, ImageIcon, Bookmark } from 'lucide-react';
import type { Material } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type MaterialCardProps = {
  material: Material;
  onBookmarkToggle: (id: string) => void;
};

const typeIcons = {
  pdf: <FileText className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  infographic: <ImageIcon className="w-4 h-4" />,
  text: <FileText className="w-4 h-4" />,
};

export function MaterialCard({ material, onBookmarkToggle }: MaterialCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            alt={material.title}
            className="object-cover w-full h-48"
            height="200"
            src={material.coverImage}
            data-ai-hint={material.dataAiHint}
            style={{
              aspectRatio: '300/200',
              objectFit: 'cover',
            }}
            width="300"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={() => onBookmarkToggle(material.id)}
          >
            <Bookmark
              className={`w-4 h-4 ${
                material.bookmarked ? 'text-primary fill-primary' : 'text-muted-foreground'
              }`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="outline" className="mb-2">{material.category}</Badge>
        <h3 className="text-lg font-semibold">{material.title}</h3>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 p-4 pt-0">
         <div className="flex items-center gap-2 text-sm text-muted-foreground w-full">
            {typeIcons[material.type]}
            <span>{material.type.charAt(0).toUpperCase() + material.type.slice(1)}</span>
         </div>
        {material.progress > 0 && (
          <div className="w-full">
            <Progress value={material.progress} className="w-full h-2" />
            <p className="text-xs text-muted-foreground mt-1">{material.progress}% complete</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
