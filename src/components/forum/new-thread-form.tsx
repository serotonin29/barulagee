"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
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
  title: z.string().min(10, {
    message: "Judul harus memiliki setidaknya 10 karakter.",
  }),
  topic: z.string({
    required_error: "Silakan pilih topik.",
  }),
  content: z.string().min(20, {
      message: "Pertanyaan harus memiliki setidaknya 20 karakter."
  }),
})

export function NewThreadForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        content: "",
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    console.log("Form values:", values)
    
    // TODO:
    // 1. Get current user ID
    // 2. Save the new thread to Firestore
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network request

    toast({
      title: "Thread Dibuat",
      description: "Diskusi Anda telah dipublikasikan.",
    })
    
    setIsSubmitting(false)
    router.push('/forum');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Pertanyaan</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Apa perbedaan antara mitosis dan meiosis?" {...field} />
              </FormControl>
              <FormDescription>
                Buat judul yang jelas dan ringkas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Topik</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih topik yang relevan" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Anatomy">Anatomi</SelectItem>
                        <SelectItem value="Physiology">Fisiologi</SelectItem>
                        <SelectItem value="Neurology">Neurologi</SelectItem>
                        <SelectItem value="Pharmacology">Farmakologi</SelectItem>
                        <SelectItem value="General">Umum</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detail Pertanyaan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Jelaskan pertanyaan Anda secara rinci di sini..."
                  className="resize-y min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Kirim Pertanyaan
        </Button>
      </form>
    </Form>
  )
}
