"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, UploadCloud, Link, FileUp, File as FileIcon, ArrowLeft } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { Card } from "../ui/card"
import type { DriveItem } from "@/types"

const formSchema = z.object({
  uploadMethod: z.enum(["local", "gdrive", "embed"]),
  fileUrl: z.string().url().optional(),
  localFile: z.any().optional(),
});

type DriveFile = { id: string; name: string; type: string };

const dummyDriveFiles: DriveFile[] = [
    { id: '1', name: 'Neuroanatomy Lecture Notes.pdf', type: 'pdf' },
    { id: '2', name: 'Cardiology Seminar.mp4', type: 'video' },
    { id: '3', name: 'Project Outline - Group A', type: 'doc' },
    { id: '4', name: 'Shared Research Papers', type: 'folder' },
    { id: '5', name: 'Clinical Case Studies.pptx', type: 'ppt' },
    { id: '6', name: 'Anatomy Atlas Scans', type: 'folder' },
]

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
  const [selectedDriveFile, setSelectedDriveFile] = useState<DriveFile | null>(null)
  const [currentStep, setCurrentStep] = useState<'method' | 'details'>('method')
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })
  
  const uploadMethod = form.watch("uploadMethod");

  async function onSubmit() {
    setIsSubmitting(true)
    
    let submissionData: Partial<DriveItem> = { 
        id: `file-${Date.now()}`,
        name: 'Untitled Material',
        type: 'file',
        parentId: currentFolderId,
    };
    
    const values = form.getValues();

    if (values.uploadMethod === 'gdrive' && selectedDriveFile) {
        submissionData.name = selectedDriveFile.name;
        submissionData.fileType = 'pdf'; // Placeholder
    } else if (values.uploadMethod === 'embed' && values.fileUrl) {
        submissionData.name = new URL(values.fileUrl).hostname;
        submissionData.fileType = 'video'; // Placeholder
    } else if (values.uploadMethod === 'local' && values.localFile) {
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
    setSelectedDriveFile(null)
    setCurrentStep('method');
    onClose();
  }
  
  const handleSelectMethod = (method: "local" | "gdrive" | "embed") => {
    form.setValue("uploadMethod", method);
    setCurrentStep("details");
  }

  const handleConnectDrive = () => {
    setIsConnecting(true);
    setTimeout(() => {
        setIsConnecting(false);
        // Directly proceed to file selection simulation
    }, 1500); // Simulate network delay
  }

  const renderMethodStep = () => (
    <div className="space-y-4">
        <h3 className="font-medium text-center">Pilih Metode Unggah Materi</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card onClick={() => handleSelectMethod('local')} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors h-32">
                <FileUp className="w-8 h-8 text-primary"/>
                <span className="text-sm font-medium text-center">File Lokal</span>
            </Card>
             <Card onClick={() => handleSelectMethod('gdrive')} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors h-32">
                <GoogleIcon className="w-8 h-8 text-primary"/>
                <span className="text-sm font-medium text-center">Google Drive</span>
            </Card>
             <Card onClick={() => handleSelectMethod('embed')} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors h-32">
                <Link className="w-8 h-8 text-primary"/>
                <span className="text-sm font-medium text-center">Embed URL</span>
            </Card>
        </div>
    </div>
  )
  
  const renderDetailsStep = () => {
    if (!uploadMethod) return null;

    const renderDriveContent = () => (
        <div className="min-h-[300px] flex flex-col">
            <p className="text-sm font-medium mb-2">Pilih file dari Drive Anda (Simulasi):</p>
            <ScrollArea className="h-64 rounded-md border">
                <div className="p-2 space-y-1">
                    {dummyDriveFiles.map(file => (
                        <div 
                            key={file.id} 
                            onClick={() => setSelectedDriveFile(file)}
                            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent ${selectedDriveFile?.id === file.id ? 'bg-accent' : ''}`}
                        >
                            <FileIcon className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm flex-grow">{file.name}</span>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            {selectedDriveFile && (
                 <div className="mt-4 p-3 border rounded-lg bg-muted/50">
                    <p className="text-sm font-medium">File terpilih:</p>
                    <p className="text-sm text-primary">{selectedDriveFile.name}</p>
                 </div>
            )}
        </div>
    );

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
            {uploadMethod === 'local' && (
                <div className="p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-[300px]">
                    <FileUp className="w-12 h-12 text-muted-foreground mb-4"/>
                    <h4 className="font-semibold mb-2">Unggah File dari Komputer</h4>
                    <p className="text-sm text-muted-foreground mb-4">Seret & lepas file atau klik untuk memilih.</p>
                    <input type="file" onChange={(e) => form.setValue('localFile', e.target.files)} />
                </div>
            )}

            {uploadMethod === 'embed' && (
                <div className="space-y-2 pt-8">
                    <Label htmlFor="fileUrl">URL Materi</Label>
                    <Input 
                        id="fileUrl"
                        placeholder="https://www.youtube.com/watch?v=..." 
                        {...form.register("fileUrl")}
                    />
                    <p className="text-xs text-muted-foreground">Tempelkan tautan dari YouTube, Vimeo, atau sumber lain yang dapat disematkan.</p>
                </div>
            )}

            {uploadMethod === 'gdrive' && renderDriveContent()}

             <div className="flex justify-between items-center pt-4">
                <Button variant="ghost" onClick={() => setCurrentStep('method')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>
                <Button type="submit" disabled={isSubmitting || (uploadMethod === 'gdrive' && !selectedDriveFile)}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan Materi
                </Button>
             </div>
        </form>
    )
  }
  
  const renderCurrentStep = () => {
    switch (currentStep) {
        case 'method': return renderMethodStep();
        case 'details': return renderDetailsStep();
        default: return renderMethodStep();
    }
  }


  return (
    <div>
        {renderCurrentStep()}
    </div>
  )
}
    