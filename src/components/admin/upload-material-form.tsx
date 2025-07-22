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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, UploadCloud, Link, FileUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Judul harus memiliki setidaknya 5 karakter.",
  }),
  topic: z.string({
    required_error: "Silakan pilih topik.",
  }),
  type: z.string({
    required_error: "Silakan pilih tipe konten.",
  }),
  description: z.string().optional(),
  uploadMethod: z.enum(["local", "gdrive", "embed"]),
  gdriveUrl: z.string().url().optional(),
  embedUrl: z.string().url().optional(),
  localFile: z.any().optional(),
}).refine(data => {
    if (data.uploadMethod === 'gdrive') return !!data.gdriveUrl;
    if (data.uploadMethod === 'embed') return !!data.embedUrl;
    if (data.uploadMethod === 'local') return !!data.localFile;
    return false;
}, {
    message: "Please provide a source for the selected upload method.",
    path: ["uploadMethod"],
});

export function UploadMaterialForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    console.log("Form values:", values)
    
    // TODO: Implement specific logic for each upload method
    // 1. Local: Upload file to a backend endpoint
    // 2. GDrive: Validate URL, use backend to fetch and store
    // 3. Embed: Save the URL directly
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Proses Dimulai",
      description: `Materi sedang diproses menggunakan metode: ${values.uploadMethod}.`,
    })
    
    setIsSubmitting(false)
    form.reset()
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
        <div className="grid md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Topik</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih topik materi" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Anatomy">Anatomi</SelectItem>
                        <SelectItem value="Physiology">Fisiologi</SelectItem>
                        <SelectItem value="Neurology">Neurologi</SelectItem>
                        <SelectItem value="Pharmacology">Farmakologi</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tipe Konten</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe konten" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="text">Teks</SelectItem>
                        <SelectItem value="infographic">Infografik</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="uploadMethod"
          render={({ field }) => (
            <FormItem className="space-y-4">
                <FormLabel>Metode Upload</FormLabel>
                 <FormControl>
                    <Tabs defaultValue={field.value} onValueChange={field.onChange} className="w-full">
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
                        <TabsContent value="gdrive" className="pt-4">
                             <FormField
                                control={form.control}
                                name="gdriveUrl"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>URL Google Drive</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://docs.google.com/document/d/..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Pastikan link dapat diakses secara publik (public sharing link).
                                    </FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
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
