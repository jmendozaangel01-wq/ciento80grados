import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const homeLinks = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Portfolio',  href: '#portfolio'  },
  { label: 'Noticias',   href: '#noticias'   },
  { label: 'Contacto',  href: '#contacto'   },
]

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // cerrar menú al cambiar de ruta
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleAnchorClick = () => setMenuOpen(false)

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-inner">
            <Link to="/" className="nav-logo">
              180<span>°</span>
            </Link>

            {/* desktop links */}
            <ul className="nav-links">
              {homeLinks.map((l) => (
                <li key={l.href}>
                  {isHome
                    ? <a href={l.href}>{l.label}</a>
                    : <a href={`/${l.href}`}>{l.label}</a>
                  }
                </li>
              ))}
              <li>
                <Link
                  to="/instagram"
                  style={location.pathname === '/instagram' ? { color: 'var(--green)' } : {}}
                >
                  Instagram
                </Link>
              </li>
            </ul>

            <a
              href="https://wa.me/573225807488?text=Hola%20tengo%20una%20idea%20en%20mente%20y%20quiero%20cotizar"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-cta"
            >
              Cotizar ahora &rarr;
            </a>

            {/* hamburger */}
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
            >
              <span className={`ham-line${menuOpen ? ' open' : ''}`} />
              <span className={`ham-line${menuOpen ? ' open' : ''}`} />
              <span className={`ham-line${menuOpen ? ' open' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* mobile drawer */}
      <div className={`mobile-menu${menuOpen ? ' mobile-menu--open' : ''}`}>
        <ul className="mobile-menu-links">
          {homeLinks.map((l) => (
            <li key={l.href}>
              {isHome
                ? <a href={l.href} onClick={handleAnchorClick}>{l.label}</a>
                : <a href={`/${l.href}`} onClick={handleAnchorClick}>{l.label}</a>
              }
            </li>
          ))}
          <li>
            <Link
              to="/instagram"
              className="mobile-menu-highlight"
              onClick={handleAnchorClick}
            >
              Instagram
            </Link>
          </li>
        </ul>

        <a
          href="https://wa.me/573225807488?text=Hola%20tengo%20una%20idea%20en%20mente%20y%20quiero%20cotizar"
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-menu-cta"
          onClick={handleAnchorClick}
        >
          Cotizar ahora →
        </a>
      </div>

      {/* overlay */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  )
}
