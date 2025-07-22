"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';

const perks = [
    { id: 'alternative-medicine', label: 'Alternative Medicine', icon: '/perks/Alternative Medicine.png' },
    { id: 'biochemistry', label: 'Biochemistry', icon: '/perks/Biochemistry.png' },
    { id: 'dermatology', label: 'Dermatology', icon: '/perks/Dermatology.png' },
    { id: 'general-practitioner', label: 'General Practitioner', icon: '/perks/General Practitioner.png' },
    { id: 'general-surgery', label: 'General Surgery', icon: '/perks/General Surgery.png' },
    { id: 'geriatrics', label: 'Geriatrics', icon: '/perks/Geriatrics.png' },
    { id: 'hematology', label: 'Hematology', icon: '/perks/Hematology.png' },
    { id: 'neurosurgery', label: 'Neurosurgery', icon: '/perks/Neurosurgery.png' },
    { id: 'obstetrics', label: 'Obstetrics', icon: '/perks/Obstetrics.png' },
    { id: 'ophthalmology', label: 'Ophthalmology', icon: '/perks/Ophthalmology.png' },
    { id: 'optometry', label: 'Optometry', icon: '/perks/Optometry.png' },
    { id: 'orthopedics', label: 'Orthopedics', icon: '/perks/Orthopedics.png' },
    { id: 'pediatrics', label: 'Pediatrics', icon: '/perks/Pediatrics.png' },
    { id: 'plastic-surgery', label: 'Plastic Surgery', icon: '/perks/Plastic Surgery.png' },
    { id: 'psychiatry', label: 'Psychiatry', icon: '/perks/Psychiatry.png' },
    { id: 'radiology', label: 'Radiology', icon: '/perks/Radiology.png' },
    { id: 'virology', label: 'Virology', icon: '/perks/Virology.png' },
    { id: 'anestesiologi', label: 'Anestesiologi', icon: '/perks/Anestesiologi.png' },
];


const formSchema = z.object({
  role: z.enum(['mahasiswa', 'dosen'], {
    required_error: 'You need to select a role to continue.',
  }),
  nim: z.string().optional(),
  whatsapp: z.string().optional(),
  perks: z.array(z.string()).min(1, 'Please select at least one interest.'),
});

export default function ContinueRegistrationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nim: '',
      whatsapp: '',
      perks: [],
    },
  });

  const handleContinue = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'No user is logged in.' });
        return;
    }

    setIsLoading(true);
    try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { 
            role: values.role,
            nim: values.nim || '',
            whatsapp: values.whatsapp || '',
            perks: values.perks,
            lastLogin: new Date(),
        }, { merge: true });

        toast({
            title: "Registration Complete!",
            description: "Redirecting to your dashboard...",
        });
        router.push('/dashboard');
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: error.message,
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin" />
        </div>
    )
  }

  return (
    <div className="w-full">
      <CardHeader className="text-center px-0">
        <CardTitle className="text-3xl">Satu Langkah Lagi</CardTitle>
        <CardDescription>
          Lengkapi profil Anda untuk melanjutkan.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleContinue)} className="space-y-6">
             <FormField
              control={form.control}
              name="nim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIM (Nomor Induk Mahasiswa)</FormLabel>
                   <FormControl>
                        <Input placeholder="Contoh: 21012345" {...field} disabled={isLoading} />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. WhatsApp</FormLabel>
                   <FormControl>
                        <Input placeholder="Contoh: 081234567890" {...field} disabled={isLoading} />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peran Anda</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Saya adalah..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mahasiswa">Mahasiswa (Student)</SelectItem>
                      <SelectItem value="dosen">Dosen (Lecturer)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
                control={form.control}
                name="perks"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Minat Spesialisasi</FormLabel>
                        <div className="relative">
                            <div className="flex space-x-4 pt-2 overflow-x-auto pb-4">
                            {perks.map((perk) => {
                                const isSelected = field.value?.includes(perk.id);
                                return (
                                    <Card
                                        key={perk.id}
                                        onClick={() => {
                                            const newValue = isSelected
                                            ? field.value.filter((id) => id !== perk.id)
                                            : [...field.value, perk.id];
                                            field.onChange(newValue);
                                        }}
                                        className={cn(
                                            "p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all flex-shrink-0 w-32 h-32",
                                            isSelected ? "ring-2 ring-primary bg-primary/10" : "hover:bg-accent"
                                        )}
                                    >
                                        <Image src={perk.icon} alt={perk.label} width={48} height={48} className="h-12 w-12" />
                                        <span className="text-sm font-medium text-center">{perk.label}</span>
                                    </Card>
                                );
                            })}
                            </div>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 animate-spin" />}
              Selesaikan & Lanjut ke Dashboard
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
