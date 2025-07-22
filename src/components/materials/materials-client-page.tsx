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
import { MaterialCatalog } from './material-catalog';
import { Upload } from 'lucide-react';

export function MaterialsClientPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // TODO: Replace with actual role check from user session
    const userRole = 'admin'; 

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div></div>
                {(userRole === 'admin' || userRole === 'dosen') && (
                     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Materi Baru
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
                )}
            </div>
            <MaterialCatalog />
        </div>
    )
}
