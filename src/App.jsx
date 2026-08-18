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
import ConsentBanner from './components/ConsentBanner'
import SiteFooter from './components/SiteFooter'
import RouteScroll from './components/RouteScroll'

const InstagramPage  = lazy(() => import('./pages/InstagramPage'))
const RenovarAI      = lazy(() => import('./pages/RenovarAI'))
const GuiaHero       = lazy(() => import('./pages/GuiaHero'))
const NikeDashboard  = lazy(() => import('./pages/NikeDashboard'))
const SeñalIA        = lazy(() => import('./pages/Senalia'))
const PortfolioIndex = lazy(() => import('./pages/PortfolioIndex'))
const ProjectDetail  = lazy(() => import('./pages/ProjectDetail'))

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
      <SiteFooter />
    </>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <RouteScroll />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<PortfolioIndex />} />
          <Route path="/portfolio/:slug" element={<ProjectDetail />} />
          <Route path="/instagram" element={<InstagramPage />} />
          <Route path="/renovar-ai" element={<RenovarAI />} />
          <Route path="/guia-hero" element={<GuiaHero />} />
          <Route path="/dashboard" element={<NikeDashboard />} />
          <Route path="/senalia" element={<SeñalIA />} />
        </Routes>
      </Suspense>
      {/* Rendered outside Routes so it shows on every page. */}
      <ConsentBanner />
    </>
  )
}
