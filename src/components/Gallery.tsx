import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";
import image1 from "../assets/images/cantoria.jpeg";
import image2 from "../assets/images/visão geral.jpeg";
import image3 from "../assets/images/foto 3.jpeg";
import image4 from "../assets/images/mulher-retrato.jpeg";
import image5 from "../assets/images/Fundo do lugar.jpeg";
import image6 from "../assets/images/foto 4.jpeg";


const galleryImages = [
  {
    src: image1,
    alt: "Escultura ritual",
    className: "col-span-1 row-span-2",
    height: "h-[420px]",
  },
  {
    src: image2,
    alt: "Cerimônia",
    className: "col-span-1",
    height: "h-[200px]",
  },
  { 
    src: image3,
    alt: "Música e dança",  
    className: "col-span-1",
    height: "h-[200px]",
  },
  {
    src: image4,
    alt: "Acervo do museu",
    className: "col-span-1 row-span-2",
    height: "h-[420px]",
  },
  {
    src: image5,
    alt: "Artesanato afro",
    className: "col-span-1",
    height: "h-[200px]",
  },
  {
    src: image6,
    alt: "Tradição oral",
    className: "col-span-1",
    height: "h-[200px]",
  },
];

export function Gallery() {
  return (
    <section className="relative overflow-hidden px-6 py-16 md:px-12 lg:px-16 lg:py-24">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="absolute -top-px left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0C360 80 720 80 1080 0C1260 40 1380 60 1440 80V0H0Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl pt-8">
        <div className="mb-12 text-center text-white">
          <p className="font-script text-2xl text-script-pink md:text-3xl">Acervo</p>
          <h2 className="font-serif text-3xl font-bold uppercase tracking-wide md:text-4xl lg:text-5xl">
            Galeria do Museu
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/70">
            Peças ritualísticas, vestimentas sagradas e objetos que contam a história
            viva do Candomblé brasileiro.
          </p>
        </div>

        <div className="relative">
          <span className="absolute -left-4 top-1/4 z-10 h-6 w-6 rounded-full bg-primary" />
          <span className="absolute right-8 top-12 z-10 h-4 w-4 rounded-full bg-primary" />
          <span className="absolute bottom-20 left-1/3 z-10 h-3 w-3 rounded-full bg-primary" />
          <span className="absolute -right-2 bottom-1/3 z-10 h-8 w-8 rounded-full bg-primary" />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {galleryImages.map((img) => (
              <div
                key={img.alt}
                className={`relative overflow-hidden rounded-xl ${img.className} ${img.height}`}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <PillButton href="/acervo" variant="primary">
            Ver Acervo Completo
            <ArrowRight size={14} />
          </PillButton>
        </div>
      </div>

      <div className="absolute -bottom-px left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80C360 0 720 0 1080 80C1260 40 1380 20 1440 0V80H0Z"
            fill="#f5f0eb"
          />
        </svg>
      </div>
    </section>
  );
}
