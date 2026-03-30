import { Link } from 'react-router-dom'
import InstagramIntelligence from '../components/InstagramIntelligence'

export default function InstagramPage() {
  return (
    <>
      <div style={{ minHeight: '100vh', paddingTop: '72px' }}>

        {/* back link */}
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '12px' }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: 'var(--muted)', fontSize: '13px',
            fontFamily: 'var(--font-body)', textDecoration: 'none',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
          >
            ← Volver al inicio
          </Link>
        </div>

        {/* hero */}
        <div className="container" style={{ paddingBottom: '60px' }}>
          <div style={{ maxWidth: '680px', marginBottom: '56px' }}>
            <div className="section-label">Herramientas</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: 'var(--text)',
              marginBottom: '16px',
            }}>
              Lector de<br />
              <span style={{ color: 'var(--green)' }}>Instagram</span>
            </h1>
            <p style={{
              color: 'var(--muted)',
              fontSize: '16px',
              lineHeight: 1.7,
              maxWidth: '500px',
            }}>
              Extrae posts, comentarios y datos de perfiles de Instagram para analizar
              tu competencia y tomar decisiones con datos reales.
            </p>
          </div>

          <InstagramIntelligence />
        </div>

      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-copy">&copy; 2026 creado por 180°</div>
            <div className="footer-right">
              <Link to="/#servicios" className="footer-link">Servicios</Link>
              <Link to="/#portfolio" className="footer-link">Portfolio</Link>
              <Link to="/#contacto" className="footer-link">Contacto</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
