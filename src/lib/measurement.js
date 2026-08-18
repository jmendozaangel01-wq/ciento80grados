// Google Analytics 4 with Consent Mode v2.
//
// gtag.js is loaded on every visit, but every storage signal starts denied and
// only flips once the visitor makes a choice in the cookie banner.

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
const CONSENT_STORAGE_KEY = '180grados_cookie_consent'

// Ships as the documented placeholder until a real property exists, so treat it
// as "not configured" rather than firing hits at an id that does not resolve.
const PLACEHOLDER_ID = 'G-XXXXXXXXXX'

let initialised = false

/**
 * Pushes the `arguments` object itself, never an array.
 *
 * gtag.js walks dataLayer and only recognises entries that are arguments
 * objects as commands. A real array (what rest parameters produce) is read as a
 * different kind of entry and dropped without any error, so GA4 would load,
 * stay silent, and record nothing.
 */
function gtag() {
  window.dataLayer = window.dataLayer || []
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments)
}

function isConfigured() {
  return Boolean(GA_MEASUREMENT_ID) && GA_MEASUREMENT_ID !== PLACEHOLDER_ID
}

/** Returns the stored decision, or null when the visitor has never chosen. */
export function getStoredConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Call once, as early as possible, before the app renders. The consent defaults
 * have to sit in dataLayer before gtag.js runs, otherwise the first hits leave
 * before Consent Mode is defined.
 */
export function initAnalytics() {
  if (initialised) return
  if (!isConfigured()) {
    console.warn('[analytics] VITE_GA_MEASUREMENT_ID no configurado — GA4 no se carga.')
    return
  }
  initialised = true

  window.dataLayer = window.dataLayer || []

  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  })

  const saved = getStoredConsent()

  // Replay a previous decision, but without emitting a page_view: `config`
  // below has not run yet, so an event here would have no configured target,
  // and config sends the initial view itself when consent allows it.
  if (saved) applyConsent(saved, { sendPageView: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: Boolean(saved?.analytics),
  })
}

/**
 * Pushes the decision to Consent Mode and stores it so the banner stays hidden
 * on the next visit.
 *
 * @param {{ analytics: boolean, ads: boolean }} choice
 * @param {{ sendPageView?: boolean }} [options]
 */
export function applyConsent(choice, { sendPageView = true } = {}) {
  gtag('consent', 'update', {
    analytics_storage: choice.analytics ? 'granted' : 'denied',
    ad_storage: choice.ads ? 'granted' : 'denied',
    ad_user_data: choice.ads ? 'granted' : 'denied',
    ad_personalization: choice.ads ? 'granted' : 'denied',
  })

  try {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ ...choice, timestamp: Date.now() }),
    )
  } catch {
    // Private mode or a full quota: the choice still holds for this session.
  }

  // The initial `config` ran with send_page_view false for a visitor who had
  // not chosen yet, so without this their first view would never be recorded.
  if (sendPageView && choice.analytics && isConfigured()) {
    gtag('event', 'page_view')
  }
}

/**
 * Sends a custom GA4 event, e.g.
 * trackEvent('purchase', { value: 49900, currency: 'COP' })
 */
export function trackEvent(eventName, params = {}) {
  gtag('event', eventName, params)
}
