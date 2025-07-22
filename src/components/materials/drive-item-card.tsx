import type { DriveItem } from "@/types";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DriveIcon } from "./drive-icon";
import { MoreVertical, Trash2 } from "lucide-react";

type DriveItemCardProps = {
  item: DriveItem;
  onItemClick: (item: DriveItem) => void;
  onDeleteClick: (item: DriveItem) => void;
};

export function DriveItemCard({ item, onItemClick, onDeleteClick }: DriveItemCardProps) {
  const isFolder = item.type === 'folder';

  return (
    <Card
      className="group flex flex-col justify-between overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
    >
      <div className="absolute top-1 right-1 z-10">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDeleteClick(item); }}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Hapus</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div onClick={() => onItemClick(item)} className="cursor-pointer h-full">
        <CardContent className="p-4 flex flex-col items-center justify-center gap-3 h-full">
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

            <div className="flex items-center w-full gap-2 mt-auto">
                <DriveIcon itemType={item.type} fileType={item.fileType} className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium truncate" title={item.name}>{item.name}</span>
            </div>
        </CardContent>
      </div>
    </Card>
  );
}
