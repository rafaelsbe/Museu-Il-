"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const reviews = [
  {
    initial: "M",
    name: "Maria Silva",
    text: "Uma experiência transformadora. O museu preserva com respeito e profundidade a memória do Candomblé. Recomendo a todos que queiram conhecer nossa história.",
  },
  {
    initial: "J",
    name: "João Santos",
    text: "A curadoria é impecável. Cada peça conta uma história de resistência e fé. Saí de lá com um novo olhar sobre a cultura afro-brasileira.",
  },
  {
    initial: "A",
    name: "Ana Costa",
    text: "As oficinas educativas são excelentes. Meus filhos aprenderam sobre respeito às tradições de forma lúdica e respeitosa. Voltaremos com certeza.",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? reviews.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === reviews.length - 1 ? 0 : c + 1));

  return (
    <section className="bg-beige px-6 py-16 md:px-12 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <SectionHeading
            script="Depoimentos"
            title="O Que Dizem Nossos Visitantes"
            align="center"
          />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((review, i) => (
              <article
                key={review.name}
                className={`rounded-2xl bg-white p-6 shadow-md transition-all duration-300 ${
                  i === current ? "scale-105 opacity-100" : "scale-95 opacity-60 md:opacity-80"
                }`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  {review.initial}
                </div>
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-gray-text">{review.text}</p>
                <p className="text-sm font-bold">{review.name}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-border bg-white text-gray-text transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Próximo"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
