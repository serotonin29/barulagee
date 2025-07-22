"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, UploadCloud, Link, FileUp, File as FileIcon, ArrowLeft } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { Card, CardContent } from "../ui/card"
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

export function UploadMaterialForm({ onMaterialAdd, onClose, currentFolderId }: UploadMaterialFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDriveFile, setSelectedDriveFile] = useState<DriveFile | null>(null)
  const [currentStep, setCurrentStep] = useState<'method' | 'details'>('method')
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })
  
  const uploadMethod = form.watch("uploadMethod");

  async function onSubmit() {
    setIsSubmitting(true)
    
    let submissionData: Partial<DriveItem> = { 
        id: `file-${Date.now()}`,
        name: 'Untitled Material', // Default name
        type: 'file',
        parentId: currentFolderId,
    };
    
    const values = form.getValues();

    if (values.uploadMethod === 'gdrive' && selectedDriveFile) {
        submissionData.name = selectedDriveFile.name;
        submissionData.fileType = 'pdf'; // Placeholder, would be derived from actual file
    } else if (values.uploadMethod === 'embed' && values.fileUrl) {
        submissionData.name = new URL(values.fileUrl).hostname; // Basic name from URL
        submissionData.fileType = 'video'; // Placeholder
    } else if (values.uploadMethod === 'local' && values.localFile) {
        submissionData.name = values.localFile[0]?.name || 'Local File';
        submissionData.fileType = 'pdf'; // Placeholder
    }

    console.log("Submitting:", submissionData);

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

  const renderMethodStep = () => (
    <div className="space-y-4">
        <h3 className="font-medium text-center">Pilih Metode Unggah Materi</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card onClick={() => handleSelectMethod('local')} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors h-32">
                <FileUp className="w-8 h-8 text-primary"/>
                <span className="text-sm font-medium text-center">File Lokal</span>
            </Card>
             <Card onClick={() => handleSelectMethod('gdrive')} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors h-32">
                <UploadCloud className="w-8 h-8 text-primary"/>
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

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
            {uploadMethod === 'local' && (
                <FormField
                    control={form.control}
                    name="localFile"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pilih File dari Komputer</FormLabel>
                            <FormControl>
                                <Input type="file" onChange={(e) => field.onChange(e.target.files)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {uploadMethod === 'embed' && (
                 <FormField
                    control={form.control}
                    name="fileUrl"
                    rules={{ required: "URL tidak boleh kosong" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL untuk disematkan</FormLabel>
                            <FormControl>
                                <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {uploadMethod === 'gdrive' && (
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
            )}
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
