import Link from "next/link";

export default function Acervo() {
  return (
    <main className="museum-page">
      <section className="container page-section">
        <div className="section-intro"><p className="eyebrow">Coleção viva</p><h1>Acervo</h1><p>Objetos, imagens e narrativas que preservam a memória do terreiro e da comunidade. Cada peça poderá receber foto, descrição, origem e créditos.</p></div>
        <div className="editorial-grid">
          <Link className="editorial-card accent editorial-card-link" href="/acervo/objetos-de-axe">
            <span className="eyebrow">Coleção 01</span><h2>Objetos de axé</h2><p>Peças ritualísticas e objetos de uso cotidiano.</p><span className="card-arrow">Explorar coleção ↗</span>
          </Link>
          <Link className="editorial-card editorial-card-link" href="/acervo/vestuario">
            <span className="eyebrow">Coleção 02</span><h2>Vestuário</h2><p>Indumentárias, tecidos e símbolos de identidade.</p><span className="card-arrow">Explorar coleção ↗</span>
          </Link>
          <Link className="editorial-card editorial-card-link" href="/acervo/arquivo-oral">
            <span className="eyebrow">Coleção 03</span><h2>Arquivo oral</h2><p>Depoimentos, cantos e histórias compartilhadas.</p><span className="card-arrow">Explorar coleção ↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
