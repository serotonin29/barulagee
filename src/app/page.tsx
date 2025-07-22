import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Brain, BrainCircuit, Stethoscope, Plus, Moon, Bell, ChevronDown } from 'lucide-react';

const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);


const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-69.2 67.4c-20.5-19.3-48.8-31.2-81.6-31.2-74.2 0-134.4 60.2-134.4 134.4s60.2 134.4 134.4 134.4c83.3 0 119.2-61.2 123.5-92.4H248v-83.3h239.9c1.6 10.1 2.5 20.9 2.5 32.2z"></path>
    </svg>
)

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 text-white">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white/90 rounded-full p-2">
            <BrainCircuit className="h-6 w-6 text-blue-500" />
          </div>
          <span className="text-2xl font-bold">NeuroZsis</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/dashboard" className="hover:text-blue-200">Dashboard</Link>
          <Link href="/materials" className="hover:text-blue-200">Materi</Link>
          <Link href="/quizzes" className="hover:text-blue-200">Quiz</Link>
          <Link href="/forum" className="hover:text-blue-200">Forum</Link>
          <Link href="/ai-learning" className="hover:text-blue-200">AI Tutor</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hover:bg-white/20">
            <Moon className="h-5 w-5" />
          </Button>
          <div className="relative">
            <Button variant="ghost" size="icon" className="hover:bg-white/20">
              <Bell className="h-5 w-5" />
            </Button>
            <span className="absolute top-0 right-0 flex h-4 w-4">
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-xs text-white items-center justify-center">3</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/32x32" alt="Mahasiswa" data-ai-hint="user avatar" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">Mahasiswa</span>
            <ChevronDown className="h-4 w-4 hidden sm:inline" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Platform Pembelajaran Ilmu Saraf FK UNP
          </h1>
          <p className="text-lg text-blue-100 max-w-xl">
            Akses materi kedokteran, latihan soal, dan bantuan AI untuk mahasiswa Fakultas Kedokteran Universitas Negeri Padang
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login" passHref>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                Mulai Belajar &rarr;
              </Button>
            </Link>
            <Link href="/login" passHref>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20 w-full sm:w-auto">
                <GoogleIcon />
                Masuk dengan Google
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              <Avatar>
                <AvatarImage src="https://placehold.co/40x40" data-ai-hint="student avatar" />
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://placehold.co/40x40" data-ai-hint="student avatar" />
                <AvatarFallback>U2</AvatarFallback>
              </Avatar>
               <Avatar>
                <AvatarImage src="https://placehold.co/40x40" data-ai-hint="student avatar" />
                <AvatarFallback>U3</AvatarFallback>
              </Avatar>
            </div>
            <div>
                <p className="font-semibold">Bergabung dengan 500+ mahasiswa lainnya</p>
                <div className="flex items-center gap-1">
                    <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium text-blue-100">4.8/5.0</span>
                </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <div className="p-3 bg-white/30 rounded-lg"><Plus className="h-6 w-6"/></div>
                <div className="p-3 bg-white/30 rounded-lg"><Brain className="h-6 w-6"/></div>
                <div className="p-3 bg-white/30 rounded-lg"><Stethoscope className="h-6 w-6"/></div>
            </div>
            <h2 className="text-3xl font-bold mb-3">Anatomi Sistem Saraf</h2>
            <p className="text-blue-100 mb-6">
                Pelajari struktur dan fungsi sistem saraf manusia melalui modul interaktif dan visualisasi 3D.
            </p>
             <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://placehold.co/48x48" alt="Dr. Siti Rahayu, M.Kes" data-ai-hint="doctor person" />
                  <AvatarFallback>SR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Dr. Siti Rahayu, M.Kes</p>
                  <p className="text-sm text-blue-200">Dosen Anatomi FK UNP</p>
                </div>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-blue-400/50 rounded-full blur-3xl -z-10"></div>
           <div className="absolute -top-8 -left-8 w-40 h-40 bg-blue-400/50 rounded-full blur-3xl -z-10"></div>
        </div>
      </main>
    </div>
  );
}
