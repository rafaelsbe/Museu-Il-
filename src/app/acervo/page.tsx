export default function Acervo() {
  return (
    <main className="museum-page">
      <section className="container page-section">
        <div className="section-intro"><p className="eyebrow">Coleção viva</p><h1>Acervo</h1><p>Objetos, imagens e narrativas que preservam a memória do terreiro e da comunidade. Cada peça poderá receber foto, descrição, origem e créditos.</p></div>
        <div className="editorial-grid">
          <article className="editorial-card accent"><span className="eyebrow">Coleção 01</span><h2>Objetos de axé</h2><p>Peças ritualísticas e objetos de uso cotidiano.</p></article>
          <article className="editorial-card"><span className="eyebrow">Coleção 02</span><h2>Vestuário</h2><p>Indumentárias, tecidos e símbolos de identidade.</p></article>
          <article className="editorial-card"><span className="eyebrow">Coleção 03</span><h2>Arquivo oral</h2><p>Depoimentos, cantos e histórias compartilhadas.</p></article>
        </div>
      </section>
    </main>
  );
}
