export default function Programacao() {
  return (
    <main className="museum-page">
      <section className="container page-section">
        <div className="section-intro"><p className="eyebrow">Agenda do Museu</p><h1>Programação</h1><p>Encontros, rodas de conversa, visitas e celebrações. A agenda está pronta para receber os eventos do banco.</p></div>
        <div className="editorial-grid">
          {['Roda de conversa', 'Visita mediada', 'Oficina de saberes'].map((event, index) => <article className="editorial-card" key={event}><span className="eyebrow">Próximo encontro • 0{index + 1}</span><h2>{event}</h2><p>Data e horário serão publicados pela equipe do museu.</p><a className="route-link" href="/visite">Ver detalhes</a></article>)}
        </div>
      </section>
    </main>
  );
}
