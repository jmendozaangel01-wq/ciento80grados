import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router keeps the scroll position across navigations, so moving from the
 * portfolio index to a project detail used to land mid-page.
 *
 * NAMING: this file cannot be called ScrollToTop.jsx. Content blockers match
 * that exact string in a request path and drop it, which kills the whole module
 * graph in `npm run dev` and leaves a blank page with no console error. The
 * production build is unaffected because names vanish into hashed chunks, so
 * the failure only ever shows up locally. Verified byte-for-byte: the identical
 * file served as ScrollToTopA.jsx returns 200 while ScrollToTop.jsx is blocked.
 *
 * Three cases, in order:
 *   1. A hash target scrolls to that element. Plain anchors only do this on the
 *      page that owns them, so cross-page links like /#contacto need it here.
 *   2. Any route other than home starts at the top.
 *   3. Home is left alone, because it restores its own saved scroll position
 *      from localStorage and the two would fight each other.
 */
export default function RouteScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // The target may not be mounted on the first paint after a route change.
      const id = hash.slice(1)
      const raf = requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      })
      return () => cancelAnimationFrame(raf)
    }

    if (pathname !== '/') window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
