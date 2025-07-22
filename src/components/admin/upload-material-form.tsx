"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, UploadCloud, Link, FileUp, File as FileIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "../ui/scroll-area"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Judul harus memiliki setidaknya 5 karakter.",
  }),
  description: z.string().optional(),
  uploadMethod: z.enum(["local", "gdrive", "embed"]),
  gdriveUrl: z.string().url().optional(),
  embedUrl: z.string().url().optional(),
  localFile: z.any().optional(),
}).refine(data => {
    // This validation is now more complex, will handle manually during submission.
    return true;
});

const dummyDriveFiles = [
    { id: '1', name: 'Neuroanatomy Lecture Notes.pdf', type: 'pdf' },
    { id: '2', name: 'Cardiology Seminar.mp4', type: 'video' },
    { id: '3', name: 'Project Outline - Group A', type: 'doc' },
    { id: '4', name: 'Shared Research Papers', type: 'folder' },
    { id: '5', name: 'Clinical Case Studies.pptx', type: 'ppt' },
    { id: '6', name: 'Anatomy Atlas Scans', type: 'folder' },
]

export function UploadMaterialForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDriveConnected, setIsDriveConnected] = useState(false)
  const [selectedDriveFile, setSelectedDriveFile] = useState<any>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        description: "",
        uploadMethod: "local",
        gdriveUrl: "",
        embedUrl: "",
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // TODO: Implement specific logic for each upload method
    // 1. Local: Upload file to a backend endpoint
    // 2. GDrive: Use the selected file ID to process on the backend
    // 3. Embed: Save the URL directly
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Proses Dimulai",
      description: `Materi sedang diproses menggunakan metode: ${values.uploadMethod}.`,
    })
    
    setIsSubmitting(false)
    form.reset()
    setIsDriveConnected(false)
    setSelectedDriveFile(null)
  }
  
  const handleConnectDrive = () => {
    // In a real app, this would trigger the Google OAuth flow.
    // For now, we'll just simulate a successful connection.
    setIsSubmitting(true);
    setTimeout(() => {
        setIsDriveConnected(true);
        setIsSubmitting(false);
        toast({ title: "Google Drive Terhubung", description: "Pilih file untuk diimpor." });
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        
        <FormField
          control={form.control}
          name="uploadMethod"
          render={({ field }) => (
            <FormItem className="space-y-4">
                <FormLabel>Metode Upload</FormLabel>
                 <FormControl>
                    <Tabs defaultValue={field.value} onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedDriveFile(null); // Reset selection when changing tabs
                    }} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="local"><FileUp className="mr-2 h-4 w-4"/>File Lokal</TabsTrigger>
                            <TabsTrigger value="gdrive"><UploadCloud className="mr-2 h-4 w-4"/>Google Drive</TabsTrigger>
                            <TabsTrigger value="embed"><Link className="mr-2 h-4 w-4"/>Embed URL</TabsTrigger>
                        </TabsList>
                        <TabsContent value="local" className="pt-4">
                            <FormField
                            control={form.control}
                            name="localFile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pilih File</FormLabel>
                                    <FormControl>
                                        <Input type="file" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormDescription>Upload file langsung dari komputer Anda.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </TabsContent>
                        <TabsContent value="gdrive" className="pt-4 min-h-[250px] flex flex-col">
                            {!isDriveConnected ? (
                                <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                                    <UploadCloud className="w-12 h-12 text-muted-foreground mb-4"/>
                                    <h3 className="text-lg font-semibold">Hubungkan ke Google Drive</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Login dan berikan izin untuk mengakses file Anda.</p>
                                    <Button type="button" onClick={handleConnectDrive} disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                        Hubungkan Akun Google
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm font-medium mb-2">Pilih file dari Drive Anda:</p>
                                    <ScrollArea className="h-64 rounded-md border">
                                        <div className="p-2 space-y-1">
                                            {dummyDriveFiles.map(file => (
                                                <div 
                                                    key={file.id} 
                                                    onClick={() => setSelectedDriveFile(file)}
                                                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${selectedDriveFile?.id === file.id ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-accent'}`}
                                                >
                                                    <FileIcon className="h-5 w-5 text-muted-foreground" />
                                                    <span className="text-sm flex-grow">{file.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="embed" className="pt-4">
                            <FormField
                            control={form.control}
                            name="embedUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL untuk disematkan</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Masukkan URL dari sumber seperti YouTube, Vimeo, dll.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </TabsContent>
                    </Tabs>
                </FormControl>
                <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi (Opsional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Jelaskan secara singkat isi dari materi ini..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Ambil & Simpan ke Library
        </Button>
      </form>
    </Form>
  )
}
