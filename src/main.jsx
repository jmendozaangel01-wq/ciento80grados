import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { initAnalytics } from './lib/measurement'

const loadTime = Date.now()
window.__APP_LOAD_TIME = loadTime
console.log('[App] Cargado a:', new Date(loadTime).toLocaleTimeString())

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    sessionStorage.setItem('last_hidden', Date.now())
  }
  if (document.visibilityState === 'visible') {
    const hidden = sessionStorage.getItem('last_hidden')
    if (hidden) {
      const elapsed = (Date.now() - Number(hidden)) / 1000
      console.log(`[App] Volvió del background tras ${elapsed.toFixed(0)}s`)
    }
  }
})

// Consent Mode defaults have to reach dataLayer before anything renders.
initAnalytics()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
