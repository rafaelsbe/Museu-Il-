"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

type AreaData = {
  slug: string;
  title: string;
  description: string;
  colorToken?: string;
  images?: { src: string; alt: string }[];
};

export function AreaPageClient({ area }: { area: string }) {
  const [data, setData] = useState<AreaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/areas/${encodeURIComponent(area)}`)
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao buscar dados da área");
        return r.json();
      })
      .then((json) => {
        if (mounted) setData(json);
      })
      .catch((err) => {
        if (mounted) setError(String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [area]);

  if (loading) return <main className="museum-page"><section className="container page-section"><p className="muted">Carregando área...</p></section></main>;
  if (error) return <main className="museum-page"><section className="container page-section"><p role="alert" className="muted">Erro: {error}</p></section></main>;
  if (!data) return <main className="museum-page"><section className="container page-section"><p className="muted">Nenhuma informação disponível para esta área.</p></section></main>;

  return (
    <main className="museum-page"><section aria-labelledby="area-title" className="container page-section">
      <div className="section-intro"><p className="eyebrow">Território de memória</p><h1 id="area-title" style={{ color: `var(${data.colorToken || "--primary"})` }}>{data.title}</h1><p>{data.description}</p></div>

        <div className="grid gap-4 md:grid-cols-2 mt-6">
          {(data.images || []).map((img) => (
            <div key={img.src} className="card">
              <Image src={img.src} alt={img.alt} width={900} height={600} className="w-full rounded-md object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="mb-2 text-xl font-semibold accent-heading">História deste território</h2>
          <p className="text-sm leading-relaxed muted">Coloque aqui o texto histórico da área e substitua este placeholder pelos dados reais do banco.</p>
        </div>
    </section></main>
  );
}

export default AreaPageClient;
