import { useState } from 'react'

const TABS = [
  { id: 'global',      label: 'Global',      icon: '◎'  },
  { id: 'fundamental', label: 'Fundamental',  icon: '📊' },
  { id: 'tecnico',     label: 'Técnico',      icon: '📈' },
  { id: 'sentimiento', label: 'Sentimiento',  icon: '🧠' },
]

const isNA = v => !v || v === 'N/A' || v === '$N/A'

function scoreColor(score) {
  if (score >= 7) return { text: 'var(--green)',  bg: 'var(--green-dim)',           border: 'rgba(0,230,118,0.35)' }
  if (score >= 4) return { text: '#f59e0b',       bg: 'rgba(245,158,11,0.08)',      border: 'rgba(245,158,11,0.35)' }
  return             { text: '#ef4444',        bg: 'rgba(239,68,68,0.08)',       border: 'rgba(239,68,68,0.35)' }
}

function ScoreCircle({ score, grey = false }) {
  const { text, bg, border } = grey
    ? { text: 'var(--muted)', bg: 'rgba(136,136,136,0.08)', border: 'rgba(136,136,136,0.35)' }
    : scoreColor(score)
  return (
    <div style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, flexShrink: 0, color: text, background: bg, border: `2px solid ${border}`, fontFamily: 'var(--font-display)' }}>
      {score}
    </div>
  )
}

function FactorItem({ factor }) {
  const isPositive = factor.positivo !== false
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', borderRadius: '4px', background: 'var(--bg-card-alt)', border: '1px solid var(--border)' }}>
      <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }}>{factor.icono}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>{factor.nombre}</span>
          {factor.valor && factor.valor !== 'N/A' && (
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '20px', fontWeight: 500, fontFamily: 'var(--font-display)', background: isPositive ? 'var(--green-dim)' : 'rgba(239,68,68,0.1)', color: isPositive ? 'var(--green)' : '#ef4444', border: `1px solid ${isPositive ? 'rgba(0,230,118,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
              {factor.valor}
            </span>
          )}
        </div>
        {factor.desc && <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.7 }}>{factor.desc}</p>}
      </div>
    </div>
  )
}

function NewsItem({ noticia }) {
  return (
    <div style={{ padding: '12px', borderRadius: '4px', background: 'var(--bg-card-alt)', border: '1px solid var(--border)' }}>
      <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.55 }}>{noticia.titulo}</p>
      {noticia.meta && <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>{noticia.meta}</p>}
    </div>
  )
}

function MetricGrid({ stockData }) {
  const analystTarget = stockData.analystTarget ? `$${stockData.analystTarget}` : 'N/A'
  const all = [
    { label: 'Precio',          value: stockData.price     ? `$${stockData.price}`                    : 'N/A' },
    { label: 'P/E Ratio',       value: stockData.pe        || 'N/A' },
    { label: 'EPS',             value: stockData.eps       || 'N/A' },
    { label: 'ROE',             value: stockData.roe       || 'N/A' },
    { label: 'Market Cap',      value: stockData.marketCap || 'N/A' },
    { label: 'Volumen',         value: stockData.volume    ? Number(stockData.volume).toLocaleString() : 'N/A' },
    { label: 'Máx 52s',         value: stockData.high52    ? `$${stockData.high52}`                   : 'N/A' },
    { label: 'Mín 52s',         value: stockData.low52     ? `$${stockData.low52}`                    : 'N/A' },
    { label: 'Deuda/Eq.',       value: stockData.deuda     || 'N/A' },
    { label: 'Analistas',       value: stockData.analistas ? `${stockData.analistas}% alcista`         : 'N/A' },
    { label: 'Target',          value: isNA(analystTarget) ? 'N/A' : analystTarget },
    { label: 'RSI',             value: stockData.rsi       || 'N/A' },
  ]
  const metrics = all.filter(m => !isNA(m.value))
  if (!metrics.length) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
      {metrics.map(m => (
        <div key={m.label} style={{ padding: '12px', borderRadius: '4px', background: 'var(--bg-card-alt)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{m.label}</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{m.value}</div>
        </div>
      ))}
    </div>
  )
}

export default function ScoreTabs({ analysis, stockData }) {
  const [activeTab, setActiveTab] = useState('global')

  const scores = {
    global:      analysis.scoreGlobal,
    fundamental: analysis.scoreFundamental,
    tecnico:     analysis.scoreTecnico,
    sentimiento: analysis.scoreSentimiento,
  }

  const fundFactores = analysis.fundamental?.factores || []
  const fundSinDatos = !fundFactores.length || fundFactores.every(f => isNA(f.valor))

  return (
    <div className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '16px' }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id
          const grey = tab.id === 'fundamental' && fundSinDatos
          const { text, bg, border } = grey
            ? { text: 'var(--muted)', bg: 'rgba(136,136,136,0.08)', border: 'rgba(136,136,136,0.35)' }
            : scoreColor(scores[tab.id])
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', textAlign: 'left', background: isActive ? bg : 'var(--bg-card)', border: `1px solid ${isActive ? border : 'var(--border)'}`, borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <ScoreCircle score={scores[tab.id]} grey={grey} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '2px' }}>{tab.icon}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isActive ? 'var(--text)' : 'var(--muted)', fontFamily: 'var(--font-display)' }}>
                  {tab.label}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>

        {activeTab === 'global' && (
          <div className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
              <ScoreCircle score={analysis.scoreGlobal} />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>Score Global</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.7 }}>{analysis.resumenGlobal}</p>
              </div>
            </div>
            <MetricGrid stockData={stockData} />
          </div>
        )}

        {activeTab === 'fundamental' && (() => {
          const factores = analysis.fundamental?.factores || []
          const sinDatos = !factores.length || factores.every(f => isNA(f.valor))
          return (
            <div className="fade-in">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                <ScoreCircle score={analysis.scoreFundamental} grey={sinDatos} />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Análisis Fundamental</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7 }}>{analysis.fundamental?.resumen}</p>
                </div>
              </div>
              {sinDatos ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', textAlign: 'center', padding: '16px 0' }}>
                  Los datos fundamentales no están disponibles para este ticker en este momento.
                </p>
              ) : (
                <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                  {factores.map((f, i) => <FactorItem key={i} factor={f} />)}
                </div>
              )}
            </div>
          )
        })()}

        {activeTab === 'tecnico' && (
          <div className="fade-in">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
              <ScoreCircle score={analysis.scoreTecnico} />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Análisis Técnico</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7 }}>{analysis.tecnico?.resumen}</p>
              </div>
            </div>
            {stockData.rsi && stockData.rsi !== 'N/A' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                <div style={{ padding: '8px 14px', borderRadius: '4px', fontSize: '0.875rem', background: 'var(--bg-card-alt)', border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>RSI: </span>
                  <span style={{ color: 'var(--text)', fontWeight: 600, fontFamily: 'var(--font-display)' }}>{stockData.rsi}</span>
                </div>
                <div style={{ padding: '8px 14px', borderRadius: '4px', fontSize: '0.875rem', background: 'var(--bg-card-alt)', border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Señal: </span>
                  <span style={{ color: 'var(--green)', fontWeight: 600, fontFamily: 'var(--font-display)' }}>{stockData.rsiSenal}</span>
                </div>
              </div>
            )}
            <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {analysis.tecnico?.factores?.map((f, i) => <FactorItem key={i} factor={f} />)}
            </div>
          </div>
        )}

        {activeTab === 'sentimiento' && (
          <div className="fade-in">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
              <ScoreCircle score={analysis.scoreSentimiento} />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Sentimiento de Mercado</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7 }}>{analysis.sentimiento?.resumen}</p>
              </div>
            </div>
            {(() => {
              const noticias = stockData?.noticias?.length ? stockData.noticias : analysis.sentimiento?.noticias
              return noticias?.length > 0 ? (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>Últimas Noticias</h4>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {noticias.map((n, i) => <NewsItem key={i} noticia={n} />)}
                  </div>
                </div>
              ) : null
            })()}
            {analysis.sentimiento?.factores?.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>Factores</h4>
                <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                  {analysis.sentimiento.factores.map((f, i) => <FactorItem key={i} factor={f} />)}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
