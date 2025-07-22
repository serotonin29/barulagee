
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const motivationalQuotes = [
    { quote: "Ilmu kedokteran adalah seni menyentuh hati sekaligus menyembuhkan tubuh." },
    { quote: "Menjadi dokter bukan hanya tentang obat, tapi tentang harapan." },
    { quote: "Tangan yang merawat harus dibimbing oleh hati yang peduli." },
    { quote: "Dalam setiap diagnosis, ada empati yang tersembunyi." },
    { quote: "Belajar hari ini, agar bisa menyelamatkan nyawa esok hari." },
]

export function MotivationCarousel() {
  return (
    <Carousel 
        opts={{ loop: true }} 
        plugins={[Autoplay({delay: 5000})]}
        className="w-full"
    >
      <CarouselContent>
        {motivationalQuotes.map((item, index) => (
          <CarouselItem key={index}>
            <Card className="relative overflow-hidden text-white">
                <div className="absolute inset-0">
                    <Image 
                        src="/home/user/studio/public/gedung-unp.jpg" 
                        alt="Medical background"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="brightness-50"
                        data-ai-hint="medical students studying"
                    />
                </div>
                <CardContent className="relative flex items-center justify-center p-6 h-40">
                    <p className="text-xl font-semibold text-center">
                    "{item.quote}"
                    </p>
                </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  )
}
