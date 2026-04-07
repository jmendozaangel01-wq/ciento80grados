import { useState, useEffect, useRef, useCallback } from 'react'

const PROJECTS = [
  {
    id: 1,
    title: 'CRC Clínica',
    tag: 'Salud · Web Institucional',
    desc: 'Sitio institucional para Centro Radiológico del Caribe — IPS líder en Cartagena. Dark theme médico, carrusel de servicios, sección de especialidades y formulario de contacto.',
    tech: ['HTML / CSS', 'JavaScript', 'Diseño Web'],
    link: 'https://crcsas.com/',
    symbol: '○',
  },
  {
    id: 2,
    title: 'Salimeh Store',
    tag: 'E-commerce · Shopify',
    desc: 'Tienda Shopify de moda con diseño personalizado, apps de conversión y catálogo optimizado para maximizar ventas.',
    tech: ['Shopify', 'Liquid', 'Apps'],
    link: 'https://www.salimehstore.com/',
    symbol: '○',
  },
  {
    id: 3,
    title: 'Bornos Buy',
    tag: 'E-commerce · Shopify',
    desc: 'Plataforma de comercio electrónico con catálogo extenso y checkout optimizado para conversión.',
    tech: ['Shopify', 'Apps'],
    link: 'https://www.bornosbuy.com/',
    symbol: '○',
  },
  {
    id: 4,
    title: 'Panel HACCP',
    tag: 'Automatización · Dashboard',
    desc: 'Panel de control HACCP para planta de producción — monitoreo de freidoras, cuartos fríos y puntos críticos en tiempo real, sincronizado con Google Sheets.',
    tech: ['Google Sheets', 'APIs'],
    link: 'https://jmendozaangel01-wq.github.io/control-freidora/',
    symbol: '○',
  },
  {
    id: 5,
    title: 'Feed de Noticias',
    tag: 'Automatización · n8n',
    desc: 'Flujo RSS con n8n que agrega noticias de múltiples fuentes, las procesa y las publica automáticamente en el sitio — siempre actualizado sin intervención manual.',
    tech: ['n8n', 'RSS', 'Automatización'],
    link: '/#noticias',
    symbol: '○',
  },
  {
    id: 7,
    title: 'Analizador Instagram',
    tag: 'Automatización · n8n',
    desc: 'Flujo que scrapea cuentas de Instagram y genera un reporte detallado de competencia — likes, comentarios, posts ganadores y patrones de contenido para tomar decisiones basadas en datos.',
    tech: ['n8n', 'Scraping', 'Análisis'],
    link: '/instagram',
    symbol: '○',
  },
  {
    id: 8,
    title: 'Renovar AI',
    tag: 'Herramienta IA · Diseño',
    desc: 'Transforma espacios con IA — sube una foto de tu cuarto, sala u oficina y obtén una renovación visual en estilo minimalista o construcción. También genera videos de transición antes/después, ideal para arquitectos e ingenieros civiles.',
    tech: ['IA Generativa', 'n8n', 'Diseño'],
    link: '/renovar-ai',
    symbol: '○',
  },
  {
    id: 10,
    title: 'Comparador de Precios',
    tag: 'Automatización · n8n',
    desc: 'Workflows de scraping para Coach y On Running — escanea +500 productos, detecta disponibilidad de stock y genera un reporte detallado automatizado.',
    tech: ['n8n', 'Scraping', 'Automatización'],
    symbol: '○',
  },
]

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
      const next = prev?.id === p.id ? null : p
      pausedRef.current = next !== null

      // Apply active styles directly
      nodeRefs.current.forEach((el, i) => {
        if (!el) return
        const isActive = PROJECTS[i].id === p.id && next !== null
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
                <p className="orbit-panel-desc">{active.desc}</p>
                <div className="orbit-panel-tech">
                  {active.tech.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                {active.link && <a href={active.link} className="portfolio-link">Ver proyecto &rarr;</a>}
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
                key={p.id}
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
      </div>
    </section>
  )
}
