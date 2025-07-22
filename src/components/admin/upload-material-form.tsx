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
  
  // --- Google Picker State ---
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
  const [oauthToken, setOauthToken] = React.useState<google.accounts.oauth2.TokenResponse | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
  const APP_ID = "neurozsis";
  const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
  
  let tokenClient = useRef<any>(null);

  useEffect(() => {
    const gapiUrl = 'https://apis.google.com/js/api.js';
    const gisUrl = 'https://accounts.google.com/gsi/client';

    const loadScript = (src: string, onLoad: () => void) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = onLoad;
      document.body.appendChild(script);
    };

    loadScript(gapiUrl, () => setGapiLoaded(true));
    loadScript(gisUrl, () => setGisLoaded(true));

  }, []);

  const initializePicker = useCallback(() => {
    if (gapiLoaded && !pickerApiLoaded) {
      window.gapi.load('picker', () => {
        setPickerApiLoaded(true);
      });
    }
  }, [gapiLoaded, pickerApiLoaded]);

  useEffect(() => {
    if (gisLoaded && gapiLoaded) {
      initializePicker();
      tokenClient.current = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            setOauthToken(tokenResponse);
            createPicker(tokenResponse);
          } else {
             toast({ variant: 'destructive', title: 'Authentication Failed', description: 'Could not get access token from Google.' });
          }
          setIsGoogleLoading(false);
        },
      });
    }
  }, [gisLoaded, gapiLoaded, initializePicker]);
  
  const handleAuthClick = () => {
    setIsGoogleLoading(true);
    if (tokenClient.current) {
        tokenClient.current.requestAccessToken();
    } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Google Auth is not ready. Please wait a moment and try again.'});
        setIsGoogleLoading(false);
    }
  };

  const createPicker = (token: google.accounts.oauth2.TokenResponse) => {
    if (!pickerApiLoaded || !token) return;

    const view = new window.google.picker.DocsView()
        .setIncludeFolders(true)
        .setSelectFolderEnabled(true);

    const picker = new window.google.picker.PickerBuilder()
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .setAppId(APP_ID)
        .setOAuthToken(token.access_token)
        .addView(view)
        .setDeveloperKey(API_KEY)
        .setCallback(pickerCallback)
        .build();
    picker.setVisible(true);
  };
  
  const pickerCallback = (data: any) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const files = data.docs;
      files.forEach((file: any) => {
        const newMaterial: DriveItem = {
          id: file.id,
          name: file.name,
          type: 'file', // GDrive items are always files in this context
          parentId: currentFolderId,
          fileType: file.mimeType.includes('video') ? 'video' :
                    file.mimeType.includes('pdf') ? 'pdf' :
                    file.mimeType.includes('image') ? 'image' :
                    'text',
          source: file.url,
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
  };


  const handleSelectMethod = (method: "local" | "gdrive" | "embed") => {
    setUploadMethod(method);
    setStep("details");
    if (method === 'gdrive') {
        handleAuthClick();
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
        submissionData.fileType = 'video'; // assumption
        submissionData.source = values.fileUrl;
    } else if (uploadMethod === 'local' && fileInputRef.current?.files) {
        const file = fileInputRef.current.files[0];
        if (file) {
          submissionData.name = file.name;
          submissionData.fileType = 'pdf'; // Placeholder
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
             <Card onClick={() => {
                setUploadMethod('gdrive');
                handleAuthClick();
             }} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors h-32">
                {isGoogleLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <GoogleIcon className="w-8 h-8"/>}
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
    
    if (uploadMethod === 'gdrive') {
        return (
            <div className="flex flex-col items-center justify-center h-32">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Membuka Google Picker...</p>
                <p className="text-xs text-muted-foreground mt-1">Jika tidak ada yang muncul, pastikan popup tidak diblokir.</p>
                 <Button variant="ghost" onClick={resetFlow} className="mt-4">Batal</Button>
            </div>
        )
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

    