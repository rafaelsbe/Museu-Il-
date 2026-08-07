import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";
import { DottedPattern } from "@/components/ui/DottedPattern";
import image1 from "../assets/images/visita guiada.jpeg";
import image2 from "../assets/images/roda de conversa.jpeg";

const events = [
  {
    date: "16 MAR",
    title: "Roda de Conversa",
    subtitle: "História e resistência do Candomblé",
    image: image2,
  },
  {
    date: "22 MAR",
    title: "Oficina",
    subtitle: "Símbolos e significados na tradição iorubá",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
  },
  {
    date: "05 ABR",
    title: "Visita Guiada",
    subtitle: "Conheça o acervo permanente do museu",
    image: image1,
  },
];

export function Agenda() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-16 md:px-12 lg:px-16 lg:py-24">
      <DottedPattern className="absolute -left-4 top-8 opacity-80" size={140} />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl font-bold uppercase tracking-wide md:text-4xl">
              Nossa Agenda
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-text">
              Acompanhe os encontros e atividades que celebram a cultura, a memória e a
              educação afro-brasileira. Cada evento foi pensado para inspirar e aproximar
              visitantes de todas as idades.
            </p>
          </div>
          <PillButton href="#">
            Todos os Eventos
            <ArrowRight size={14} />
          </PillButton>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.title}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="mb-2 text-sm font-bold text-primary">{event.date}</p>
                <h3 className="mb-1 text-lg font-bold uppercase">{event.title}</h3>
                <p className="mb-4 text-sm text-gray-text">{event.subtitle}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-text">
                  <MapPin size={12} className="text-primary" />
                  <span>Aracaju, SE</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


