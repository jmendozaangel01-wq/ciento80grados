import { useState } from 'react'
import SearchBox from './SearchBox'
import StockHero from './StockHero'
import StockChart from './StockChart'
import ScoreTabs from './ScoreTabs'
import StrategyCards from './StrategyCards'

const WEBHOOK_URL = 'https://n8n.srv1587395.hstgr.cloud/webhook/senalia-analyze'

export default function SeñalIA() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [lastTicker, setLastTicker] = useState(null)

  async function handleSearch(ticker) {
    setLoading(true)
    setError(null)
    setResult(null)
    setLastTicker(ticker)
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (!data.success) throw new Error('El análisis no retornó éxito')
      setResult(data)
    } catch (err) {
      setError(err.message || 'Error desconocido al consultar el análisis.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 'calc(var(--nav-h) + 48px)', paddingBottom: '80px' }}>
      <div className="container">

        {!result && !loading && (
          <div className="fade-in" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Herramientas IA</div>
            <h1 className="section-title" style={{ marginBottom: '16px' }}>
              Señal<span style={{ color: 'var(--green)' }}>IA</span>
            </h1>
            <p style={{ color: 'var(--muted)', maxWidth: '480px', margin: '0 auto 40px', fontSize: '1rem', lineHeight: 1.75, fontWeight: 300 }}>
              Score fundamental, técnico y de sentimiento. Estrategias listas para operar en el S&P 500.
            </p>
            <SearchBox onSearch={handleSearch} loading={loading} />
          </div>
        )}

        {(result || loading) && (
          <div style={{ marginBottom: '24px' }} className="fade-in">
            <SearchBox onSearch={handleSearch} loading={loading} />
          </div>
        )}

        {loading && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '16px' }}>
            <div className="sa-spinner" />
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Analizando {lastTicker}…</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.75rem', opacity: 0.6 }}>Consultando datos de mercado e IA</p>
          </div>
        )}

        {error && !loading && (
          <div className="fade-in" style={{ padding: '20px', borderRadius: '4px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ef4444' }}>No se pudo completar el análisis</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>{error}</p>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <StockHero stockData={result.stockData} />
            <StockChart ticker={result.ticker} />
            <ScoreTabs analysis={result.analysis} stockData={result.stockData} />
            <StrategyCards estrategias={result.analysis.estrategias} />

            {result.generatedAt && (
              <p style={{ fontSize: '0.72rem', color: 'var(--muted)', textAlign: 'center', opacity: 0.6 }}>
                Análisis generado el{' '}
                {new Date(result.generatedAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            )}

            <div style={{ padding: '16px', borderRadius: '4px', background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: '0.75rem', lineHeight: 1.75, color: 'var(--muted)' }}>
              <strong style={{ color: 'var(--text)', opacity: 0.7 }}>Disclaimer:</strong> SeñalIA es una herramienta informativa con fines educativos. No constituye asesoramiento financiero ni recomendación de compra o venta. Invertir en mercados financieros implica riesgo de pérdida de capital. Consulta un asesor financiero certificado antes de tomar decisiones de inversión.
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
