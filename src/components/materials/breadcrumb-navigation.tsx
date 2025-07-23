"use client";

import type { DriveItem } from "@/types";
import { ChevronRight, Home } from "lucide-react";
import { Button } from "../ui/button";

type BreadcrumbNavigationProps = {
  path: DriveItem[];
  onBreadcrumbClick: (folderId: string | null) => void;
};

export function BreadcrumbNavigation({ path, onBreadcrumbClick }: BreadcrumbNavigationProps) {
  return (
    <nav className="flex items-center text-xs md:text-sm font-medium text-muted-foreground flex-wrap gap-1 min-w-0">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 pr-1 h-8 text-xs md:text-sm"
        onClick={() => onBreadcrumbClick(null)}
      >
        <Home className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">Materi</span>
      </Button>
      {path.map((folder, index) => (
        <div key={folder.id} className="flex items-center min-w-0">
          <ChevronRight className="h-3 w-3 md:h-4 md:w-4 mx-1 flex-shrink-0" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBreadcrumbClick(folder.id)}
            disabled={index === path.length - 1}
            className="disabled:opacity-100 disabled:cursor-default disabled:hover:bg-transparent px-1 md:px-2 truncate max-w-[100px] md:max-w-[150px] h-8 text-xs md:text-sm"
            title={folder.name}
          >
            {folder.name}
          </Button>
        </div>
      ))}
    </nav>
  );
}
