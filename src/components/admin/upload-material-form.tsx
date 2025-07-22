"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, FileUp, File as FileIcon } from "lucide-react"
import { Card } from "../ui/card"
import type { DriveItem } from "@/types"

const formSchema = z.object({
  uploadMethod: z.enum(["local", "gdrive", "embed"]),
  fileUrl: z.string().url().optional(),
  localFile: z.any().optional(),
});

type UploadMaterialFormProps = {
  onMaterialAdd: (material: DriveItem) => void;
  onClose: () => void;
  currentFolderId: string | null;
};

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-69.2 67.4c-20.5-19.3-48.8-31.2-81.6-31.2-74.2 0-134.4 60.2-134.4 134.4s60.2 134.4 134.4 134.4c83.3 0 119.2-61.2 123.5-92.4H248v-83.3h239.9c1.6 10.1 2.5 20.9 2.5 32.2z"></path>
    </svg>
)

export function UploadMaterialForm({ onMaterialAdd, onClose, currentFolderId }: UploadMaterialFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"local" | "gdrive" | "embed" | null>(null)
  const [step, setStep] = useState<'method' | 'details'>('method')
  const { toast } = useToast()

  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
  const [oauthToken, setOauthToken] = useState<google.accounts.oauth2.TokenResponse | null>(null);
  let tokenClient: google.accounts.oauth2.TokenClient | null = null;


  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
  const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

  const gapiLoadCallback = useCallback(() => {
    window.gapi.load('picker', () => {
      setPickerApiLoaded(true);
    });
  }, []);

  const gisLoadCallback = useCallback(() => {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse) => {
        if (tokenResponse.error) {
            toast({
                variant: 'destructive',
                title: 'Authentication Failed',
                description: tokenResponse.error_description || 'Could not get access token.',
            });
            // Reset to method selection on failure
            setStep('method');
            setUploadMethod(null);
        } else {
            setOauthToken(tokenResponse);
        }
      },
    });
    setGapiLoaded(true);
  }, [CLIENT_ID, SCOPES, toast]);

  useEffect(() => {
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.async = true;
    gapiScript.defer = true;
    gapiScript.onload = () => gapiLoadCallback();
    document.body.appendChild(gapiScript);

    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.async = true;
    gisScript.defer = true;
    gisScript.onload = () => gisLoadCallback();
    document.body.appendChild(gisScript);

    return () => {
      document.body.removeChild(gapiScript);
      document.body.removeChild(gisScript);
    };
  }, [gapiLoadCallback, gisLoadCallback]);


  const createPicker = useCallback(() => {
    if (!pickerApiLoaded || !oauthToken || !API_KEY) {
        let errorMsg = 'Google Picker could not be created. ';
        if (!pickerApiLoaded) errorMsg += 'Picker API not loaded. ';
        if (!oauthToken) errorMsg += 'OAuth token missing. ';
        if (!API_KEY) errorMsg += 'API Key missing. ';
        toast({ variant: 'destructive', title: 'Error', description: errorMsg });
        setStep('method'); 
        setUploadMethod(null);
        return;
    }

    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.DOCS)
      .setOAuthToken(oauthToken.access_token)
      .setDeveloperKey(API_KEY)
      .setCallback((data: google.picker.ResponseObject) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const file = data.docs[0]
          
          const newMaterial: DriveItem = {
              id: file.id,
              name: file.name,
              type: 'file',
              fileType: file.mimeType?.includes('pdf') ? 'pdf' : file.mimeType?.includes('video') ? 'video' : 'file',
              parentId: currentFolderId,
              source: file.url
          }

          onMaterialAdd(newMaterial)
          toast({
              title: "Material Terpilih",
              description: `"${file.name}" telah ditambahkan.`,
          })
          onClose()
        } else if (data.action === window.google.picker.Action.CANCEL) {
            setStep('method');
            setUploadMethod(null);
        }
      })
      .build()
    picker.setVisible(true)
  }, [pickerApiLoaded, oauthToken, API_KEY, currentFolderId, onMaterialAdd, toast, onClose]);


  useEffect(() => {
    if (oauthToken && pickerApiLoaded) {
      createPicker()
    }
  }, [oauthToken, pickerApiLoaded, createPicker])


  const handleSelectMethod = (method: "local" | "gdrive" | "embed") => {
    setUploadMethod(method);
    if (method === 'gdrive') {
        if (!gapiLoaded || !tokenClient) {
            toast({
                variant: 'destructive',
                title: 'Google API Loading',
                description: 'Google services are still loading. Please wait a moment and try again.',
            });
            return;
        }
        setStep('details');
        tokenClient.requestAccessToken();
    } else {
        setStep("details");
    }
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
                <span className="text-sm font-medium text-center">Google Drive</span>
            </Card>
             <Card onClick={() => handleSelectMethod('embed')} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors h-32">
                <FileIcon className="w-8 h-8 text-primary"/>
                <span className="text-sm font-medium text-center">Embed URL</span>
            </Card>
        </div>
    </div>
  )

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
        submissionData.fileType = 'video'; // Placeholder
    } else if (uploadMethod === 'local' && values.localFile) {
        const file = values.localFile?.[0];
        if (file) {
          submissionData.name = file.name;
          submissionData.fileType = 'pdf'; // Placeholder
        }
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    onMaterialAdd(submissionData as DriveItem);

    toast({
      title: "Materi Ditambahkan",
      description: `Materi "${submissionData.name}" telah ditambahkan.`,
    })
    
    setIsSubmitting(false)
    form.reset()
    setUploadMethod(null)
    setStep('method');
    onClose();
  }

  const renderDetailsStep = () => {
    if (!uploadMethod) return null;

    if (uploadMethod === 'gdrive') {
        return (
            <div className="flex flex-col items-center justify-center h-32 space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Menghubungkan ke Google Drive...</p>
                <Button variant="link" onClick={() => { setStep('method'); setUploadMethod(null); }}>
                    Batal
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
            {uploadMethod === 'local' && (
                <div className="space-y-2">
                    <Label htmlFor="localFile">Unggah File</Label>
                    <Input id="localFile" type="file" onChange={(e) => form.setValue('localFile', e.target.files)} />
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
                <Button variant="ghost" onClick={() => { setStep('method'); setUploadMethod(null); }}>Kembali</Button>
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
