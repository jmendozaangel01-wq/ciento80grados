import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import YouTube from './components/YouTube'
import NewsFeed from './components/NewsFeed'
import Contact from './components/Contact'

const InstagramPage = lazy(() => import('./pages/InstagramPage'))
const RenovarAI     = lazy(() => import('./pages/RenovarAI'))

function Home() {
  useEffect(() => {
    const saved = localStorage.getItem('scroll_y')
    if (saved) window.scrollTo(0, parseInt(saved, 10))

    let timer
    const onScroll = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        localStorage.setItem('scroll_y', window.scrollY)
      }, 300)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <NewsFeed />
        <YouTube />
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

export default function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/instagram" element={<InstagramPage />} />
          <Route path="/renovar-ai" element={<RenovarAI />} />
        </Routes>
      </Suspense>
    </>
  )
}
