"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UploadMaterialForm } from '@/components/admin/upload-material-form';
import { FolderPlus, Upload } from 'lucide-react';
import type { DriveItem } from '@/types';
import { BreadcrumbNavigation } from './breadcrumb-navigation';
import { DriveItemGrid } from './drive-item-grid';

export function MaterialsClientPage({ initialItems }: { initialItems: DriveItem[] }) {
    const [items, setItems] = useState<DriveItem[]>(initialItems);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

    // TODO: Replace with actual role check from user session
    const userRole = 'admin';

    const handleFolderClick = (folderId: string) => {
        setCurrentFolderId(folderId);
    };

    const handleBreadcrumbClick = (folderId: string | null) => {
        setCurrentFolderId(folderId);
    };

    const currentItems = items.filter(item => item.parentId === currentFolderId);
    const currentFolder = currentFolderId ? items.find(item => item.id === currentFolderId) : null;
    const path = [];
    let folder = currentFolder;
    while(folder) {
        path.unshift(folder);
        folder = items.find(item => item.id === folder!.parentId) || null;
    }


    const handleCreateFolder = () => {
        // In a real app, a dialog would open to get the folder name.
        const newFolderName = prompt("Enter new folder name:");
        if (newFolderName) {
            const newFolder: DriveItem = {
                id: `folder-${Date.now()}`,
                name: newFolderName,
                type: 'folder',
                parentId: currentFolderId,
            };
            setItems(prev => [...prev, newFolder]);
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <BreadcrumbNavigation path={path} onBreadcrumbClick={handleBreadcrumbClick} />

                {(userRole === 'admin' || userRole === 'dosen') && (
                    <div className="flex items-center gap-2">
                         <Button variant="outline" onClick={handleCreateFolder}>
                            <FolderPlus className="mr-2 h-4 w-4" />
                            Buat Folder
                        </Button>
                        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Materi
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[625px]">
                                <DialogHeader>
                                    <DialogTitle>Formulir Upload Materi</DialogTitle>
                                    <DialogDescription>
                                        Isi detail di bawah ini untuk menambahkan materi pembelajaran baru ke sistem.
                                    </DialogDescription>
                                </DialogHeader>
                                <UploadMaterialForm />
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
            <DriveItemGrid items={currentItems} onFolderClick={handleFolderClick} />
        </div>
    )
}
