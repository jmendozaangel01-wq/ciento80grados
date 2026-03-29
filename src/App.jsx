import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import YouTube from './components/YouTube'
import NewsFeed from './components/NewsFeed'
import Contact from './components/Contact'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <YouTube />
        <Services />
        <Portfolio />
        <NewsFeed />
        <Contact />
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-copy">
              &copy; 2026 creado por 180°
            </div>
            <div className="footer-right">
              <a href="#servicios" className="footer-link">Servicios</a>
              <a href="#portfolio" className="footer-link">Portfolio</a>
              <a href="#noticias" className="footer-link">Noticias</a>
              <a href="#contacto" className="footer-link">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
