import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const homeLinks = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Portfolio',  href: '#portfolio'  },
  { label: 'Noticias',   href: '#noticias'   },
  { label: 'Contacto',  href: '#contacto'   },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="nav-logo">
            180<span>°</span>
          </Link>

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
                style={location.pathname === '/instagram'
                  ? { color: 'var(--green)' }
                  : {}
                }
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
        </div>
      </div>
    </nav>
  )
}
