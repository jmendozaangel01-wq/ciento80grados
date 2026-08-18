import { useState, useEffect, useRef } from 'react'
import { SOCIAL_NAV } from '../data/social'
import SocialIcon from './SocialIcon'

const CHARS = '!<>-_\\/[]{}=+*^?#@$%&~'

function scramble(text) {
  return text.split('').map(c =>
    c === ' ' || c === '\n' ? c : CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join('')
}

const SCRAMBLE_PLAYED_KEY = 'hero_scramble_played'

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useScramble(text, delay = 120) {
  const alreadyPlayed =
    localStorage.getItem(SCRAMBLE_PLAYED_KEY) === 'true' || prefersReducedMotion()
  const [display, setDisplay] = useState(() => alreadyPlayed ? text : scramble(text))

  useEffect(() => {
    if (alreadyPlayed) return

    const t = setTimeout(() => {
      let frame = 0
      const total = 28

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
        else {
          setDisplay(text)
          localStorage.setItem(SCRAMBLE_PLAYED_KEY, 'true')
        }
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

// While scrambling, every glyph is rendered in a fixed-width cell. The random
// glyphs are wider than the real letters, so without this the headline width
// changed on every frame and dragged the trailing caret with it.
const NEWLINE = String.fromCharCode(10)
const NBSP = String.fromCharCode(160)

function ScrambleText({ text, value }) {
  if (value === text) return value
  // Each cell is sized by the *final* character (rendered invisibly) while the
  // random glyph is overlaid on top. The animating headline therefore occupies
  // exactly the same box as the settled one, so it cannot shift layout.
  return text.split("").map((real, i) => {
    if (real === NEWLINE) return <br key={i} />
    const ch = value[i]
    return (
      <span className="hero-char" key={i}>
        <span className="hero-char-slot">{real === " " ? NBSP : real}</span>
        <span className="hero-char-live">{ch === " " ? NBSP : ch}</span>
      </span>
    )
  })
}

const HEADLINE = 'Construyamos\nalgo '
const ACCENT  = 'juntos.'

export default function Hero() {
  const headline = useScramble(HEADLINE)
  const accent   = useScramble(ACCENT, 200)

  return (
    <section className="hero" id="inicio">
      <div className="container">
        <div className="hero-inner">


          <h1 className="hero-headline">
            {/* Reserves the final height so the scramble cannot shift layout. */}
            <span className="hero-headline-ghost" aria-hidden="true">
              {HEADLINE}<br className="hero-br" />{ACCENT}
            </span>
            <span className="hero-headline-live">
              <ScrambleText text={HEADLINE} value={headline} />
              <br className="hero-br" />
              <span className="green"><ScrambleText text={ACCENT} value={accent} /></span>
              <span className="cursor-blink" />
            </span>
          </h1>

          <p className="hero-sub">
            Desarrollo web enfocado en resultados, flujos n8n que eliminan trabajo manual, y tiendas Shopify optimizadas para crecer sin rodeos, sin demoras.
          </p>

          {/* Alto fijo por CSS: el hero es el elemento LCP y cualquier bloque
              que crezca después de pintar vuelve a mover el CLS. */}
          <div className="hero-social">
            {SOCIAL_NAV.map(red => (
              <a
                key={red.key}
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
                aria-label={`${red.label} de 180 Grados`}
                title={`${red.label} · ${red.handle}`}
              >
                <SocialIcon name={red.key} size={19} />
              </a>
            ))}
          </div>

          <div className="hero-actions">
            <a href="#portfolio" className="btn-primary">Ver proyectos &rarr;</a>
            <a href="#sobre-mi" className="btn-ghost">Quién soy</a>
          </div>


          
        </div>

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
      </div>
    </section>
  )
}
