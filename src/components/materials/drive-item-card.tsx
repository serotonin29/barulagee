import type { DriveItem } from "@/types";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { DriveIcon } from "./drive-icon";

type DriveItemCardProps = {
  item: DriveItem;
  onItemClick: (item: DriveItem) => void;
};

export function DriveItemCard({ item, onItemClick }: DriveItemCardProps) {
  const isFolder = item.type === 'folder';

  return (
    <Card
      onClick={() => onItemClick(item)}
      className="group flex flex-col justify-between overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <CardContent className="p-4 flex flex-col items-center justify-center gap-3">
        {item.type === 'file' && item.coverImage ? (
            <Image 
                src={item.coverImage}
                alt={item.name}
                width={150}
                height={100}
                className="w-full h-24 object-cover rounded-md"
                data-ai-hint={item.dataAiHint}
            />
        ) : (
            <div className="flex items-center justify-center w-full h-24 rounded-lg bg-muted">
                <DriveIcon itemType={item.type} fileType={item.fileType} className="w-12 h-12 text-muted-foreground" />
            </div>
        )}

        <div className="flex items-center w-full gap-2">
            <DriveIcon itemType={item.type} fileType={item.fileType} className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium truncate" title={item.name}>{item.name}</span>
        </div>
      </CardContent>
    </Card>
  );
}
