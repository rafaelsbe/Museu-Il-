"use client";

import React, { useEffect, useState } from "react";

type Area = {
  slug: string;
  title: string;
  description: string;
  colorToken?: string;
};

export default function AreasListClient() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/areas")
      .then((r) => r.json())
      .then((json) => {
        if (mounted) setAreas(json || []);
      })
      .catch(() => setAreas([]))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <main className="museum-page"><section className="container page-section"><p className="muted">Carregando áreas...</p></section></main>;
  if (!areas.length) return <main className="museum-page"><section className="container page-section"><p className="muted">Nenhuma área encontrada.</p></section></main>;

  return (
    <main className="museum-page">
      <section className="container page-section">
        <div className="section-intro"><p className="eyebrow">Quatro caminhos de escuta</p><h1>Áreas do Museu</h1><p>Conheça os territórios de memória que formam este museu. Cada área poderá receber sua própria história, acervo, fotos e vídeos.</p></div>
        <div>
          <ul className="editorial-grid">
            {areas.map((a) => (
              <li key={a.slug} className="editorial-card" style={{ borderTop: `5px solid var(${a.colorToken || "--primary"})` }}>
                <a href={`/areas/${a.slug}`} className="text-2xl font-semibold no-underline" style={{ color: `var(${a.colorToken || "--primary"})` }}>{a.title}</a>
                <p className="muted mt-2">{a.description}</p>
                <a href={`/areas/${a.slug}`} className="route-link">Explorar área</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
