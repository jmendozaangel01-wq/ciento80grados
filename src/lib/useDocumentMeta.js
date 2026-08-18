import { useEffect } from 'react'

const SITE_NAME = '180 Grados'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Per-route title, description and canonical URL.
 *
 * This is a client-side SPA, so these tags land after hydration. Google renders
 * JS and will pick them up, but link-preview scrapers (WhatsApp, Slack, X) read
 * the raw HTML and only ever see the tags in index.html. Getting real preview
 * cards per project needs prerendering or SSR, which is a separate decision.
 */
export default function useDocumentMeta({ title, description, path }) {
  useEffect(() => {
    const previousTitle = document.title
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME

    document.title = fullTitle
    setMeta('property', 'og:title', fullTitle)
    setMeta('name', 'twitter:title', fullTitle)

    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
      setMeta('name', 'twitter:description', description)
    }

    if (path) {
      const url = `https://ciento80grados.com${path}`
      setCanonical(url)
      setMeta('property', 'og:url', url)
    }

    return () => { document.title = previousTitle }
  }, [title, description, path])
}
