"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles, Compass, Calendar, BookOpen, MapPin, Info, Layers } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Início", href: "/", icon: Compass },
    { label: "O Museu", href: "/sobre", icon: Info },
    { label: "4 Áreas", href: "/areas", icon: Layers },
    { label: "Consultas & Búzios", href: "/consultas", icon: Sparkles, highlight: true },
    { label: "Acervo", href: "/acervo", icon: BookOpen },
    { label: "Programação", href: "/programacao", icon: Calendar },
    { label: "Educação", href: "/educacao", icon: BookOpen },
    { label: "Visite", href: "/visite", icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-50 bg-neutral-900/95 text-white backdrop-blur-md border-b border-neutral-800 shadow-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-700 font-serif font-bold text-lg text-amber-100 shadow-md group-hover:bg-amber-600 transition-colors">
            IA
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-sm font-bold tracking-wider text-amber-100 uppercase group-hover:text-amber-300 transition-colors">
              Ilè Asè Alaketù
            </span>
            <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-medium">
              Oyá Igbalè • Museu Vivo
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            if (item.highlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:from-amber-500 hover:to-amber-600 transition-all transform hover:-translate-y-0.5 border border-amber-400/30"
                >
                  <Icon size={14} className="animate-pulse" />
                  {item.label}
                </Link>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-amber-200 hover:bg-neutral-800/60 rounded-md transition-all"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-800 hover:text-white lg:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div id="mobile-navigation" className="lg:hidden border-t border-neutral-800 bg-neutral-900/98 px-4 pb-6 pt-3 shadow-2xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                    item.highlight
                      ? "bg-amber-700/90 text-amber-100 border border-amber-500/40 font-bold"
                      : "text-neutral-200 hover:bg-neutral-800 hover:text-amber-200"
                  }`}
                >
                  <Icon size={18} className={item.highlight ? "text-amber-200" : "text-amber-600"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
