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
    <nav className="flex items-center text-sm font-medium text-muted-foreground">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => onBreadcrumbClick(null)}
      >
        <Home className="h-4 w-4" />
        Materi
      </Button>
      {path.map((folder, index) => (
        <div key={folder.id} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBreadcrumbClick(folder.id)}
            disabled={index === path.length - 1}
            className="disabled:opacity-100 disabled:cursor-default disabled:hover:bg-transparent"
          >
            {folder.name}
          </Button>
        </div>
      ))}
    </nav>
  );
}
