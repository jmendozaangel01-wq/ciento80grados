import { useState, useEffect, useRef } from 'react'

const CHARS = '!<>-_\\/[]{}=+*^?#@$%&~'

function scramble(text) {
  return text.split('').map(c =>
    c === ' ' || c === '\n' ? c : CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join('')
}

function useScramble(text, delay = 250) {
  const [display, setDisplay] = useState(() => scramble(text))

  useEffect(() => {
    const t = setTimeout(() => {
      let frame = 0
      const total = 55

      const tick = () => {
        frame++
        const progress = frame / total
        setDisplay(
          text.split('').map((char, i) => {
            if (char === ' ' || char === '\n') return char
            return i / text.length < progress ? char : CHARS[Math.floor(Math.random() * CHARS.length)]
          }).join('')
        )
        if (frame < total) requestAnimationFrame(tick)
        else setDisplay(text)
      }

      requestAnimationFrame(tick)
    }, delay)

    return () => clearTimeout(t)
  }, [text, delay])

  return display
}

function Counter({ end, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0)
  const ref     = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const t0 = performance.now()

          const tick = (now) => {
            const p = Math.min((now - t0) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setCount(Math.round(eased * end))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.6 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref}>
      {count}<span className="green">{suffix}</span>
    </span>
  )
}

const HEADLINE = 'Construyamos\nalgo '
const ACCENT  = 'juntos.'

export default function Hero() {
  const headline = useScramble(HEADLINE)
  const accent   = useScramble(ACCENT, 350)

  return (
    <section className="hero" id="inicio">
      <div className="container">
        <div className="hero-inner">

          <div className="hero-ticker-wrap">
            <div className="hero-ticker-track">
              {['EMPRENDEDOR', 'Amante a la tecnología', 'Apasionado por el arte', 'Desarrollador web', 'Automatizador n8n', 'Shopify Partner'].map((t, i) => (
                <span key={i} className="hero-ticker-item">{t} <span className="hero-ticker-sep">·</span></span>
              ))}
              {['EMPRENDEDOR', 'Amante a la tecnología', 'Apasionado por el arte', 'Desarrollador web', 'Automatizador n8n', 'Shopify Partner'].map((t, i) => (
                <span key={`b${i}`} className="hero-ticker-item">{t} <span className="hero-ticker-sep">·</span></span>
              ))}
            </div>
          </div>

          <h1 className="hero-headline">
            {headline}<br className="hero-br" /><span className="green">{accent}</span>
            <span className="cursor-blink" />
          </h1>

          <p className="hero-sub">
            Desarrollo web enfocado en resultados, flujos n8n que eliminan trabajo manual, y tiendas Shopify optimizadas para crecer sin rodeos, sin demoras.
          </p>

          <div className="hero-actions">
            <a href="#portfolio" className="btn-primary">Ver proyectos &rarr;</a>
            <a href="#sobre-mi" className="btn-ghost">Quién soy</a>
          </div>

          

        </div>
      </div>
    </section>
  )
}
