import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PROJECTS, CATEGORIES } from '../data/projects'
import ProjectCover from '../components/ProjectCover'
import SiteFooter from '../components/SiteFooter'
import useDocumentMeta from '../lib/useDocumentMeta'

export default function PortfolioIndex() {
  const [filter, setFilter] = useState('todos')

  useDocumentMeta({
    title: 'Portfolio',
    description: 'Proyectos de desarrollo web, e-commerce Shopify, automatización con n8n e inteligencia artificial construidos por 180 Grados.',
    path: '/portfolio',
  })

  // Only render filters that actually match something, so the bar never offers
  // a category that leads to an empty grid.
  const categories = useMemo(() => (
    CATEGORIES
      .map(c => ({
        ...c,
        count: c.key === 'todos'
          ? PROJECTS.length
          : PROJECTS.filter(p => p.category === c.key).length,
      }))
      .filter(c => c.count > 0)
  ), [])

  const visible = useMemo(() => {
    const base = filter === 'todos'
      ? PROJECTS
      : PROJECTS.filter(p => p.category === filter)

    // Los proyectos con captura van primero: una fila de placeholders al
    // entrar da peor impresión que la misma grilla con las fotos arriba.
    // Ordenar aquí en vez de reordenar el array a mano significa que un
    // proyecto sube solo en cuanto se le agrega una imagen. Sort es estable,
    // así que dentro de cada grupo se respeta el orden de projects.js.
    return [...base].sort((a, b) => Number(Boolean(b.cover)) - Number(Boolean(a.cover)))
  }, [filter])

  return (
    <>
      <div className="pf-page">
        <div className="container">

          <header className="pf-header">
            <div className="section-label">Portfolio</div>
            <h1 className="section-title">
              Lo que he construido<span className="green">.</span>
            </h1>
            <p className="pf-intro">
              Sitios web, tiendas Shopify, automatizaciones y herramientas con IA.
              Cada proyecto tiene su propia página con el detalle y el stack que usé.
            </p>
          </header>

          <div className="pf-filters" role="tablist" aria-label="Filtrar proyectos">
            {categories.map(c => (
              <button
                key={c.key}
                role="tab"
                aria-selected={filter === c.key}
                className={`pf-filter${filter === c.key ? ' pf-filter--active' : ''}`}
                onClick={() => setFilter(c.key)}
              >
                {c.label}
                <span className="pf-filter-count">{c.count}</span>
              </button>
            ))}
          </div>

          <div className="pf-grid">
            {visible.map((p, i) => (
              <Link key={p.slug} to={`/portfolio/${p.slug}`} className="pf-card">
                {/* The first row is above the fold, so those images load eagerly
                    to avoid handing the LCP to a lazy-loaded asset. */}
                <ProjectCover project={p} eager={i < 3} />
                <div className="pf-card-body">
                  <div className="pf-card-tag">{p.tag}</div>
                  <h2 className="pf-card-title">{p.title}</h2>
                  <p className="pf-card-desc">{p.desc}</p>
                  <div className="pf-card-tech">
                    {p.tech.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <span className="pf-card-cta">Ver proyecto &rarr;</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="pf-page-foot">
            <a
              href="/180Grados_Servicios.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-pdf-btn"
            >
              Ver servicios y tarifas
            </a>
            <Link to="/#contacto" className="pf-page-foot-link">
              &iquest;Tienes un proyecto en mente? Hablemos &rarr;
            </Link>
          </div>

        </div>
      </div>

      <SiteFooter />
    </>
  )
}
