export default function Visite() {
  return (
    <main className="museum-page">
      <section className="container page-section">
        <div className="section-intro">
          <p className="eyebrow">Planeje sua chegada</p>
          <h1>Visite o Museu</h1>
          <p>Venha conhecer este espaço de memória, encontro e ancestralidade em Aracaju.</p>
        </div>

        <div className="info-strip">
          <div className="info-item">
            <strong>Horários</strong>
            <span>Terça a sexta, 9h às 18h<br />Sábado, 10h às 16h</span>
          </div>
          <div className="info-item">
            <strong>Endereço</strong>
            <span>Av. Tiradentes, 210<br />Marivan, Aracaju — SE</span>
          </div>
          <div className="info-item">
            <strong>Acessibilidade</strong>
            <span>Consulte a equipe para organizar sua visita com conforto.</span>
          </div>
        </div>

        <a className="route-link" href="/consultas">Agendar uma consulta</a>

        {/* ── Mapa interativo ── */}
        <div style={{ marginTop: '3.5rem' }}>
          <div className="section-intro" style={{ marginBottom: '1.5rem' }}>
            <p className="eyebrow">Como chegar</p>
            <h2 style={{
              margin: '.6rem 0 .75rem',
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
              lineHeight: 1.1,
            }}>
              Localização
            </h2>
            <p>Encontre o museu no mapa e trace sua rota.</p>
          </div>

          <div style={{
            position: 'relative',
            width: '100%',
            height: '450px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid var(--gray-border)',
            boxShadow: '0 12px 30px rgba(72, 45, 28, .07)',
          }}>
            <iframe
              title="Localização do Museu Ilê Ohun Lailai no Google Maps"
              src="https://www.google.com/maps?q=2WF5%2BCQ+Marivan,+Aracaju+-+SE&hl=pt-BR&z=16&output=embed"
              width="100%"
              height="100%"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                border: 0,
                width: '100%',
                height: '100%',
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '1.25rem',
            alignItems: 'center',
          }}>
            <a
              className="route-link"
              href="https://www.google.com/maps/search/?api=1&query=2WF5%2BCQ+Marivan%2C+Aracaju+-+SE"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: 0 }}
            >
              Abrir no Google Maps ↗
            </a>
            <a
              className="route-link"
              href="https://www.google.com/maps/dir/?api=1&destination=2WF5%2BCQ+Marivan%2C+Aracaju+-+SE"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: 0, background: 'var(--secondary)' }}
            >
              Traçar rota ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

