"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import imageFestival from "../assets/images/Candomblé festival in Salvador, Brazil….jpg";
import imageMarço from "../assets/images/21 de março_ por que é tão importante conhecer….jpg";
import image6360 from "../assets/images/636063147379966144.jpg";

const headerImages = [
  {
    src: imageMarço,
    alt: "21 de março",
  },
  {
    src: image6360,
    alt: "Imagem 6360",
  },
  {
    src: imageFestival,
    alt: "Cerimônia de Candomblé",
  },
];

export function Header() {
  const [currentImage, setCurrentImage] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const prevImage = () =>
    setCurrentImage((current) =>
      current === 0 ? headerImages.length - 1 : current - 1,
    );

  const nextImage = () =>
    setCurrentImage((current) =>
      current === headerImages.length - 1 ? 0 : current + 1,
    );

  useEffect(() => {
    const interval = setInterval(nextImage, 25000);
    return () => clearInterval(interval);
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    touchStartX.current = event.clientX;
    touchEndX.current = null;
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (touchStartX.current !== null) {
      touchEndX.current = event.clientX;
    }
  };

  const handlePointerEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }

    const distance = touchStartX.current - touchEndX.current;
    const minDistance = 50;

    if (distance > minDistance) {
      nextImage();
    } else if (distance < -minDistance) {
      prevImage();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handlePointerCancel = () => {
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <header
      className="relative min-h-[85vh] overflow-hidden"
      style={{ touchAction: "pan-y" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerCancel}
    >
      {headerImages.map((image, index) => (
        <Image
          key={image.alt}
          src={image.src}
          alt={image.alt}
          fill
          className={`absolute inset-0 object-cover transition-opacity duration-700 ease-in-out ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
          sizes="100vw"
          priority={index === 0}
        />
      ))}
      <div className="absolute inset-0 bg-foreground/65" />

      <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 pb-20 pt-16 text-center">
        <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          <span className="h-px w-8 bg-gold" />
          Cultura Afro-Brasileira
          <span className="h-px w-8 bg-gold" />
        </p>
        <h1 className="max-w-4xl font-serif text-5xl font-bold uppercase leading-[.95] text-white md:text-7xl lg:text-8xl">
          Ilè Asè Alaketù 
          <br />
          Oyá Igbalè
        </h1>
        <p className="mt-7 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
          É um espaço de memória, acolhimento e educação, onde
          tradições ancestrais se encontram com a cidade contemporânea.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/visite" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-yellow-300">
            Planeje sua visita
            <ArrowRight size={14} />
          </Link>
          <Link href="/sobre" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/60 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10">
            Conheça o museu
          </Link>
        </div>
      </div>

      <div className="absolute bottom-16 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 md:flex">
        Explorar <ArrowDown size={14} />
      </div>

      <div className="absolute -bottom-px left-0 right-0 z-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120C240 40 480 0 720 0C960 0 1200 40 1440 120V120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </header>
  );
}
