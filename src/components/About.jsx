import { useEffect, useRef } from 'react'
import fotoJairo from './fotojairo.jpeg'

const STACK = [
  { label: 'Frontend', items: ['HTML / CSS', 'React', 'JavaScript'] },
  { label: 'Automatización', items: ['n8n', 'Webhooks', 'APIs REST'] },
  { label: 'E-commerce', items: ['Shopify', 'Liquid', 'Apps'] },
]

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.08 }
    )
    if (sectionRef.current) {
      sectionRef.current.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.12}s`
        observer.observe(el)
      })
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section className="about" id="sobre-mi" ref={sectionRef}>
      <div className="container">
        <div className="about-inner">

          {/* ── Visual ── */}
          <div className="about-visual reveal">
            <div className="about-photo-frame">
              {/* Reemplaza el div de abajo con: <img src="/tu-foto.jpg" alt="Jairo Mendoza" /> */}
              <img src={fotoJairo} alt="Jairo Mendoza" />
              <div className="hero-badge">
                <div className="hero-badge-status">&#9679; Disponible</div>
               
              </div>
            </div>
          </div>

          {/* ── Text ── */}
          <div className="about-text">
            <div className="section-label reveal">Sobre mí</div>
            <h2 className="section-title reveal">
              Quién soy<span className="green">.</span>
            </h2>

            <p className="about-bio reveal">
              Mi nombre es <strong>Jairo Mendoza</strong>, Ingeniero Industrial y constructor digital con base en
              Colombia. Trabajo bajo el nombre <strong>180 Grados</strong> —
              porque mi enfoque es darle la vuelta a los problemas y encontrar la solución
              desde otro ángulo.
            </p>
            <p className="about-bio reveal">
              Hoy construyo productos digitales usando una mezcla de vibecoding, inteligencia artificial y herramientas modernas como Claude Code, lo que me permite materializar ideas rápidamente y convertirlas en soluciones reales: desde plataformas web hasta automatizaciones complejas.
            </p>
            <p className="about-bio reveal">Me especializo en tres áreas:</p>
            <ul className="about-specialties reveal">
              <li>Construcción de sitios y plataformas web diseñadas para convertir, no solo para verse bien.</li>
              <li>Automatización de procesos con n8n, para que los negocios puedan escalar sin aumentar su carga operativa ni contratar más personal.</li>
              <li>Gestión, optimización y desarrollo de tiendas Shopify que realmente venden.</li>
            </ul>
            <p className="about-bio about-goal reveal">
              Mi objetivo es ayudar a negocios y creadores a pasar de la idea a la ejecución, construyendo sistemas digitales que trabajen por ellos.
            </p>

            <div className="about-stack reveal">
              {STACK.map(group => (
                <div key={group.label} className="about-stack-group">
                  <div className="about-stack-label">{group.label}</div>
                  <div className="about-stack-items">
                    {group.items.map(item => (
                      <span key={item} className="tag">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
