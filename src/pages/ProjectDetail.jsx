import { useParams, Link } from 'react-router-dom'
import { PROJECTS, getProject, isExternal } from '../data/projects'
import ProjectGallery from '../components/ProjectGallery'
import SiteFooter from '../components/SiteFooter'
import useDocumentMeta from '../lib/useDocumentMeta'

/** Renders the live-project button as a router Link or a plain anchor. */
function LiveLink({ link, children }) {
  if (!link) return null
  return isExternal(link)
    ? <a href={link} target="_blank" rel="noopener noreferrer" className="btn-primary">{children}</a>
    : <Link to={link} className="btn-primary">{children}</Link>
}

function NotFound() {
  // No useDocumentMeta call here on purpose. Child effects run before the
  // parent's, so anything set here would be overwritten a moment later by
  // ProjectDetail's own hook. The parent owns the title for both branches.
  return (
    <>
      <div className="pf-page pf-page--narrow">
        <div className="container">
          <h1 className="section-title">Ese proyecto no existe<span className="green">.</span></h1>
          <p className="pf-intro">
            El enlace puede estar mal escrito o el proyecto pudo haber cambiado de nombre.
          </p>
          <Link to="/portfolio" className="btn-primary">Ver todo el portfolio</Link>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProject(slug)

  // Hooks must run unconditionally, so this covers the missing-project branch
  // too rather than letting NotFound set its own title.
  useDocumentMeta({
    title: project ? project.title : 'Proyecto no encontrado',
    description: project?.desc,
    path: project ? `/portfolio/${project.slug}` : '/portfolio',
  })

  if (!project) return <NotFound />

  const index = PROJECTS.findIndex(p => p.slug === project.slug)
  const prev  = PROJECTS[index - 1]
  const next  = PROJECTS[index + 1]
  const body  = project.detail || project.desc

  return (
    <>
      <div className="pf-page pf-detail">
        <div className="container">

          <Link to="/portfolio" className="pf-back">&larr; Volver al portfolio</Link>

          <ProjectGallery project={project} />

          <div className="pf-detail-layout">

            <div className="pf-detail-main">
              <div className="pf-card-tag">{project.tag}</div>
              <h1 className="pf-detail-title">{project.title}</h1>

              {project.problem && (
                <section className="pf-block">
                  <h2 className="pf-block-title">El problema</h2>
                  <p className="pf-block-text">{project.problem}</p>
                </section>
              )}

              <section className="pf-block">
                <h2 className="pf-block-title">Qué construí</h2>
                <p className="pf-block-text">{body}</p>
              </section>

              {project.result && (
                <section className="pf-block">
                  <h2 className="pf-block-title">Resultado</h2>
                  <p className="pf-block-text">{project.result}</p>
                </section>
              )}

              {/* The gallery images are not stacked here any more. They are
                  paged through in the viewer at the top of the page, so
                  repeating them would show the same photos twice. */}
            </div>

            <aside className="pf-detail-aside">
              <dl className="pf-facts">
                <dt>Año</dt><dd>{project.year}</dd>
                <dt>Rol</dt><dd>{project.role}</dd>
              </dl>

              <div className="pf-facts-tech">
                <span className="pf-facts-label">Stack</span>
                <div className="pf-card-tech">
                  {project.tech.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>

              <LiveLink link={project.link}>Ver proyecto en vivo &rarr;</LiveLink>
              {!project.link && (
                <p className="pf-facts-note">
                  Proyecto interno de cliente, sin demo pública.
                </p>
              )}
            </aside>

          </div>

          <nav className="pf-prevnext">
            {prev
              ? <Link to={`/portfolio/${prev.slug}`} className="pf-prevnext-link">&larr; {prev.title}</Link>
              : <span />}
            {next
              ? <Link to={`/portfolio/${next.slug}`} className="pf-prevnext-link pf-prevnext-link--next">{next.title} &rarr;</Link>
              : <span />}
          </nav>

        </div>
      </div>

      <SiteFooter />
    </>
  )
}
