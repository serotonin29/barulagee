"use client"

import * as React from "react"
import { useState, useRef } from "react"
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
  
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // --- Start of Google Picker Implementation ---
  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
  const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
  
  // Use refs to store state that doesn't trigger re-renders
  const gapiLoaded = useRef(false);
  const pickerApiLoaded = useRef(false);
  const oauthToken = useRef<string | null>(null);

  const loadGapiScript = () => {
    if (gapiLoaded.current) return;
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      gapiLoaded.current = true;
      (window as any).gapi.load('auth2:picker', () => {
          pickerApiLoaded.current = true;
          if (isGoogleLoading) { // If user clicked while scripts were loading
            handleAuthClick();
          }
      });
    };
    document.body.appendChild(script);
  };
  
  React.useEffect(() => {
    loadGapiScript();
  }, []);

  const handleAuthResult = (authResult: any) => {
    setIsGoogleLoading(false);
    if (authResult && !authResult.error) {
      oauthToken.current = authResult.access_token;
      createPicker();
    } else {
      toast({
        variant: 'destructive',
        title: 'Otentikasi Gagal',
        description: 'Tidak dapat mendapatkan izin dari Google. Silakan coba lagi.',
      });
    }
  };

  const createPicker = () => {
    if (!pickerApiLoaded.current || !oauthToken.current) {
        toast({
            variant: 'destructive',
            title: 'Picker Error',
            description: 'Google Picker tidak siap. Coba lagi.',
        });
        setIsGoogleLoading(false);
        return;
    }

    const view = new (window as any).google.picker.DocsView()
        .setIncludeFolders(false)
        .setSelectFolderEnabled(false);

    const picker = new (window as any).google.picker.PickerBuilder()
        .enableFeature((window as any).google.picker.Feature.MULTISELECT_ENABLED)
        .setOAuthToken(oauthToken.current)
        .addView(view)
        .setDeveloperKey(API_KEY)
        .setCallback(pickerCallback)
        .build();
    picker.setVisible(true);
  };

  const pickerCallback = (data: any) => {
    if (data.action === (window as any).google.picker.Action.PICKED) {
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
  }

  const handleAuthClick = () => {
    setIsGoogleLoading(true);
    if (gapiLoaded.current && pickerApiLoaded.current) {
      const authInstance = (window as any).gapi.auth2.getAuthInstance();
      if (authInstance && authInstance.isSignedIn.get()) {
          // If already signed in, just get the token and create picker
          oauthToken.current = authInstance.currentUser.get().getAuthResponse().access_token;
          createPicker();
      } else {
          // If not signed in, trigger the sign-in flow
          (window as any).gapi.auth2.authorize(
            { client_id: CLIENT_ID, scope: SCOPES, immediate: false },
            handleAuthResult
          );
      }
    } else {
      // Scripts are still loading, wait for onload to call this function again
      loadGapiScript();
    }
  };
  // --- End of Google Picker Implementation ---

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
