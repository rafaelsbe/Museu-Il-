import Link from "next/link";
import { notFound } from "next/navigation";

const collections = {
  "objetos-de-axe": {
    number: "Coleção 01",
    title: "Objetos de axé",
    summary: "Peças ritualísticas e objetos de uso cotidiano que guardam gestos, histórias e vínculos com a comunidade.",
    description: "Esta coleção reúne objetos que atravessam o cuidado, a celebração e a transmissão de saberes no terreiro. Cada peça é apresentada com atenção à sua materialidade, aos seus usos e às pessoas que ajudam a manter sua memória viva.",
    items: ["Ferramentas e objetos de cuidado", "Peças ligadas às celebrações", "Objetos de uso cotidiano"],
    accent: "var(--secondary-dark)",
  },
  vestuario: {
    number: "Coleção 02",
    title: "Vestuário",
    summary: "Indumentárias, tecidos e símbolos de identidade que expressam pertencimento, proteção e ancestralidade.",
    description: "Tecidos, cores, amarrações e adornos formam uma linguagem própria. Neste conjunto, o vestir aparece como prática de memória e como modo de marcar presenças, histórias e responsabilidades dentro da comunidade.",
    items: ["Tecidos e técnicas de amarração", "Adornos e elementos simbólicos", "Memórias de quem veste"],
    accent: "var(--primary)",
  },
  "arquivo-oral": {
    number: "Coleção 03",
    title: "Arquivo oral",
    summary: "Depoimentos, cantos e histórias compartilhadas por quem constrói a memória do museu.",
    description: "O arquivo oral preserva vozes, ritmos e lembranças que não cabem apenas em objetos. São narrativas registradas com a comunidade para que diferentes gerações possam escutar e continuar contando essas histórias.",
    items: ["Depoimentos de mestras e mestres", "Cantos e registros sonoros", "Histórias do território"],
    accent: "var(--gold)",
  },
} as const;

type CollectionSlug = keyof typeof collections;

type Props = {
  params: Promise<{ colecao: string }>;
};

export default async function CollectionPage({ params }: Props) {
  const { colecao } = await params;

  if (!(colecao in collections)) {
    notFound();
  }

  const collection = collections[colecao as CollectionSlug];

  return (
    <main className="museum-page">
      <section className="page-hero">
        <div className="container page-hero-content">
          <Link className="back-link" href="/acervo">← Voltar ao acervo</Link>
          <p className="eyebrow">{collection.number}</p>
          <h1>{collection.title}</h1>
          <p className="hero-summary">{collection.summary}</p>
        </div>
      </section>

      <section className="container collection-detail section-space">
        <div className="collection-detail-copy">
          <p className="eyebrow">Sobre a coleção</p>
          <p className="prose-block">{collection.description}</p>
        </div>
        <div className="collection-items" style={{ borderTopColor: collection.accent }}>
          <p className="eyebrow">Nesta coleção</p>
          <ul>
            {collection.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>
    </main>
  );
}
