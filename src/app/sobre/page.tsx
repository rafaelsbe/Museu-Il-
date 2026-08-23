export default function Sobre() {
  return (
    <main className="museum-page">
      <section className="page-hero">
        <div className="container page-hero-content">
          <p className="eyebrow">Nossa casa, nossa memória</p>
          <h1>Um museu vivo de cultura e ancestralidade</h1>
          <p className="lead">Um espaço de acolhimento, pesquisa e educação dedicado à força da cultura afro-brasileira.</p>
        </div>
      </section>
      <section className="container content-grid section-space">
        <div><p className="eyebrow">O Museu</p><h2 className="display-heading">A história que continua sendo escrita</h2></div>
        <div className="prose-block"><p>Este é o lugar para contar a história do museu, do barracão e das entidades que dão sentido a este território.</p><p>Inclua aqui a trajetória da comunidade, os marcos importantes e as pessoas que preservam estes saberes para as próximas gerações.</p></div>
      </section>
      <section className="container feature-grid section-space">
        {['Memória', 'Acolhimento', 'Educação'].map((title, index) => <article className="feature-card" key={title}><span className="feature-number">0{index + 1}</span><h3>{title}</h3><p>Conteúdo editorial, imagens e depoimentos entram aqui para apresentar a essência do museu.</p></article>)}
      </section>
    </main>
  );
}
