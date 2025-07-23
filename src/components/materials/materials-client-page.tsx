
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
import { useAuth } from '@/contexts/auth-context';
import { UploadMaterialForm } from '@/components/admin/upload-material-form';
import { FolderPlus, Upload, Loader2, Download, Eye } from 'lucide-react';
import type { DriveItem } from '@/types';
import { BreadcrumbNavigation } from './breadcrumb-navigation';
import { DriveItemGrid } from './drive-item-grid';

const newFolderSchema = z.object({
  name: z.string().min(1, { message: 'Nama folder tidak boleh kosong.' }),
});

const WARNING_ACKNOWLEDGED_KEY = 'materialWarningAcknowledged';
const DRIVE_ITEMS_STORAGE_KEY = 'driveItems';

export function MaterialsClientPage({ initialItems }: { initialItems: DriveItem[] }) {
    const [items, setItems] = useState<DriveItem[]>(() => {
        if (typeof window === 'undefined') {
            return initialItems;
        }
        try {
            const storedItems = localStorage.getItem(DRIVE_ITEMS_STORAGE_KEY);
            return storedItems ? JSON.parse(storedItems) : initialItems;
        } catch (error) {
            console.error("Failed to load from localStorage", error);
            return initialItems;
        }
    });
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<DriveItem | null>(null);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [showWarning, setShowWarning] = useState(false);
    const [previewItem, setPreviewItem] = useState<DriveItem | null>(null);
    const { toast } = useToast();
    const { permissions } = useAuth();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isAcknowledged = sessionStorage.getItem(WARNING_ACKNOWLEDGED_KEY);
            if (isAcknowledged !== 'true') {
                setShowWarning(true);
            }
        }
    }, []);
    
    // Save items to localStorage whenever they change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(DRIVE_ITEMS_STORAGE_KEY, JSON.stringify(items));
            } catch (error) {
                console.error("Failed to save to localStorage", error);
            }
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
        // Always show preview only - prevent direct downloads and external links
        setPreviewItem(file);
        
        toast({
            title: "Preview Mode",
            description: "File ditampilkan dalam mode preview untuk menjaga keamanan konten.",
        });
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
        const itemsToRemove = new Set<string>([itemToDelete.id]);
        
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
        <div className="space-y-4 md:space-y-6">
             <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
                <AlertDialogContent className="max-w-md mx-4 md:max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg md:text-xl">Perhatian Penting!</AlertDialogTitle>
                        <div className="text-sm text-muted-foreground pt-2 space-y-2">
                            <span>Semua materi yang tersedia di halaman ini bersifat rahasia dan hanya untuk penggunaan internal dalam lingkungan akademik.</span>
                            <div>Dengan melanjutkan, Anda setuju untuk <strong>tidak membagikan, menyebarkan, atau mendistribusikan</strong> konten ini kepada pihak mana pun di luar platform ini.</div>
                            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                                    <Eye className="h-4 w-4" />
                                    <span className="text-xs font-medium">File hanya dapat dilihat dalam mode preview</span>
                                </div>
                            </div>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleAcknowledge}>Saya Mengerti</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                <div className="min-w-0 flex-1">
                    <BreadcrumbNavigation path={path} onBreadcrumbClick={handleBreadcrumbClick} />
                </div>

                {(permissions.canUploadMaterials || permissions.canCreateFolders) && (
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                         {permissions.canCreateFolders && (
                            <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-xs md:text-sm">
                                        <FolderPlus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                                        <span className="hidden sm:inline">Folder</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="mx-4 max-w-md md:max-w-lg">
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
                                            <DialogFooter className="flex-col sm:flex-row gap-2">
                                                <DialogClose asChild>
                                                    <Button type="button" variant="secondary" className="w-full sm:w-auto">Batal</Button>
                                                </DialogClose>
                                                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
                                                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Buat
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                         )}

                        {permissions.canUploadMaterials && (
                            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="text-xs md:text-sm">
                                        <Upload className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                                        <span className="hidden sm:inline">Upload</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="mx-4 max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto">
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
                        )}
                    </div>
                )}
            </div>
            
            <DriveItemGrid 
                items={currentItems} 
                onFolderClick={handleFolderClick} 
                onFileClick={handleFileClick}
                onDeleteClick={permissions.canDeleteMaterials ? handleDeleteRequest : undefined} 
            />
            
            {permissions.canDeleteMaterials && (
                <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                    <AlertDialogContent className="mx-4 max-w-md md:max-w-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus secara permanen 
                                 {itemToDelete?.type === 'folder' ? ' folder' : ' file'} <span className="font-bold">&quot;{itemToDelete?.name}&quot;</span>
                                 {itemToDelete?.type === 'folder' && ' dan semua isinya'}.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel onClick={() => setItemToDelete(null)} className="w-full sm:w-auto">Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="w-full sm:w-auto">Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            
            <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
                <DialogContent className="mx-2 md:mx-4 max-w-full md:max-w-4xl h-[85vh] md:h-[80vh] flex flex-col">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="text-sm md:text-base truncate">{previewItem?.name}</DialogTitle>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            <span>Mode Preview - Download tidak tersedia</span>
                        </div>
                    </DialogHeader>
                    <div className="flex-1 min-h-0 w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                    {previewItem?.sourceType === 'youtube' && previewItem.source ? (
                        <iframe 
                            className="w-full h-full"
                            src={`${previewItem.source}?autoplay=0&controls=1&disablekb=1&fs=0&modestbranding=1&rel=0`}
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    ) : previewItem?.source && (previewItem.fileType === 'pdf' || previewItem.fileType === 'video' || previewItem.fileType === 'image') && previewItem.sourceType === 'firebase-storage' ? (
                        previewItem.fileType === 'pdf' ? (
                            <iframe 
                                className="w-full h-full"
                                src={`${previewItem.source}#toolbar=0&navpanes=0&scrollbar=0`}
                                title={previewItem.name}
                                sandbox="allow-same-origin"
                            ></iframe>
                        ) : previewItem.fileType === 'video' ? (
                            <video 
                                controls 
                                controlsList="nodownload nofullscreen" 
                                src={previewItem.source} 
                                className="max-w-full max-h-full"
                                onContextMenu={(e) => e.preventDefault()}
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img 
                                src={previewItem.source} 
                                alt={previewItem.name} 
                                className="max-w-full max-h-full object-contain select-none" 
                                onContextMenu={(e) => e.preventDefault()}
                                draggable={false}
                            />
                        )
                    ) : (
                       <div className="text-center p-8">
                           <div className="text-gray-400 mb-2">
                               <Download className="h-12 w-12 mx-auto opacity-50" />
                           </div>
                           <p className="text-sm text-gray-500">Preview tidak tersedia untuk tipe file ini.</p>
                       </div>
                    )}
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}
