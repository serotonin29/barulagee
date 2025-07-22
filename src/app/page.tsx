import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Brain, BrainCircuit, Stethoscope, Plus, Moon, Bell, ChevronDown, Bot, TrendingUp, Users } from 'lucide-react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-69.2 67.4c-20.5-19.3-48.8-31.2-81.6-31.2-74.2 0-134.4 60.2-134.4 134.4s60.2 134.4 134.4 134.4c83.3 0 119.2-61.2 123.5-92.4H248v-83.3h239.9c1.6 10.1 2.5 20.9 2.5 32.2z"></path>
    </svg>
)

const features = [
    {
        icon: <Brain className="h-8 w-8 text-white" />,
        title: "Materi Komprehensif",
        description: "Koleksi lengkap modul pembelajaran dari dasar hingga klinis dengan kurikulum terkini."
    },
    {
        icon: <Bot className="h-8 w-8 text-white" />,
        title: "AI Tutor",
        description: "Dapatkan penjelasan instan dan bantuan memahami konsep sulit dengan bantuan kecerdasan buatan."
    },
    {
        icon: <TrendingUp className="h-8 w-8 text-white" />,
        title: "Analisis Kemajuan",
        description: "Pantau perkembangan belajar Anda dengan laporan dan analisis mendalam untuk hasil yang optimal."
    },
    {
        icon: <Users className="h-8 w-8 text-white" />,
        title: "Komunitas Belajar",
        description: "Berdiskusi dengan sesama mahasiswa dan dosen melalui forum diskusi yang aktif dan suportif."
    }
]

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between bg-white/90 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 rounded-full p-2">
            <BrainCircuit className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-800">NeuroZsis</span>
        </div>
        <div className="flex items-center gap-4">
            <Link href="/login" passHref>
                <Button variant="ghost" className="hidden md:inline-flex">
                    Login
                </Button>
            </Link>
            <Link href="/register" passHref>
                <Button className="hidden md:inline-flex">
                    Daftar Sekarang
                </Button>
            </Link>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative text-white">
            <div className="absolute inset-0">
                <Image 
                    src="/hero-background.png" 
                    alt="Background of medical students"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="brightness-50"
                    data-ai-hint="medical students studying"
                />
            </div>
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 flex items-center justify-center text-center">
                <div className="space-y-8 max-w-3xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                    Platform Pembelajaran ilmu kedokteran FK UNP
                </h1>
                <p className="text-lg text-gray-200 max-w-xl mx-auto">
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
            </div>
        </section>

        <section id="features" className="py-20 sm:py-24 lg:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold">Kenapa Memilih NeuroZsis?</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Platform pembelajaran terintegrasi yang dirancang khusus untuk kebutuhan mahasiswa kedokteran.
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div key={feature.title} className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-blue-500 mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </main>
      
      <footer className="w-full text-center text-muted-foreground text-sm py-8 border-t bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <p>© 2024 NeuroZsis. All Rights Reserved.</p>
              <p className="mt-2">
                  <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
                  <span className="mx-2">|</span>
                  <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
              </p>
          </div>
      </footer>
    </div>
  );
}
