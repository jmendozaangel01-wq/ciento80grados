import { useState, useEffect, useRef } from 'react'

/**
 * Copy-to-clipboard button with a short confirmation state.
 *
 * Extracted from GuiaHero, where it lived as a local component with inline
 * styles. The tool pages needed the same behaviour, and a second copy would
 * have meant fixing every bug twice.
 */
export default function CopyButton({ text, label = 'Copiar' }) {
  const [state, setState] = useState('idle')
  const timer = useRef(null)

  // Without this, unmounting mid-countdown leaves a timer that fires against a
  // component that no longer exists.
  useEffect(() => () => clearTimeout(timer.current), [])

  /**
   * Fallback for when the async Clipboard API is unavailable: it needs a
   * secure context and a focused document, so it fails on http:// origins and
   * whenever the window has lost OS focus. The old execCommand path has neither
   * requirement, which is exactly when it earns its keep.
   */
  const copiarViejaEscuela = value => {
    const ta = document.createElement('textarea')
    ta.value = value
    // Off-screen instead of display:none — a hidden element cannot be selected.
    ta.setAttribute('readonly', '')
    ta.style.cssText = 'position:fixed;top:-9999px;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try { ok = document.execCommand('copy') } catch { ok = false }
    document.body.removeChild(ta)
    return ok
  }

  const handleCopy = async () => {
    clearTimeout(timer.current)
    let ok = false

    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      ok = copiarViejaEscuela(text)
    }

    // Telling the visitor it failed beats a button that silently does nothing:
    // this page exists so people can take the prompt with them.
    setState(ok ? 'copied' : 'error')
    timer.current = setTimeout(() => setState('idle'), 2000)
  }

  const texto = state === 'copied' ? 'Copiado' : state === 'error' ? 'No se pudo' : label

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`copy-btn copy-btn--${state}`}
      aria-live="polite"
    >
      {state === 'copied' ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      {texto}
    </button>
  )
}
