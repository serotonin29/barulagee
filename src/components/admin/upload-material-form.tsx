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
import { Loader2 } from "lucide-react"

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
  gdriveUrl: z.string().url({ message: "Silakan masukkan URL Google Drive yang valid." }),
  description: z.string().optional(),
})

export function UploadMaterialForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        gdriveUrl: "",
        description: "",
    }
  })

  // Placeholder for the actual upload logic
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    console.log("Form values:", values)
    
    // TODO:
    // 1. Validate Google Drive URL and extract file ID
    // 2. Call a backend function (e.g., Firebase Function) with the values
    // 3. The backend function will:
    //    a. Download the file from Google Drive
    //    b. Upload the file to a storage service (like DigitalOcean Spaces)
    //    c. Save the final URL and metadata to Firestore
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network request

    toast({
      title: "Proses Dimulai",
      description: "Materi sedang diproses dan akan segera ditambahkan ke library.",
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
