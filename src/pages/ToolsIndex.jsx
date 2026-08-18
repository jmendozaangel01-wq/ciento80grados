import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { TOOLS, KINDS, hasOwnPage } from '../data/tools'
import SiteFooter from '../components/SiteFooter'
import useDocumentMeta from '../lib/useDocumentMeta'

export default function ToolsIndex() {
  const [filter, setFilter] = useState('todos')

  useDocumentMeta({
    title: 'Herramientas IA',
    description: 'Herramientas, guías y prompts de IA para usar gratis: performance web, SEO, automatización y contenido.',
    path: '/herramientas',
  })

  // Solo se muestran los filtros que tienen algo detrás, para que ninguno
  // lleve a una grilla vacía.
  const kinds = useMemo(() => (
    KINDS
      .map(k => ({
        ...k,
        count: k.key === 'todos' ? TOOLS.length : TOOLS.filter(t => t.kind === k.key).length,
      }))
      .filter(k => k.count > 0)
  ), [])

  const visible = useMemo(() => (
    filter === 'todos' ? TOOLS : TOOLS.filter(t => t.kind === filter)
  ), [filter])

  return (
    <>
      <div className="pf-page">
        <div className="container">

          <header className="pf-header">
            <div className="section-label">Herramientas IA</div>
            <h1 className="section-title">
              Llévatelo y úsalo<span className="green">.</span>
            </h1>
            <p className="pf-intro">
              Todo lo que construyo y que te puede servir: herramientas para usar ahora,
              guías con los prompts que uso de verdad, y archivos para descargar.
              Gratis, sin registro.
            </p>
          </header>

          <div className="pf-filters" role="tablist" aria-label="Filtrar herramientas">
            {kinds.map(k => (
              <button
                key={k.key}
                role="tab"
                aria-selected={filter === k.key}
                className={`pf-filter${filter === k.key ? ' pf-filter--active' : ''}`}
                onClick={() => setFilter(k.key)}
              >
                {k.label}
                <span className="pf-filter-count">{k.count}</span>
              </button>
            ))}
          </div>

          <div className="tool-grid">
            {visible.map(t => {
              const externa = hasOwnPage(t)
              const destino = externa ? t.href : `/herramientas/${t.slug}`
              return (
                <Link key={t.slug} to={destino} className="tool-card">
                  <div className={`tool-card-kind tool-card-kind--${t.kind}`}>{t.tag}</div>
                  <h2 className="tool-card-title">{t.title}</h2>
                  <p className="tool-card-desc">{t.desc}</p>
                  <span className="tool-card-cta">
                    {t.kind === 'herramienta' ? 'Abrir' : t.kind === 'skill' ? 'Descargar' : 'Ver la guía'} &rarr;
                  </span>
                </Link>
              )
            })}
          </div>

        </div>
      </div>

      <SiteFooter />
    </>
  )
}
