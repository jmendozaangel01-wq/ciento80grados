import { useState, useEffect, useRef } from 'react'
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
  const [aiOpen,     setAiOpen]     = useState(false)
  const [mobileAiOpen, setMobileAiOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isAiRoute = ['/instagram', '/renovar-ai'].includes(location.pathname)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // cerrar menús al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false)
    setAiOpen(false)
    setMobileAiOpen(false)
  }, [location.pathname])

  // cerrar dropdown desktop al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAiOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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
              <li className="nav-dropdown" ref={dropdownRef}>
                <button
                  className={`nav-dropdown-trigger${isAiRoute ? ' active' : ''}`}
                  onClick={() => setAiOpen(o => !o)}
                  aria-expanded={aiOpen}
                >
                  Herramientas IA
                  <svg className={`nav-dropdown-arrow${aiOpen ? ' open' : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {aiOpen && (
                  <ul className="nav-dropdown-menu">
                    <li>
                      <Link
                        to="/instagram"
                        style={location.pathname === '/instagram' ? { color: 'var(--green)' } : {}}
                      >
                        Instagram
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/renovar-ai"
                        style={location.pathname === '/renovar-ai' ? { color: 'var(--green)' } : {}}
                      >
                        Renovar AI
                      </Link>
                    </li>
                  </ul>
                )}
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
            <button
              className={`mobile-ai-toggle${isAiRoute ? ' active' : ''}`}
              onClick={() => setMobileAiOpen(o => !o)}
            >
              Herramientas IA
              <svg className={`nav-dropdown-arrow${mobileAiOpen ? ' open' : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {mobileAiOpen && (
              <ul className="mobile-ai-submenu">
                <li>
                  <Link
                    to="/instagram"
                    className={location.pathname === '/instagram' ? 'mobile-menu-highlight' : ''}
                    onClick={handleAnchorClick}
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    to="/renovar-ai"
                    className={location.pathname === '/renovar-ai' ? 'mobile-menu-highlight' : ''}
                    onClick={handleAnchorClick}
                  >
                    Renovar AI
                  </Link>
                </li>
              </ul>
            )}
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
