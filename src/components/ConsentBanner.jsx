import { useEffect, useState } from 'react'
import { applyConsent, getStoredConsent } from '../lib/measurement'

export default function ConsentBanner() {
  const [visible, setVisible]         = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analyticsOn, setAnalyticsOn] = useState(true)
  const [adsOn, setAdsOn]             = useState(false)

  useEffect(() => {
    // Only shown to a visitor who has never chosen in this browser.
    if (getStoredConsent()) return
    const timer = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(timer)
  }, [])

  function decide(choice) {
    applyConsent(choice)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="c80-consent" role="region" aria-label="Preferencias de privacidad">
      <div className="c80-consent-card">
        <div className="c80-consent-label">Cookies</div>

        <p className="c80-consent-text">
          Usamos cookies para entender cómo navegas por <strong>180 Grados</strong> y mejorar
          el sitio. Puedes aceptarlas todas, rechazarlas, o elegir cuáles permitir.
        </p>

        {showDetails && (
          <div className="c80-consent-options">
            <label className="c80-consent-option">
              <span className="c80-consent-option-copy">
                <span className="c80-consent-option-name">Necesarias</span>
                <span className="c80-consent-option-desc">
                  Indispensables para que el sitio funcione. Siempre activas.
                </span>
              </span>
              <input type="checkbox" checked disabled className="c80-consent-check" />
            </label>

            <label className="c80-consent-option">
              <span className="c80-consent-option-copy">
                <span className="c80-consent-option-name">Analítica</span>
                <span className="c80-consent-option-desc">
                  Google Analytics. Nos muestra qué páginas visitas y cómo mejorar el sitio.
                </span>
              </span>
              <input
                type="checkbox"
                checked={analyticsOn}
                onChange={(e) => setAnalyticsOn(e.target.checked)}
                className="c80-consent-check"
              />
            </label>

            <label className="c80-consent-option">
              <span className="c80-consent-option-copy">
                <span className="c80-consent-option-name">Publicidad</span>
                <span className="c80-consent-option-desc">
                  Permite mostrarte anuncios relevantes en otras plataformas.
                </span>
              </span>
              <input
                type="checkbox"
                checked={adsOn}
                onChange={(e) => setAdsOn(e.target.checked)}
                className="c80-consent-check"
              />
            </label>
          </div>
        )}

        <div className="c80-consent-actions">
          <button
            type="button"
            className="c80-consent-toggle"
            aria-expanded={showDetails}
            onClick={() => setShowDetails((v) => !v)}
          >
            {showDetails ? 'Ocultar opciones' : 'Personalizar'}
          </button>

          <div className="c80-consent-buttons">
            <button
              type="button"
              className="btn-ghost c80-consent-btn"
              onClick={() => decide({ analytics: false, ads: false })}
            >
              Rechazar
            </button>

            {showDetails ? (
              <button
                type="button"
                className="btn-primary c80-consent-btn"
                onClick={() => decide({ analytics: analyticsOn, ads: adsOn })}
              >
                Guardar preferencias
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary c80-consent-btn"
                onClick={() => decide({ analytics: true, ads: true })}
              >
                Aceptar todas
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
