"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, FileUp, File as FileIcon, UploadCloud } from "lucide-react"
import { Card } from "../ui/card"
import type { DriveItem } from "@/types"

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-69.2 67.4c-20.5-19.3-48.8-31.2-81.6-31.2-74.2 0-134.4 60.2-134.4 134.4s60.2 134.4 134.4 134.4c83.3 0 119.2-61.2 123.5-92.4H248v-83.3h239.9c1.6 10.1 2.5 20.9 2.5 32.2z"></path>
    </svg>
)

const formSchema = z.object({
  fileUrl: z.string().url().optional(),
});

type UploadMaterialFormProps = {
  onMaterialAdd: (material: DriveItem) => void;
  onClose: () => void;
  currentFolderId: string | null;
};

export function UploadMaterialForm({ onMaterialAdd, onClose, currentFolderId }: UploadMaterialFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"local" | "gdrive" | "embed" | null>(null)
  const [step, setStep] = useState<'method' | 'details'>('method')
  const { toast } = useToast()
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderCache = useRef<{ [key: string]: string }>({});
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
  const SCOPES = 'https://www.googleapis.com/auth/drive.file';

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', initClient);
    };
    document.body.appendChild(script);

    return () => {
        document.body.removeChild(script);
    }
  }, []);

  const initClient = () => {
    window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPES,
    }).then(() => {
        setIsGapiLoaded(true);
    }).catch(error => {
        toast({ variant: 'destructive', title: 'Google API Init Failed', description: error.message });
    });
  };

  const handleAuthClick = async () => {
    if (!fileInputRef.current?.files?.length) {
        toast({ variant: 'destructive', title: 'Tidak ada folder dipilih', description: 'Silakan pilih folder untuk diunggah.' });
        return;
    }

    setIsUploading(true);
    try {
        await window.gapi.auth2.getAuthInstance().signIn();
        const files = fileInputRef.current.files;
        if (files.length > 0) {
            let totalFiles = 0;
            for (const file of files) {
                if (!file.type && file.size === 0) continue; // Skip folder entries if they appear
                totalFiles++;
            }

            let uploadedCount = 0;
            toast({ title: 'Upload Dimulai', description: `Mengunggah ${totalFiles} file...` });

            for (const file of files) {
                if (!file.type && file.size === 0) continue;
                
                const pathParts = file.webkitRelativePath.split('/');
                pathParts.pop(); // Remove filename
                
                const folderId = await createFoldersRecursively(pathParts);
                await uploadFile(file, folderId);
                
                uploadedCount++;
                // Optionally update progress
            }
            toast({ title: 'Upload Selesai', description: `${uploadedCount} file berhasil diunggah ke Google Drive.` });
            onClose();
        }
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Upload Gagal', description: error.message || 'Terjadi kesalahan saat mengunggah.' });
    } finally {
        setIsUploading(false);
    }
  };

  const createFoldersRecursively = async (pathParts: string[]) => {
    let parentId = 'root';
    let currentPath = '';

    for (const folderName of pathParts) {
      if (!folderName) continue;
      currentPath += `/${folderName}`;
      if (folderCache.current[currentPath]) {
        parentId = folderCache.current[currentPath];
        continue;
      }

      const response = await window.gapi.client.drive.files.create({
        resource: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentId],
        },
        fields: 'id',
      });

      const newFolderId = response.result.id;
      folderCache.current[currentPath] = newFolderId;
      parentId = newFolderId;
    }
    return parentId;
  };

  const uploadFile = async (file: File, parentId: string) => {
    const metadata = {
      name: file.name,
      mimeType: file.type,
      parents: [parentId],
    };

    const accessToken = window.gapi.auth.getToken().access_token;
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
      method: 'POST',
      headers: new Headers({ Authorization: 'Bearer ' + accessToken }),
      body: form,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gagal mengunggah ${file.name}: ${errorData.error.message}`);
    }
    
    // In a real app, you might want to link this back to the material list
    // For now, we just log it.
    console.log(`File terunggah: ${file.name}`);
  };

  const handleSelectMethod = (method: "local" | "gdrive" | "embed") => {
    setUploadMethod(method);
    setStep("details");
  }
  
  const resetFlow = () => {
    setStep('method');
    setUploadMethod(null);
    setIsSubmitting(false);
    form.reset();
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });
  
  async function onSubmit() {
    setIsSubmitting(true)
    
    let submissionData: Partial<DriveItem> = { 
        id: `file-${Date.now()}`,
        name: 'Untitled Material',
        type: 'file',
        parentId: currentFolderId,
    };
    
    const values = form.getValues();

    if (uploadMethod === 'embed' && values.fileUrl) {
        submissionData.name = new URL(values.fileUrl).hostname;
        submissionData.fileType = 'video';
        submissionData.source = values.fileUrl;
    } else if (uploadMethod === 'local' && (fileInputRef.current as any)?.files) {
        const file = (fileInputRef.current as any).files?.[0];
        if (file) {
          submissionData.name = file.name;
          submissionData.fileType = 'pdf'; // Placeholder
          // In a real app, you'd upload this file and get a URL.
          submissionData.source = "local-file-placeholder";
        }
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    onMaterialAdd(submissionData as DriveItem);

    toast({
      title: "Materi Ditambahkan",
      description: `Materi "${submissionData.name}" telah ditambahkan.`,
    })
    
    onClose();
  }

  const renderMethodStep = () => (
    <div className="space-y-4 text-center">
        <h3 className="font-medium">Pilih Metode Unggah Materi</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <Card onClick={() => handleSelectMethod('local')} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors h-32">
                <FileUp className="w-8 h-8 text-primary"/>
                <span className="text-sm font-medium text-center">File Lokal</span>
            </Card>
             <Card onClick={() => handleSelectMethod('gdrive')} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors h-32">
                <GoogleIcon className="w-8 h-8"/>
                <span className="text-sm font-medium text-center">Folder dari PC</span>
            </Card>
             <Card onClick={() => handleSelectMethod('embed')} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors h-32">
                <FileIcon className="w-8 h-8 text-primary"/>
                <span className="text-sm font-medium text-center">Embed URL</span>
            </Card>
        </div>
    </div>
  )

  const renderDetailsStep = () => {
    if (!uploadMethod) return null;

    if (uploadMethod === 'gdrive') {
        return (
            <div className="space-y-4">
                <h3 className="font-medium">Unggah Folder ke Google Drive</h3>
                <p className="text-sm text-muted-foreground">Pilih folder dari komputer Anda. Seluruh struktur folder dan isinya akan diunggah ke root direktori Google Drive Anda.</p>
                <div>
                    <Label htmlFor="folder-upload">Pilih Folder</Label>
                    <Input 
                        id="folder-upload"
                        type="file" 
                        // @ts-ignore
                        webkitdirectory="true" 
                        directory="true" 
                        multiple 
                        ref={fileInputRef} 
                    />
                </div>
                <div className="flex justify-between items-center pt-4">
                    <Button variant="ghost" onClick={resetFlow}>Kembali</Button>
                    <Button onClick={handleAuthClick} disabled={!isGapiLoaded || isUploading}>
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                        Login & Unggah
                    </Button>
                </div>
            </div>
        );
    }
    
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {uploadMethod === 'local' && (
                <div className="space-y-2">
                    <Label htmlFor="localFile">Unggah File</Label>
                    <Input id="localFile" type="file" ref={fileInputRef} />
                </div>
            )}

            {uploadMethod === 'embed' && (
                <div className="space-y-2">
                    <Label htmlFor="fileUrl">URL Materi</Label>
                    <Input 
                        id="fileUrl"
                        placeholder="https://www.youtube.com/watch?v=..." 
                        {...form.register("fileUrl")}
                    />
                </div>
            )}

             <div className="flex justify-between items-center pt-4">
                <Button variant="ghost" onClick={resetFlow}>Kembali</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan Materi
                </Button>
             </div>
        </form>
    )
  }
  
  return (
    <div>
        {step === 'method' ? renderMethodStep() : renderDetailsStep()}
    </div>
  )
}