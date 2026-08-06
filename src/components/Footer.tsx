import { Phone } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";
import { DottedPattern } from "@/components/ui/DottedPattern";

export function Footer() {
  return (
    <footer>
      <div className="relative overflow-hidden bg-white px-6 py-16 md:px-12 lg:px-16">
        <DottedPattern className="absolute -right-4 top-8 opacity-60" size={120} />

        <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-4 font-serif text-2xl font-bold uppercase">
            Ilè Asè Alaketù Oyá Igbalè
            </h3>
            <p className="text-sm leading-relaxed text-gray-text">
              Av Tiradentes, 210
              <br />
              Marivan, Aracaju — SE
              <br />
              CEP 49043-436
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider">
              Horários de Funcionamento
            </h4>
            <div className="space-y-1 text-sm text-gray-text">
              <p>Terça a Sexta: 9h — 18h</p>
              <p>Sábado: 10h — 16h</p>
              <p>Domingo e Segunda: Fechado</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <PillButton href="#" variant="black" className="w-full md:w-auto">
              Entre em Contato
            </PillButton>
            <PillButton href="tel:+557132221234" className="w-full md:w-auto">
              <Phone size={14} />
              (71) 3222-1234
            </PillButton>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-border bg-white px-6 py-4 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-text">
          <a href="#" className="hover:text-foreground">
            Política de Privacidade
          </a>
          <span className="hidden text-gray-border md:inline">|</span>
          <a href="#" className="hover:text-foreground">
            Mapa do Site
          </a>
          <span className="hidden text-gray-border md:inline">|</span>
          <a href="#" className="hover:text-foreground">
            Acessibilidade
          </a>
          <span className="hidden text-gray-border md:inline">|</span>
          <span>© 2026 Museu de Candomblé</span>
        </div>
      </div>
    </footer>
  );
}
