import { useParams, Link } from 'react-router-dom'
import { getTool, hasOwnPage } from '../data/tools'
import CopyButton from '../components/CopyButton'
import SiteFooter from '../components/SiteFooter'
import useDocumentMeta from '../lib/useDocumentMeta'

/** Un bloque copiable: prompt o código. Comparten caja y botón. */
function BloqueCopiable({ block }) {
  return (
    <section className="tool-block">
      {block.title && <h2 className="tool-block-title">{block.title}</h2>}
      {block.body && <p className="tool-block-text">{block.body}</p>}
      <div className="tool-code">
        <div className="tool-code-bar">
          <span className="tool-code-lang">{block.lang || 'prompt'}</span>
          <CopyButton text={block.code} />
        </div>
        <pre className="tool-code-body"><code>{block.code}</code></pre>
      </div>
    </section>
  )
}

function Bloque({ block }) {
  switch (block.type) {
    case 'texto':
      return <p className="tool-block-text tool-block-text--suelto">{block.body}</p>

    case 'paso':
      return (
        <section className="tool-block">
          <h2 className="tool-block-title">{block.title}</h2>
          <p className="tool-block-text">{block.body}</p>
        </section>
      )

    case 'aviso':
      return (
        <aside className="tool-aviso">
          <h2 className="tool-aviso-title">{block.title}</h2>
          <p className="tool-aviso-text">{block.body}</p>
        </aside>
      )

    case 'prompt':
    case 'codigo':
      return <BloqueCopiable block={block} />

    default:
      // Un tipo desconocido no debe romper la página entera.
      return null
  }
}

function NoEncontrada() {
  return (
    <>
      <div className="pf-page pf-page--narrow">
        <div className="container">
          <h1 className="section-title">Eso no existe<span className="green">.</span></h1>
          <p className="pf-intro">El enlace puede estar mal escrito o la guía cambió de nombre.</p>
          <Link to="/herramientas" className="btn-primary">Ver todas las herramientas</Link>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}

export default function ToolDetail() {
  const { slug } = useParams()
  const tool = getTool(slug)

  // Los hooks corren siempre, así que la rama de "no existe" también pasa por acá.
  useDocumentMeta({
    title: tool ? tool.title : 'No encontrado',
    description: tool?.desc,
    path: tool ? `/herramientas/${tool.slug}` : '/herramientas',
  })

  // Una entrada con página propia no genera detalle: su tarjeta ya enlaza allá.
  // Si alguien llega igual por URL directa, se le muestra el 404 en vez de una
  // página vacía sin contenido.
  if (!tool || hasOwnPage(tool)) return <NoEncontrada />

  return (
    <>
      <div className="pf-page tool-page">
        <div className="container">

          <Link to="/herramientas" className="pf-back">&larr; Volver a herramientas</Link>

          <header className="tool-header">
            <div className={`tool-card-kind tool-card-kind--${tool.kind}`}>{tool.tag}</div>
            <h1 className="tool-title">{tool.title}</h1>
            <p className="tool-lead">{tool.desc}</p>

            {tool.file && (
              <a className="btn-primary tool-download" href={tool.file} download>
                Descargar archivo &darr;
              </a>
            )}
          </header>

          <div className="tool-body">
            {tool.blocks.map((b, i) => <Bloque key={i} block={b} />)}
          </div>

          <div className="tool-cierre">
            <p className="tool-cierre-text">
              Si esto te sirvió, subo una de estas por semana.
            </p>
            <div className="tool-cierre-links">
              <a
                href="https://www.tiktok.com/@jairothebuilder"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Sígueme en TikTok
              </a>
              <Link to="/herramientas" className="pf-page-foot-link">
                Ver el resto de las herramientas &rarr;
              </Link>
            </div>
          </div>

        </div>
      </div>

      <SiteFooter />
    </>
  )
}
