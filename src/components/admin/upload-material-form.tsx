
"use client"

import * as React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, FileUp, File as FileIcon, X } from "lucide-react"
import { Card } from "../ui/card"
import type { DriveItem } from "@/types"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { auth, storage } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";


const GoogleIconSvg = (props: React.SVGProps<SVGGSVGElement>) => (
    <svg {...props} className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-69.2 67.4c-20.5-19.3-48.8-31.2-81.6-31.2-74.2 0-134.4 60.2-134.4 134.4s60.2 134.4 134.4 134.4c83.3 0 119.2-61.2 123.5-92.4H248v-83.3h239.9c1.6 10.1 2.5 20.9 2.5 32.2z"></path>
    </svg>
)

const formSchema = z.object({
  fileUrl: z.string().optional(),
}).refine((data) => {
    // This is a workaround to get the current upload method
    const uploadMethodElement = document.querySelector('[data-upload-method]');
    if (uploadMethodElement && uploadMethodElement.getAttribute('data-upload-method') === 'embed') {
        return z.string().url({ message: "Please enter a valid URL." }).safeParse(data.fileUrl).success;
    }
    return true;
}, {
    path: ['fileUrl'],
    message: "Please enter a valid URL for the embed method."
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
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
  const [oauthToken, setOauthToken] = useState<string | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
  const APP_ID = process.env.NEXT_PUBLIC_GOOGLE_APP_ID || '';
  
  useEffect(() => {
    const onPickerApiLoad = () => {
      setPickerApiLoaded(true);
    };

    (window as any).onPickerApiLoad = onPickerApiLoad;

    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.async = true;
    gapiScript.defer = true;
    gapiScript.onload = () => {
        window.gapi.load('picker', { 'callback': (window as any).onPickerApiLoad });
    };
    document.body.appendChild(gapiScript);
    
    return () => {
      document.body.removeChild(gapiScript);
      delete (window as any).onPickerApiLoad;
    };
  }, []);

  const handleDriveAuth = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.readonly');
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
            setOauthToken(credential.accessToken);
        } else {
            throw new Error("Could not get access token from Google");
        }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Google Authentication Failed",
            description: error.message,
        });
        setIsGoogleLoading(false);
    }
  };

  const handleFilePicked = useCallback(async (data: any, token: string) => {
    setIsGoogleLoading(true);
    try {
      if (data.action !== google.picker.Action.PICKED) {
        setIsGoogleLoading(false);
        return;
      }
      
      const file = data.docs[0];
      const fileId = file.id;

      toast({
        title: "Processing File...",
        description: `Downloading "${file.name}" from Google Drive.`,
      });

      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Failed to download file from Google Drive');
      }

      const fileBlob = await res.blob();
      
      toast({
        title: "Uploading to Storage...",
        description: `File downloaded. Now uploading to application storage.`,
      });

      const fileRef = storageRef(storage, `materials/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(fileRef, fileBlob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const newMaterial: DriveItem = {
        id: file.id,
        name: file.name,
        type: 'file',
        parentId: currentFolderId,
        fileType: file.mimeType.includes('video') ? 'video' :
                  file.mimeType.includes('pdf') ? 'pdf' :
                  file.mimeType.includes('image') ? 'image' :
                  'text',
        source: downloadURL,
        sourceType: 'firebase-storage',
        coverImage: file.thumbnails?.[0]?.url || `https://placehold.co/600x400`,
      };
      
      onMaterialAdd(newMaterial);
      toast({
        title: "Material Added Successfully",
        description: `"${file.name}" is now available.`,
      });
      onClose();

    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error Processing File', description: error.message });
    } finally {
      setIsGoogleLoading(false);
    }
  }, [currentFolderId, onMaterialAdd, onClose, toast]);

  const createPicker = useCallback((token: string) => {
    if (!pickerApiLoaded || !token || !window.google?.picker) {
      toast({ variant: 'destructive', title: "Picker Error", description: "Dependencies not ready." });
      setIsGoogleLoading(false);
      return;
    }
    
    const myDriveView = new window.google.picker.DocsView();
    
    const recentView = new window.google.picker.DocsView();
    if(window.google?.picker?.SortOrder?.LAST_OPENED_BY_ME) {
        recentView.setSort(window.google.picker.SortOrder.LAST_OPENED_BY_ME);
    }

    const picker = new window.google.picker.PickerBuilder()
        .setAppId(APP_ID)
        .setOAuthToken(token)
        .setDeveloperKey(API_KEY)
        .setOrigin(window.location.origin)
        .addView(myDriveView)
        .addView(recentView)
        .setCallback((data: any) => handleFilePicked(data, token))
        .build();
    picker.setVisible(true);
    setIsGoogleLoading(false);
  }, [API_KEY, APP_ID, pickerApiLoaded, handleFilePicked, toast]);
  
  useEffect(() => {
    if (oauthToken && pickerApiLoaded) {
      createPicker(oauthToken);
    }
  }, [oauthToken, pickerApiLoaded, createPicker]);


  const handleSelectMethod = (method: "local" | "gdrive" | "embed") => {
    setUploadMethod(method);
    if (method === 'gdrive') {
        handleDriveAuth();
    } else {
        setStep("details");
    }
  }
  
  const resetFlow = () => {
    setStep('method');
    setUploadMethod(null);
    setIsSubmitting(false);
    setIsGoogleLoading(false);
    setOauthToken(null);
    form.reset();
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    }
  });
  
  const getYouTubeThumbnail = (url: string) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : `https://placehold.co/600x400`;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    
    let submissionData: Partial<DriveItem> = { 
        id: `file-${Date.now()}`,
        name: 'Untitled Material',
        type: 'file',
        parentId: currentFolderId,
    };

    if (uploadMethod === 'embed' && values.fileUrl) {
        const url = values.fileUrl;
        try {
            submissionData.name = new URL(url).hostname;
        } catch (e) {
            submissionData.name = "Embedded Link"
        }

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            const videoId = videoIdMatch ? videoIdMatch[1] : null;
            submissionData.fileType = 'video';
            submissionData.sourceType = 'youtube';
            submissionData.source = videoId ? `https://www.youtube.com/embed/${videoId}` : url;
            submissionData.coverImage = getYouTubeThumbnail(url);
            submissionData.name = "YouTube Video";
        } else {
            submissionData.fileType = 'video'; // Assuming embed links are mostly videos
            submissionData.sourceType = 'external';
            submissionData.source = url;
            submissionData.coverImage = `https://placehold.co/600x400`;
        }

    } else if (uploadMethod === 'local' && fileInputRef.current?.files) {
        const file = fileInputRef.current.files[0];
        if (file) {
          try {
            toast({
              title: "Uploading to Storage...",
              description: `Uploading "${file.name}" to application storage.`,
            });
            const fileRef = storageRef(storage, `materials/${Date.now()}-${file.name}`);
            const snapshot = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            submissionData.name = file.name;
            submissionData.fileType = file.type.startsWith('image/') ? 'image' : 
                                      file.type === 'application/pdf' ? 'pdf' :
                                      file.type.startsWith('video/') ? 'video' : 'text';
            submissionData.source = downloadURL;
            submissionData.sourceType = 'firebase-storage';
            submissionData.coverImage = file.type.startsWith('image/') ? downloadURL : `https://placehold.co/600x400`;
          } catch(e: any) {
              console.error("Local upload error", e);
              toast({ variant: 'destructive', title: 'Upload Failed', description: e.message });
              setIsSubmitting(false);
              return;
          }
        }
    }

    onMaterialAdd(submissionData as DriveItem);

    toast({
      title: "Material Added",
      description: `"${submissionData.name}" has been added.`,
    })
    
    onClose();
  }

  const renderMethodStep = () => (
    <div className="space-y-4 text-center">
        <h3 className="font-medium">Choose Upload Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <Card onClick={() => handleSelectMethod('local')} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors h-32">
                <FileUp className="w-8 h-8 text-primary"/>
                <span className="text-sm font-medium text-center">Local File</span>
            </Card>
             <Card onClick={() => handleSelectMethod('gdrive')} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors h-32">
                {isGoogleLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <GoogleIconSvg className="w-8 h-8"/>}
                <span className="text-sm font-medium text-center">
                  {isGoogleLoading ? "Connecting..." : "Google Drive"}
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-upload-method={uploadMethod}>
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium capitalize">{uploadMethod} Upload</h3>
                    <Button type="button" variant="ghost" size="icon" onClick={resetFlow} className="h-7 w-7"><X /></Button>
                </div>
                {uploadMethod === 'local' && (
                    <div className="space-y-2">
                        <Label htmlFor="localFile">Upload File</Label>
                        <Input id="localFile" type="file" ref={fileInputRef} required />
                    </div>
                )}

                {uploadMethod === 'embed' && (
                  <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Material URL</Label>
                        <FormControl>
                          <Input 
                              placeholder="https://www.youtube.com/watch?v=..." 
                              {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                 <div className="flex justify-end items-center pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Material
                    </Button>
                 </div>
            </form>
        </Form>
    )
  }
  
  return (
    <div>
        {step === 'method' && !isGoogleLoading ? renderMethodStep() : null}
        {step === 'details' && !isGoogleLoading ? renderDetailsStep() : null}
        {isGoogleLoading && (
             <div className="flex flex-col items-center justify-center h-32">
                <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                <span className="mt-4 text-sm text-muted-foreground">Connecting to Google Drive...</span>
            </div>
        )}
    </div>
  )
}
