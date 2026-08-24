"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles, Compass, Calendar, BookOpen, MapPin, Info, Layers, ChevronDown } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuseumMenuOpen, setIsMuseumMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 48);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const museumLinks = [
    { label: "Barracões", href: "/areas", icon: Layers },
    { label: "Programação", href: "/programacao", icon: Calendar },
    { label: "Educação", href: "/educacao", icon: BookOpen },
  ];

  const primaryLinks = [
    { label: "Início", href: "/", icon: Compass },
    { label: "O Museu", href: "/sobre", icon: Info },
    { label: "Acervo", href: "/acervo", icon: BookOpen },
    { label: "Visite", href: "/visite", icon: MapPin },
  ];

  return (
    <header className={`museum-navbar sticky top-0 z-50 border-b border-white/10 bg-foreground/95 text-white shadow-lg backdrop-blur-md ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="museum-navbar-inner mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="museum-logo group" aria-label="Ilè Asè Alaketù Oyá Igbalè, início">
          <div className="museum-logo-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif font-bold text-lg text-white shadow-md transition-colors group-hover:bg-primary-dark">
            
          </div>
          <div className="museum-logo-copy flex flex-col">
            <span className="font-serif text-sm font-bold uppercase tracking-wider text-white transition-colors group-hover:text-gold">
              Ilè Asè Alaketù
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/55">
              Oya Igbale / Museu Vivo
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {primaryLinks.map((item) => {
            const Icon = item.icon;
            if (item.label === "O Museu") {
              return (
                <div key={item.href} className="museum-dropdown relative">
                  <button type="button" onClick={() => setIsMuseumMenuOpen(!isMuseumMenuOpen)} aria-expanded={isMuseumMenuOpen} className="museum-nav-link flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/80 transition-all hover:bg-white/10 hover:text-white">
                    <Icon size={15} aria-hidden="true" />
                    {item.label}
                    <ChevronDown size={14} className={`transition-transform ${isMuseumMenuOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  {isMuseumMenuOpen && (
                    <div className="museum-dropdown-panel absolute left-0 top-full mt-3 w-56 rounded-lg border border-white/10 bg-foreground p-2 shadow-2xl">
                      <Link href={item.href} onClick={() => setIsMuseumMenuOpen(false)} className="museum-dropdown-link flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/85 hover:bg-white/10 hover:text-white">Sobre o Museu</Link>
                      {museumLinks.map((museumItem) => {
                        const MuseumIcon = museumItem.icon;
                        return <Link key={museumItem.href} href={museumItem.href} onClick={() => setIsMuseumMenuOpen(false)} className="museum-dropdown-link flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/85 hover:bg-white/10 hover:text-white"><MuseumIcon size={16} className="text-gold" aria-hidden="true" />{museumItem.label}</Link>;
                      })}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className="museum-nav-link flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/80 transition-all hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/consultas" className="museum-cta ml-5 flex items-center gap-2 rounded-full border border-gold/70 bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:bg-yellow-300">
            <Sparkles size={14} aria-hidden="true" />
            Consultas &amp; Búzios
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          className="rounded-lg p-2 text-white/75 hover:bg-white/10 hover:text-white lg:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div id="mobile-navigation" className="border-t border-white/10 bg-foreground/98 px-4 pb-6 pt-3 shadow-2xl lg:hidden">
          <nav className="flex flex-col gap-1.5">
            {primaryLinks.map((item) => {
              const Icon = item.icon;
              if (item.label === "O Museu") {
                return (
                  <div key={item.href}>
                    <button type="button" onClick={() => setIsMuseumMenuOpen(!isMuseumMenuOpen)} aria-expanded={isMuseumMenuOpen} className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-white/85 hover:bg-white/10 hover:text-white">
                      <span className="flex items-center gap-3"><Icon size={18} className="text-primary" aria-hidden="true" />{item.label}</span>
                      <ChevronDown size={17} className={`transition-transform ${isMuseumMenuOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                    {isMuseumMenuOpen && <div className="ml-5 border-l border-white/15 pl-3">{[...museumLinks, { label: "Sobre o Museu", href: item.href, icon: Info }].map((museumItem) => { const MuseumIcon = museumItem.icon; return <Link key={museumItem.href} href={museumItem.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"><MuseumIcon size={16} className="text-gold" aria-hidden="true" />{museumItem.label}</Link>; })}</div>}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <Icon size={18} className="text-primary" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
            <Link href="/consultas" onClick={() => setIsOpen(false)} className="mt-3 flex items-center justify-center gap-2 rounded-full border border-gold/70 bg-gold px-4 py-3 text-sm font-bold text-foreground"><Sparkles size={17} aria-hidden="true" />Consultas &amp; Búzios</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
