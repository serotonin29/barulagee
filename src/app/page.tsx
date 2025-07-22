import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Brain, BrainCircuit, Stethoscope, Plus, Moon, Bell, ChevronDown } from 'lucide-react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-69.2 67.4c-20.5-19.3-48.8-31.2-81.6-31.2-74.2 0-134.4 60.2-134.4 134.4s60.2 134.4 134.4 134.4c83.3 0 119.2-61.2 123.5-92.4H248v-83.3h239.9c1.6 10.1 2.5 20.9 2.5 32.2z"></path>
    </svg>
)

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 text-white flex flex-col">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white/90 rounded-full p-2">
            <BrainCircuit className="h-6 w-6 text-blue-500" />
          </div>
          <span className="text-2xl font-bold">NeuroZsis</span>
        </div>
        <div className="flex items-center gap-4">
            <Link href="/login" passHref>
                <Button variant="ghost" className="hover:bg-white/20 hidden md:inline-flex">
                    Login
                </Button>
            </Link>
            <Link href="/register" passHref>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 hidden md:inline-flex">
                    Daftar Sekarang
                </Button>
            </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 flex-grow flex items-center justify-center text-center">
        <div className="space-y-8 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Platform Pembelajaran ilmu kedokteran FK UNP
          </h1>
          <p className="text-lg text-blue-100 max-w-xl mx-auto">
            Akses materi kedokteran, latihan soal, dan bantuan AI untuk mahasiswa Fakultas Kedokteran Universitas Negeri Padang
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" passHref>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                Mulai Belajar &rarr;
              </Button>
            </Link>
            <Link href="/login" passHref>
              <Button size="lg" variant="outline" className="text-white border-white bg-white/10 hover:bg-white/20 w-full sm:w-auto">
                <GoogleIcon />
                Masuk dengan Google
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="w-full text-center text-blue-200 text-sm py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <p>© 2024 NeuroZsis. All Rights Reserved.</p>
              <p>
                  <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                  <span className="mx-2">|</span>
                  <Link href="/terms" className="hover:text-white">Terms of Service</Link>
              </p>
          </div>
      </footer>
    </div>
  );
}
