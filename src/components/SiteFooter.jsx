import { Link } from 'react-router-dom'

/**
 * Shared site footer. The same markup was copy-pasted across App.jsx and every
 * page, which meant a link change had to be made in five files. It lives here
 * now so there is one place to edit.
 */
export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-copy">&copy; 2026 creado por 180&deg;</div>
          <div className="footer-right">
            <Link to="/#servicios" className="footer-link">Servicios</Link>
            <Link to="/portfolio" className="footer-link">Portfolio</Link>
            <Link to="/#noticias" className="footer-link">Noticias</Link>
            <Link to="/#contacto" className="footer-link">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
