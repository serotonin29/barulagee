"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  role: z.enum(['mahasiswa', 'dosen'], {
    required_error: 'You need to select a role to continue.',
  }),
});

export default function ContinueRegistrationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleContinue = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    // TODO: 
    // 1. Get current Firebase user.
    // 2. Update the user's document in Firestore with the selected role.
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Selected role:', values.role);
    toast({
        title: "Registration Complete!",
        description: "Redirecting to your dashboard...",
    });
    router.push('/dashboard');
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>One Last Step</CardTitle>
        <CardDescription>
          Please select your role to complete your registration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleContinue)} className="space-y-6">
             <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="I am a..." />
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 animate-spin" />}
              Complete Registration & Go to Dashboard
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
