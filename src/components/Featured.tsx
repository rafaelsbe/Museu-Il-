import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";
import image12 from "../assets/images/Candomblé festival in Salvador, Brazil….jpg"

export function Featured() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="grid min-h-[500px] lg:grid-cols-2">
        <div className="relative flex flex-col justify-center bg-black px-8 py-16 md:px-16 lg:py-24">
          <h2 className="mb-6 font-serif text-4xl font-bold uppercase leading-tight text-white md:text-5xl">
            Tradição
            <br />e Memória Viva
          </h2>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-white/70">
            O Museu de Candomblé nasce do desejo de preservar e celebrar a rica
            herança espiritual e cultural afro-brasileira. Um espaço de acolhimento,
            educação e resistência.
          </p>
          <PillButton href="#" variant="ghost" className="w-fit">
            Saiba Mais
            <ArrowRight size={14} />
          </PillButton>

          <div className="absolute -right-px top-0 hidden h-full w-16 lg:block">
            <svg
              viewBox="0 0 64 500"
              fill="none"
              className="h-full w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 0C32 125 32 375 0 500H64V0H0Z"
                fill="black"
              />
            </svg>
          </div>
        </div>

        <div className="relative min-h-[400px] lg:min-h-0">
          <div className="absolute -left-px top-0 z-10 hidden h-full w-16 lg:block">
            <svg
              viewBox="0 0 64 500"
              fill="none"
              className="h-full w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M64 0C32 125 32 375 64 500H0V0H64Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="absolute left-0 top-0 z-20 hidden h-full w-1 bg-primary lg:block" />

          <Image
            src={image12}
            alt="Tradição do Candomblé"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
