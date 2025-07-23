
"use client";

import type { DriveItem } from "@/types";
import { DriveItemCard } from "./drive-item-card";

type DriveItemGridProps = {
    items: DriveItem[];
    onFolderClick: (folderId: string) => void;
    onFileClick: (file: DriveItem) => void;
    onDeleteClick?: (item: DriveItem) => void;
};

export function DriveItemGrid({ items, onFolderClick, onFileClick, onDeleteClick }: DriveItemGridProps) {
  
  const onItemClick = (item: DriveItem) => {
    if (item.type === 'folder') {
      onFolderClick(item.id);
    } else {
        onFileClick(item);
    }
  };

  if (items.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-48 md:h-64 text-center rounded-lg border-2 border-dashed mx-4 md:mx-0">
            <h3 className="text-base md:text-lg font-semibold">Folder ini kosong</h3>
            <p className="text-sm md:text-base text-muted-foreground mt-1">Upload file atau buat folder baru untuk memulai.</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 px-2 md:px-0">
      {items.map((item) => (
        <DriveItemCard 
          key={item.id} 
          item={item} 
          onItemClick={onItemClick} 
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
}
