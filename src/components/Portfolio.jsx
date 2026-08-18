import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PROJECTS } from '../data/projects'

const RADIUS = 190

export default function Portfolio() {
  const [active, setActive] = useState(null)
  const nodeRefs    = useRef([])
  const rafRef      = useRef(null)
  const angleRef    = useRef(0)
  const lastTimeRef = useRef(null)
  const pausedRef   = useRef(false)

  // Animation loop — updates DOM directly, no React state
  const animate = useCallback((time) => {
    if (!pausedRef.current) {
      if (lastTimeRef.current !== null) {
        const delta = time - lastTimeRef.current
        angleRef.current = (angleRef.current + delta * 0.025) % 360
      }
      lastTimeRef.current = time

      nodeRefs.current.forEach((el, i) => {
        if (!el) return
        const base  = (i / PROJECTS.length) * 360
        const rad   = ((base + angleRef.current) * Math.PI) / 180
        const x     = RADIUS * Math.cos(rad)
        const y     = RADIUS * Math.sin(rad)
        const depth = (Math.sin(rad) + 1) / 2
        const scale = 0.65 + 0.35 * depth
        const op    = 0.35 + 0.65 * depth
        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`
        el.style.opacity   = op
        el.style.zIndex    = Math.round(depth * 20)
      })
    } else {
      lastTimeRef.current = null
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate])

  const handleNodeClick = useCallback((e, p) => {
    e.stopPropagation()
    setActive(prev => {
      const next = prev?.slug === p.slug ? null : p
      pausedRef.current = next !== null

      // Apply active styles directly
      nodeRefs.current.forEach((el, i) => {
        if (!el) return
        const isActive = PROJECTS[i].slug === p.slug && next !== null
        el.classList.toggle('orbit-node--active', isActive)
        if (isActive) {
          const base = (i / PROJECTS.length) * 360
          const rad  = ((base + angleRef.current) * Math.PI) / 180
          const x    = RADIUS * Math.cos(rad)
          const y    = RADIUS * Math.sin(rad)
          el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.25)`
          el.style.opacity   = 1
          el.style.zIndex    = 50
        }
      })
      return next
    })
  }, [])

  const handleBgClick = useCallback(() => {
    setActive(null)
    pausedRef.current = false
    nodeRefs.current.forEach(el => el?.classList.remove('orbit-node--active'))
  }, [])

  return (
    <section className="portfolio" id="portfolio" onClick={handleBgClick}>
      <div className="container">
        <div className="portfolio-layout">

          {/* ── Left: header + detail panel ── */}
          <div className="portfolio-left">
            <div className="section-label">Portfolio</div>
            <h2 className="section-title">Lo que he construido<span className="green">.</span></h2>
            <p className="portfolio-hint">Selecciona un proyecto para ver los detalles.</p>

            {active ? (
              <div className="orbit-panel" onClick={e => e.stopPropagation()}>
                <button className="orbit-panel-close" onClick={handleBgClick}>✕</button>
                <div className="orbit-panel-tag">{active.tag}</div>
                <h3 className="orbit-panel-title">{active.title}</h3>
                {/* The panel has room for the long copy. `desc` stays short
                    because the card grid needs even heights. */}
                <p className="orbit-panel-desc">{active.detail || active.desc}</p>
                <div className="orbit-panel-tech">
                  {active.tech.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                {/* Sends visitors to the detail page rather than straight out to
                    the live site, so the case for the work is made first. */}
                <Link to={`/portfolio/${active.slug}`} className="portfolio-link">
                  Ver detalle &rarr;
                </Link>
              </div>
            ) : (
              <div className="orbit-panel orbit-panel--empty">
                <span>↑ Haz clic en un nodo</span>
              </div>
            )}
          </div>

          {/* ── Right: orbital ── */}
          <div className="orbit-stage">
            <div className="orbit-ring" />

            <div className="orbit-center">
              <div className="orbit-center-pulse" />
              <div className="orbit-center-core">180°</div>
            </div>

            {PROJECTS.map((p, i) => (
              <div
                key={p.slug}
                ref={el => nodeRefs.current[i] = el}
                className="orbit-node"
                onClick={e => handleNodeClick(e, p)}
              >
                <div className="orbit-node-dot">
                  <span className="orbit-node-symbol">{p.symbol}</span>
                </div>
                <div className="orbit-node-label">{p.title}</div>
              </div>
            ))}
          </div>

        </div>

        <div className="portfolio-pdf-wrap">
          <Link
            to="/portfolio"
            className="portfolio-all-btn"
            onClick={e => e.stopPropagation()}
          >
            Ver portfolio completo &rarr;
          </Link>
          <a
            href="/180Grados_Servicios.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-pdf-btn"
            onClick={e => e.stopPropagation()}
          >
            Ver servicios y tarifas
          </a>
        </div>
      </div>
    </section>
  )
}
