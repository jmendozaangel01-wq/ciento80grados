import { useEffect, useRef } from 'react'

const SERVICES = [
  {
    num:   '01',
    icon:  '▲',
    title: 'Desarrollo Web',
    desc:  'Sitios institucionales, landing pages y plataformas web. Rápidos, bien construidos y orientados a conversión. Sin plantillas genéricas.',
    tags:  ['HTML / CSS', 'React', 'Shopify', 'SEO'],
  },
  {
    num:   '02',
    icon:  '■',
    title: 'Automatización n8n',
    desc:  'Flujos de trabajo que conectan tus herramientas, procesan datos y ejecutan tareas automáticamente. Tu negocio trabajando mientras tú no lo haces.',
    tags:  ['n8n', 'Webhooks', 'APIs', 'Bots'],
  },
  {
    num:   '03',
    icon:  '●',
    title: 'E-commerce Shopify',
    desc:  'Tiendas completas desde cero — configuración, diseño, apps y optimización para vender más. Shopify hecho como debe ser.',
    tags:  ['Shopify', 'Liquid', 'Apps', 'Conversión'],
  },
]

export default function Services() {
  const gridRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )

    if (gridRef.current) {
      gridRef.current.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.1}s`
        observer.observe(el)
      })
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section className="services" id="servicios">
      <div className="container">
        <div className="section-label">Servicios</div>
        <h2 className="section-title">Lo que construyo</h2>

        <div className="services-grid" ref={gridRef}>
          {SERVICES.map((s) => (
            <div key={s.num} className="service-card reveal">
              <div className="service-num">{s.num}</div>
              <span className="service-icon">{s.icon}</span>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
              <div className="service-tags">
                {s.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
