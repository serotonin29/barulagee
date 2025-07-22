"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const checkUserProfileAndRedirect = async (user: User) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data()?.role) {
        toast({
            title: "Login Successful",
            description: "Redirecting to your dashboard...",
        });
        router.push('/dashboard');
    } else {
        // If user doc exists but no role, or doc doesn't exist at all.
        // This case is important for users who signed up but didn't complete registration.
        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        }, { merge: true });
        
        toast({
            title: "Almost there!",
            description: "Please complete your profile to continue.",
        });
        router.push('/continue-registration');
    }
  };


  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      await checkUserProfileAndRedirect(userCredential.user);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await checkUserProfileAndRedirect(result.user);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: error.message,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const anyLoading = isLoading || isGoogleLoading;

  return (
    <div className="w-full">
        <CardHeader className="text-center px-0">
            <CardTitle className="text-3xl">Selamat Datang Kembali</CardTitle>
            <CardDescription>
                Masukkan kredensial Anda untuk mengakses akun.
            </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                        disabled={anyLoading}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <Link href="#" className="text-sm font-medium text-primary hover:underline">
                                Lupa password?
                            </Link>
                        </div>
                        <FormControl>
                            <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            disabled={anyLoading}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full" disabled={anyLoading}>
                {isLoading && <Loader2 className="mr-2 animate-spin" />}
                Login
                </Button>
            </form>
            </Form>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                    atau login dengan
                    </span>
                </div>
            </div>
            <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={anyLoading}
            >
            {isGoogleLoading ? (
                <Loader2 className="mr-2 animate-spin" />
            ) : (
                <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
                >
                <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-69.2 67.4c-20.5-19.3-48.8-31.2-81.6-31.2-74.2 0-134.4 60.2-134.4 134.4s60.2 134.4 134.4 134.4c83.3 0 119.2-61.2 123.5-92.4H248v-83.3h239.9c1.6 10.1 2.5 20.9 2.5 32.2z"
                ></path>
                </svg>
            )}
            Login dengan Google
            </Button>
        </CardContent>
        <CardFooter className="justify-center px-0">
            <p className="text-sm text-muted-foreground">
                Belum punya akun?{' '}
                <Link href="/register" className="font-medium text-primary hover:underline">
                    Daftar sekarang
                </Link>
            </p>
        </CardFooter>
    </div>
  );
}
