"use client";

import Image from "next/image";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { Search, User } from "lucide-react";
import imageFestival from "../assets/images/Candomblé festival in Salvador, Brazil….jpg";
import imageMarço from "../assets/images/21 de março_ por que é tão importante conhecer….jpg";
import image6360 from "../assets/images/636063147379966144.jpg";

const navLinks = [
  "O Museu",
  "Acervo",
  "Programação",
  "Educação",
  "Visite",
];

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
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

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
    touchStartY.current = event.clientY;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (touchStartX.current !== null && touchStartY.current !== null) {
      touchEndX.current = event.clientX;
      touchEndY.current = event.clientY;
    }
  };

  const handlePointerEnd = () => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null ||
      touchEndX.current === null ||
      touchEndY.current === null
    ) {
      touchStartX.current = null;
      touchStartY.current = null;
      touchEndX.current = null;
      touchEndY.current = null;
      return;
    }

    const distanceX = touchStartX.current - touchEndX.current;
    const distanceY = touchStartY.current - touchEndY.current;
    const minDistance = 30;

    if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > minDistance) {
      if (distanceX > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  const handlePointerCancel = () => {
    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;
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
          priority={index === 0}
        />
      ))}
      <div className="absolute inset-0 bg-black/50" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12 lg:px-16">
        <ul className="hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="text-xs font-semibold uppercase tracking-widest text-white/90 transition-colors hover:text-white"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 md:gap-5">
          <button type="button" aria-label="Buscar" className="text-white/90 hover:text-white">
            <Search size={20} />
          </button>
          <button type="button" aria-label="Perfil" className="text-white/90 hover:text-white">
            <User size={20} />
          </button>
        </div>
      </nav>

      <div className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
          Cultura Afro-Brasileira
        </p>
        <h1 className="max-w-4xl font-serif text-5xl font-bold uppercase leading-tight text-white md:text-7xl lg:text-8xl">
          Ilè Asè Alaketù 
          <br />
          Oyá Igbalè
        </h1>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
          É um espaço de memória, acolhimento e educação, onde
          tradições ancestrais se encontram com a cidade contemporânea.
        </p>
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
