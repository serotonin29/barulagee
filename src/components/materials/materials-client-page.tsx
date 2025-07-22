"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UploadMaterialForm } from '@/components/admin/upload-material-form';
import { FolderPlus, Upload, Loader2 } from 'lucide-react';
import type { DriveItem } from '@/types';
import { BreadcrumbNavigation } from './breadcrumb-navigation';
import { DriveItemGrid } from './drive-item-grid';

const newFolderSchema = z.object({
  name: z.string().min(1, { message: 'Nama folder tidak boleh kosong.' }),
});

export function MaterialsClientPage({ initialItems }: { initialItems: DriveItem[] }) {
    const [items, setItems] = useState<DriveItem[]>(initialItems);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const { toast } = useToast();

    // TODO: Replace with actual role check from user session
    const userRole = 'admin';

    const form = useForm<z.infer<typeof newFolderSchema>>({
      resolver: zodResolver(newFolderSchema),
      defaultValues: { name: '' },
    });

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

    const handleCreateFolderSubmit = (values: z.infer<typeof newFolderSchema>) => {
        const newFolder: DriveItem = {
            id: `folder-${Date.now()}`,
            name: values.name,
            type: 'folder',
            parentId: currentFolderId,
        };
        setItems(prev => [...prev, newFolder]);
        toast({
            title: 'Folder Dibuat',
            description: `Folder "${values.name}" telah berhasil ditambahkan.`,
        });
        form.reset();
        setIsFolderDialogOpen(false);
    };

    const handleMaterialAdd = (material: DriveItem) => {
      setItems(prev => [...prev, material]);
    }


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <BreadcrumbNavigation path={path} onBreadcrumbClick={handleBreadcrumbClick} />

                {(userRole === 'admin' || userRole === 'dosen') && (
                    <div className="flex items-center gap-2">
                         <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <FolderPlus className="mr-2 h-4 w-4" />
                                    Buat Folder
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Buat Folder Baru</DialogTitle>
                                    <DialogDescription>
                                        Masukkan nama untuk folder baru Anda di direktori saat ini.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleCreateFolderSubmit)} className="space-y-4 pt-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="sr-only">Nama Folder</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Contoh: Materi Anatomi Lanjutan" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button type="button" variant="secondary">Batal</Button>
                                            </DialogClose>
                                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Buat
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Materi
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[625px]">
                                <DialogHeader>
                                    <DialogTitle>Tambahkan Materi Pembelajaran</DialogTitle>
                                    <DialogDescription>
                                        Unggah file, impor dari Google Drive, atau sematkan dari URL.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="pt-4">
                                    <UploadMaterialForm 
                                      onMaterialAdd={handleMaterialAdd}
                                      onClose={() => setIsUploadDialogOpen(false)}
                                      currentFolderId={currentFolderId}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
            <DriveItemGrid items={currentItems} onFolderClick={handleFolderClick} />
        </div>
    )
}
