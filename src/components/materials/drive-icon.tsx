import { Folder, File, FileText, Video, ImageIcon, Image as LucideImage } from "lucide-react";
import type { DriveItem } from "@/types";
import { cn } from "@/lib/utils";

type DriveIconProps = {
    itemType: DriveItem['type'];
    fileType?: DriveItem['fileType'];
    className?: string;
};

export function DriveIcon({ itemType, fileType, className }: DriveIconProps) {
    if (itemType === 'folder') {
        return <Folder className={cn("text-primary", className)} />;
    }

    switch (fileType) {
        case 'pdf':
            return <FileText className={cn("text-red-500", className)} />;
        case 'video':
            return <Video className={cn("text-blue-500", className)} />;
        case 'infographic':
            return <ImageIcon className={cn("text-purple-500", className)} />;
        case 'image':
            return <LucideImage className={cn("text-green-500", className)} />;
        case 'text':
            return <File className={cn("text-gray-500", className)} />;
        default:
            return <File className={cn("text-gray-500", className)} />;
    }
}
