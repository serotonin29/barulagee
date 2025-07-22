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
import { Loader2, UploadCloud, Link, FileUp, File as FileIcon } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { Card, CardContent } from "../ui/card"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Judul harus memiliki setidaknya 5 karakter.",
  }),
  uploadMethod: z.enum(["local", "gdrive", "embed"]).optional(),
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

export function UploadMaterialForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDriveConnecting, setIsDriveConnecting] = useState(false)
  const [isDriveConnected, setIsDriveConnected] = useState(false)
  const [selectedDriveFile, setSelectedDriveFile] = useState<DriveFile | null>(null)
  const [currentStep, setCurrentStep] = useState<'title' | 'method' | 'details'>('title')
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
    }
  })
  
  const uploadMethod = form.watch("uploadMethod");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    
    let submissionData: any = { title: values.title, method: values.uploadMethod };
    if (values.uploadMethod === 'gdrive' && selectedDriveFile) {
        submissionData.fileName = selectedDriveFile.name;
    } else if (values.uploadMethod === 'embed' && values.fileUrl) {
        submissionData.url = values.fileUrl;
    } else if (values.uploadMethod === 'local' && values.localFile) {
        submissionData.fileName = values.localFile[0]?.name;
    }

    console.log("Submitting:", submissionData);

    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Proses Dimulai",
      description: `Materi "${submissionData.title}" sedang diproses.`,
    })
    
    setIsSubmitting(false)
    form.reset()
    setIsDriveConnected(false)
    setSelectedDriveFile(null)
    setCurrentStep('title');
  }
  
  const handleConnectDrive = () => {
    setIsDriveConnecting(true);
    setTimeout(() => {
        setIsDriveConnected(true);
        setIsDriveConnecting(false);
        toast({ title: "Google Drive Terhubung", description: "Pilih file untuk diimpor." });
    }, 1500);
  }

  const handleSelectMethod = (method: "local" | "gdrive" | "embed") => {
    form.setValue("uploadMethod", method);
    setCurrentStep("details");
  }

  const renderTitleStep = () => (
    <div className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Materi</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Pengenalan Sistem Saraf" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button onClick={() => form.trigger("title").then(isValid => isValid && setCurrentStep("method"))}>Lanjut</Button>
    </div>
  )

  const renderMethodStep = () => (
    <div className="space-y-4">
        <h3 className="font-medium">Pilih Metode Upload</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card onClick={() => handleSelectMethod('local')} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors">
                <FileUp className="w-8 h-8 text-primary"/>
                <span className="text-sm font-medium text-center">File Lokal</span>
            </Card>
             <Card onClick={() => handleSelectMethod('gdrive')} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors">
                <UploadCloud className="w-8 h-8 text-primary"/>
                <span className="text-sm font-medium text-center">Google Drive</span>
            </Card>
             <Card onClick={() => handleSelectMethod('embed')} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors">
                <Link className="w-8 h-8 text-primary"/>
                <span className="text-sm font-medium text-center">Embed URL</span>
            </Card>
        </div>
        <Button variant="ghost" onClick={() => setCurrentStep('title')}>Kembali</Button>
    </div>
  )
  
  const renderDetailsStep = () => {
    if (!uploadMethod) return null;

    return (
        <div className="space-y-4">
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
                <div className="min-h-[250px] flex flex-col">
                     {!isDriveConnected ? (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                            <UploadCloud className="w-12 h-12 text-muted-foreground mb-4"/>
                            <h3 className="text-lg font-semibold">Hubungkan ke Google Drive</h3>
                            <p className="text-sm text-muted-foreground mb-4">Login dan berikan izin untuk mengakses file Anda.</p>
                            <Button type="button" onClick={handleConnectDrive} disabled={isDriveConnecting}>
                                {isDriveConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Hubungkan Akun Google
                            </Button>
                        </div>
                    ) : (
                        <div>
                            {selectedDriveFile ? (
                                <Card>
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm flex-grow font-medium">{selectedDriveFile.name}</span>
                                        <Button variant="ghost" size="sm" onClick={() => setSelectedDriveFile(null)}>Ganti</Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <>
                                <p className="text-sm font-medium mb-2">Pilih file dari Drive Anda:</p>
                                <ScrollArea className="h-64 rounded-md border">
                                    <div className="p-2 space-y-1">
                                        {dummyDriveFiles.map(file => (
                                            <div 
                                                key={file.id} 
                                                onClick={() => setSelectedDriveFile(file)}
                                                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent`}
                                            >
                                                <FileIcon className="h-5 w-5 text-muted-foreground" />
                                                <span className="text-sm flex-grow">{file.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
             <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={() => setCurrentStep('method')}>Kembali</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan Materi
                </Button>
             </div>
        </div>
    )
  }
  
  const renderCurrentStep = () => {
    switch (currentStep) {
        case 'title': return renderTitleStep();
        case 'method': return renderMethodStep();
        case 'details': return renderDetailsStep();
        default: return renderTitleStep();
    }
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {renderCurrentStep()}
      </form>
    </Form>
  )
}
