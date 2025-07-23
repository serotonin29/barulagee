import { BrainCircuit, Quote } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/20">
      <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-xl border bg-card shadow-lg md:grid-cols-2 lg:grid-cols-[1fr_450px]">
        <div className="hidden flex-col justify-between bg-primary/90 p-8 text-primary-foreground md:flex">
            <div className="flex items-center gap-2 text-2xl font-bold">
                <BrainCircuit className="h-8 w-8" />
                <span>NeuroZsis</span>
            </div>
             <div className="space-y-4">
                <Quote className="h-12 w-12" />
                <p className="text-xl italic">
                    &ldquo;Ilmu kedokteran adalah seni menyentuh hati sekaligus menyembuhkan tubuh. Belajar hari ini, agar bisa menyelamatkan nyawa esok hari.&rdquo;
                </p>
                <footer className="text-sm font-medium">— Tim NeuroZsis</footer>
            </div>
             <div className="text-xs">
                © 2024 NeuroZsis. All rights reserved.
            </div>
        </div>
        <div className="flex items-center justify-center p-8">
            <div className="w-full max-w-sm">
                {children}
            </div>
        </div>
      </div>
    </div>
  );
}
