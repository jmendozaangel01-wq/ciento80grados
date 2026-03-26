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
              Me especializo en tres cosas: construir sitios y plataformas web funcionales y que convierten,
              automatizar procesos con n8n para que los negocios escalen sin contratar más personal,
              administro, edito, monto y optimizo tiendas Shopify que venden de verdad.
            </p>
            <p className="about-bio reveal">
              Cada proyecto empieza desde cero, con intención,
              y termina cuando funciona como tiene que funcionar.
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
