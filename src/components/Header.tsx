import Image from "next/image";
import { Search, User } from "lucide-react";
import image1 from "../assets/images/Candomblé festival in Salvador, Brazil….jpg"

const navLinks = [
  "O Museu",
  "Acervo",
  "Programação",
  "Educação",
  "Visite",
];

export function Header() {
  return (
    <header className="relative min-h-[85vh] overflow-hidden">
      <Image
        src={image1}
        alt="Cerimônia de Candomblé"
        fill
        className="object-cover"
        priority
      />
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
      </div>

      <div className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i === 0 ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>

      <div className="absolute -bottom-px left-0 right-0 z-20">
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
