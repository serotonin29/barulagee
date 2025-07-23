
"use client";

import { useState, useEffect } from 'react';
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { FolderPlus, Upload, Loader2, Youtube } from 'lucide-react';
import type { DriveItem } from '@/types';
import { BreadcrumbNavigation } from './breadcrumb-navigation';
import { DriveItemGrid } from './drive-item-grid';

const newFolderSchema = z.object({
  name: z.string().min(1, { message: 'Nama folder tidak boleh kosong.' }),
});

const WARNING_ACKNOWLEDGED_KEY = 'materialWarningAcknowledged';
const DRIVE_ITEMS_STORAGE_KEY = 'driveItems';

export function MaterialsClientPage({ initialItems }: { initialItems: DriveItem[] }) {
    const [items, setItems] = useState<DriveItem[]>(initialItems);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<DriveItem | null>(null);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [showWarning, setShowWarning] = useState(false);
    const [previewItem, setPreviewItem] = useState<DriveItem | null>(null);
    const { toast } = useToast();

    // TODO: Replace with actual role check from user session
    const userRole = 'admin';

    useEffect(() => {
        const isAcknowledged = sessionStorage.getItem(WARNING_ACKNOWLEDGED_KEY);
        if (isAcknowledged !== 'true') {
            setShowWarning(true);
        }
    }, []);
    
    // Load items from localStorage on initial render
    useEffect(() => {
        try {
            const storedItems = localStorage.getItem(DRIVE_ITEMS_STORAGE_KEY);
            if (storedItems) {
                setItems(JSON.parse(storedItems));
            }
        } catch (error) {
            console.error("Failed to load from localStorage", error);
        }
    }, []);

    // Save items to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(DRIVE_ITEMS_STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error("Failed to save to localStorage", error);
        }
    }, [items]);


    const handleAcknowledge = () => {
        sessionStorage.setItem(WARNING_ACKNOWLEDGED_KEY, 'true');
        setShowWarning(false);
    };

    const form = useForm<z.infer<typeof newFolderSchema>>({
      resolver: zodResolver(newFolderSchema),
      defaultValues: { name: '' },
    });

    const handleFolderClick = (folderId: string) => {
        setCurrentFolderId(folderId);
    };
    
    const handleFileClick = (file: DriveItem) => {
        if (file.source) {
            setPreviewItem(file);
        } else {
            alert(`Opening file: ${file.name}. Preview not available.`);
        }
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
    
    const handleDeleteRequest = (item: DriveItem) => {
        setItemToDelete(item);
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;

        const isFolder = itemToDelete.type === 'folder';
        let itemsToRemove = new Set<string>([itemToDelete.id]);
        
        if (isFolder) {
            const findChildrenRecursive = (folderId: string) => {
                const children = items.filter(item => item.parentId === folderId);
                children.forEach(child => {
                    itemsToRemove.add(child.id);
                    if (child.type === 'folder') {
                        findChildrenRecursive(child.id);
                    }
                });
            };
            findChildrenRecursive(itemToDelete.id);
        }

        setItems(prev => prev.filter(item => !itemsToRemove.has(item.id)));
        
        toast({
            title: `${isFolder ? 'Folder' : 'File'} Dihapus`,
            description: `"${itemToDelete.name}" dan semua isinya telah dihapus.`,
        });

        setItemToDelete(null);
    };

    return (
        <div className="space-y-6">
             <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Perhatian Penting!</AlertDialogTitle>
                        <div className="text-sm text-muted-foreground pt-2">
                            <span>Semua materi yang tersedia di halaman ini bersifat rahasia dan hanya untuk penggunaan internal dalam lingkungan akademik.</span>
                            <div className="mt-4">Dengan melanjutkan, Anda setuju untuk <strong>tidak membagikan, menyebarkan, atau mendistribusikan</strong> konten ini kepada pihak mana pun di luar platform ini.</div>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleAcknowledge}>Saya Mengerti</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <BreadcrumbNavigation path={path} onBreadcrumbClick={handleBreadcrumbClick} />

                {(userRole === 'admin' || userRole === 'dosen') && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                         <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <FolderPlus className="mr-2 h-4 w-4" />
                                    Folder
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
                                <Button size="sm">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload
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
            <DriveItemGrid 
                items={currentItems} 
                onFolderClick={handleFolderClick} 
                onFileClick={handleFileClick}
                onDeleteClick={handleDeleteRequest} 
            />
            
            <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus secara permanen 
                             {itemToDelete?.type === 'folder' ? ' folder' : ' file'} <span className="font-bold">"{itemToDelete?.name}"</span>
                             {itemToDelete?.type === 'folder' && ' dan semua isinya'}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setItemToDelete(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
                <DialogContent className="max-w-4xl h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>{previewItem?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="h-full w-full flex items-center justify-center">
                    {previewItem?.sourceType === 'youtube' && previewItem.source ? (
                        <iframe 
                            width="100%" 
                            height="100%"
                            src={previewItem.source}
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                        ></iframe>
                    ) : (
                       <p>Preview tidak tersedia untuk tipe file ini.</p>
                    )}
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}

    