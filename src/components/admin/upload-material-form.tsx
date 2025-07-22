"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, FileUp, Folder, File as FileIcon } from "lucide-react"
import { Card } from "../ui/card"
import type { DriveItem } from "@/types"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const GoogleIconSvg = (props: React.SVGProps<SVGSVGElement>) => (
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
  
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const tokenClient = useRef<any>(null);
  const oauthToken = useRef<any>(null);
  
  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
  const APP_ID = "neurozsis"; 
  const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
  
  const pickerCallback = useCallback((data: any) => {
    setIsGoogleLoading(false);
    if (data.action === google.picker.Action.PICKED) {
      const files = data.docs;
      files.forEach((file: any) => {
        const newMaterial: DriveItem = {
          id: file.id,
          name: file.name,
          type: 'file',
          parentId: currentFolderId,
          fileType: file.mimeType.includes('video') ? 'video' :
                    file.mimeType.includes('pdf') ? 'pdf' :
                    file.mimeType.includes('image') ? 'image' :
                    'text',
          source: file.url || file.embedUrl,
          coverImage: file.thumbnails?.[0]?.url || `https://placehold.co/600x400`,
        };
        onMaterialAdd(newMaterial);
      });
      toast({
        title: "Materi Dipilih",
        description: `${files.length} file telah ditambahkan dari Google Drive.`,
      })
      onClose();
    }
  }, [currentFolderId, onMaterialAdd, onClose, toast]);

  const createPicker = useCallback(() => {
    if (!pickerApiLoaded || !oauthToken.current || typeof google?.picker === 'undefined') {
       toast({ variant: 'destructive', title: 'Error', description: 'Google Picker API atau otentikasi belum siap.' });
       setIsGoogleLoading(false);
       return;
    }
    
    const view = new window.google.picker.DocsView()
        .setIncludeFolders(false)
        .setSelectFolderEnabled(false);

    const picker = new window.google.picker.PickerBuilder()
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .setAppId(APP_ID)
        .setOAuthToken(oauthToken.current.access_token)
        .addView(view)
        .setDeveloperKey(API_KEY)
        .setCallback(pickerCallback)
        .build();
    picker.setVisible(true);
  }, [pickerApiLoaded, API_KEY, APP_ID, pickerCallback, toast]);

  const handleAuthClick = useCallback(() => {
    setIsGoogleLoading(true);
    if (tokenClient.current) {
        tokenClient.current.requestAccessToken({prompt: ''});
    } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Klien otentikasi Google belum siap. Coba lagi sebentar.'});
        setIsGoogleLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    const gapiUrl = 'https://apis.google.com/js/api.js';
    const gisUrl = 'https://accounts.google.com/gsi/client';

    const loadScript = (src: string, onLoad: () => void) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            onLoad();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;
        script.onload = onLoad;
        document.body.appendChild(script);
    };

    const gapiLoadCallback = () => {
        if (window.gapi) {
            window.gapi.load('picker', () => {
                setPickerApiLoaded(true);
            });
        }
    };

    const gisLoadCallback = () => {
        if (window.google?.accounts?.oauth2) {
            tokenClient.current = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (tokenResponse) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        oauthToken.current = tokenResponse;
                        createPicker();
                    } else {
                        toast({ variant: 'destructive', title: 'Otentikasi Gagal', description: 'Tidak bisa mendapatkan token akses dari Google.' });
                        setIsGoogleLoading(false);
                    }
                },
            });
        }
    };
    
    loadScript(gapiUrl, gapiLoadCallback);
    loadScript(gisUrl, gisLoadCallback);

  }, [CLIENT_ID, SCOPES, createPicker, toast]);

  const handleSelectMethod = (method: "local" | "gdrive" | "embed") => {
    setUploadMethod(method);
    if (method === 'gdrive') {
        handleAuthClick();
    } else {
        setStep("details");
    }
  }
  
  const resetFlow = () => {
    setStep('method');
    setUploadMethod(null);
    setIsSubmitting(false);
    setIsGoogleLoading(false);
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
        try {
            submissionData.name = new URL(values.fileUrl).hostname;
        } catch (e) {
            submissionData.name = "Embedded Link"
        }
        submissionData.fileType = 'video';
        submissionData.source = values.fileUrl;
    } else if (uploadMethod === 'local' && fileInputRef.current?.files) {
        const file = fileInputRef.current.files[0];
        if (file) {
          submissionData.name = file.name;
          submissionData.fileType = 'pdf'; 
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
                {isGoogleLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <GoogleIconSvg className="w-8 h-8"/>}
                <span className="text-sm font-medium text-center">
                  {isGoogleLoading ? "Menghubungkan..." : "Google Drive"}
                </span>
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
                <Button type="button" variant="ghost" onClick={resetFlow}>Kembali</Button>
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
