"use client";

import Image from "next/image";
import { useState } from "react";
import { Search, User, ChevronLeft, ChevronRight } from "lucide-react";
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

  const prevImage = () =>
    setCurrentImage((current) =>
      current === 0 ? headerImages.length - 1 : current - 1,
    );

  const nextImage = () =>
    setCurrentImage((current) =>
      current === headerImages.length - 1 ? 0 : current + 1,
    );

  return (
    <header className="relative min-h-[85vh] overflow-hidden">
      {headerImages.map((image, index) => (
        <Image
          key={image.alt}
          src={image.src}
          alt={image.alt}
          fill
          className={`absolute inset-0 object-cover transition-opacity duration-700 ${
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

      <div
        style={{ touchAction: "manipulation" }}
        className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/30 px-4 py-2 shadow-2xl shadow-black/30 backdrop-blur-sm md:bottom-12"
      >
        <button
          type="button"
          onClick={prevImage}
          aria-label="Imagem anterior"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2 px-1">
          {headerImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentImage(index)}
              aria-label={`Ir para imagem ${index + 1}`}
              className="flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-white/20"
            >
              <span
                className={`block h-2 w-2 rounded-full ${
                  index === currentImage ? "bg-white" : "bg-white/40"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={nextImage}
          aria-label="Próxima imagem"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20"
        >
          <ChevronRight size={18} />
        </button>
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
