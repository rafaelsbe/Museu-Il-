export default function Visite() {
  return (
    <main className="museum-page">
      <section className="container page-section">
        <div className="section-intro"><p className="eyebrow">Planeje sua chegada</p><h1>Visite o Museu</h1><p>Venha conhecer este espaço de memória, encontro e ancestralidade em Aracaju.</p></div>
        <div className="info-strip"><div className="info-item"><strong>Horários</strong><span>Terça a sexta, 9h às 18h<br />Sábado, 10h às 16h</span></div><div className="info-item"><strong>Endereço</strong><span>Av. Tiradentes, 210<br />Marivan, Aracaju — SE</span></div><div className="info-item"><strong>Acessibilidade</strong><span>Consulte a equipe para organizar sua visita com conforto.</span></div></div>
        <a className="route-link" href="/consultas">Agendar uma consulta</a>
      </section>
    </main>
  );
}
