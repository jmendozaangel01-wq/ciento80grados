import { useState } from 'react'

const STRATEGIES = [
  { key: 'scalping',     label: 'Scalping',      icon: '⚡', borderColor: '#ff6b35',        bgColor: 'rgba(255,107,53,0.06)',   tagColor: '#ff6b35',        desc: 'Minutos a horas' },
  { key: 'dayTrading',   label: 'Day Trading',   icon: '📅', borderColor: '#6366f1',        bgColor: 'rgba(99,102,241,0.06)',   tagColor: '#818cf8',        desc: 'Intradiario' },
  { key: 'swingTrading', label: 'Swing Trading', icon: '🌊', borderColor: 'var(--green)',   bgColor: 'var(--green-dim)',        tagColor: 'var(--green)',   desc: 'Días a semanas' },
]

function parsePrice(str) {
  if (!str) return null
  const n = parseFloat(String(str).replace(/[^0-9.]/g, ''))
  return isNaN(n) ? null : n
}

function calcProfit(investment, entrada, objetivo, stopLoss) {
  if (!investment || !entrada || !objetivo || !stopLoss) return null
  const shares = Math.floor(investment / entrada)
  if (shares < 1) return null
  const profit = shares * (objetivo - entrada)
  const loss = shares * (entrada - stopLoss)
  const rr = loss > 0 ? profit / loss : null
  const returnPct = ((objetivo - entrada) / entrada) * 100
  const lossPct = ((entrada - stopLoss) / entrada) * 100
  const spent = shares * entrada
  return { shares, profit, loss, rr, returnPct, lossPct, spent }
}

function fmt(n, decimals = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function ProbBar({ probability, color }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Probabilidad de éxito</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'var(--font-display)', color }}>{probability}%</span>
      </div>
      <div style={{ height: '6px', borderRadius: '3px', overflow: 'hidden', background: 'rgba(255,255,255,0.06)' }}>
        <div className="prob-bar" style={{ '--target-width': `${probability}%`, width: `${probability}%`, height: '100%', borderRadius: '3px', background: color }} />
      </div>
    </div>
  )
}

function PriceLevel({ label, value, color }) {
  return (
    <div style={{ padding: '10px', borderRadius: '4px', textAlign: 'center', background: 'var(--bg-card-alt)', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'var(--font-display)', color }}>{value || '—'}</div>
    </div>
  )
}

function ProfitCalculator({ data, investment, borderColor }) {
  const entrada  = parsePrice(data.entrada)
  const objetivo = parsePrice(data.objetivo)
  const stopLoss = parsePrice(data.stopLoss)
  const calc = calcProfit(investment, entrada, objetivo, stopLoss)

  const emptyStyle = { borderRadius: '4px', padding: '12px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--muted)', background: 'var(--bg)', border: '1px dashed var(--border)' }

  if (!investment || investment <= 0) return <div style={emptyStyle}>Ingresa un monto arriba para calcular</div>
  if (!calc)                          return <div style={emptyStyle}>Monto insuficiente para comprar 1 acción (entrada: ${entrada})</div>

  return (
    <div style={{ borderRadius: '4px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg)', border: `1px solid ${borderColor}20` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Acciones a comprar</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{calc.shares} acc. · ${fmt(calc.spent)}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div style={{ padding: '8px', borderRadius: '4px', textAlign: 'center', background: 'var(--green-dim)', border: '1px solid rgba(0,230,118,0.15)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '2px' }}>Ganancia objetivo</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-display)' }}>+${fmt(calc.profit)}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>+{fmt(calc.returnPct)}%</div>
        </div>
        <div style={{ padding: '8px', borderRadius: '4px', textAlign: 'center', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '2px' }}>Pérdida máx.</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ef4444', fontFamily: 'var(--font-display)' }}>-${fmt(calc.loss)}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>-{fmt(calc.lossPct)}%</div>
        </div>
      </div>
      {calc.rr !== null && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Ratio Riesgo:Recompensa</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', fontFamily: 'var(--font-display)', color: calc.rr >= 2 ? 'var(--green)' : calc.rr >= 1 ? '#f59e0b' : '#ef4444', background: calc.rr >= 2 ? 'var(--green-dim)' : calc.rr >= 1 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)' }}>
            1 : {fmt(calc.rr, 1)}
          </span>
        </div>
      )}
    </div>
  )
}

function StrategyCard({ config, data, investment }) {
  if (!data) return null
  return (
    <div className="fade-in" style={{ position: 'relative', overflow: 'hidden', borderRadius: '4px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-card)', border: `1px solid ${config.borderColor}30`, borderTop: `3px solid ${config.borderColor}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.25rem' }}>{config.icon}</span>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{config.label}</h3>
            <span style={{ fontSize: '0.75rem', color: config.tagColor }}>{config.desc}</span>
          </div>
        </div>
        <div style={{ padding: '4px 10px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 600, background: config.bgColor, color: config.tagColor, fontFamily: 'var(--font-display)' }}>
          {data.probabilidad}% prob.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        <PriceLevel label="Entrada"   value={data.entrada}   color="var(--muted)" />
        <PriceLevel label="Stop Loss" value={data.stopLoss}  color="#ef4444" />
        <PriceLevel label="Objetivo"  value={data.objetivo}  color="var(--green)" />
      </div>

      <ProbBar probability={data.probabilidad} color={config.borderColor} />

      {data.descripcion && (
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.75, borderTop: '1px solid var(--border)', paddingTop: '12px' }}>{data.descripcion}</p>
      )}

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>Simulación</p>
        <ProfitCalculator data={data} investment={investment} borderColor={config.borderColor} />
      </div>
    </div>
  )
}

export default function StrategyCards({ estrategias }) {
  const [investment, setInvestment] = useState('')
  if (!estrategias) return null
  const invNum = parseFloat(investment) || 0

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
          Estrategias de Trading
        </h2>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      <div className="glass-card" style={{ padding: '16px', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginBottom: '2px', fontFamily: 'var(--font-display)' }}>Capital a invertir</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Calcula acciones, ganancia objetivo y pérdida máxima</p>
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '0.875rem', fontWeight: 600 }}>$</span>
          <input
            type="number"
            min="0"
            placeholder="1000"
            value={investment}
            onChange={e => setInvestment(e.target.value)}
            style={{ paddingLeft: '28px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '3px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', outline: 'none', width: '160px', background: 'var(--bg-card-alt)', border: '1px solid var(--border)', fontFamily: 'var(--font-display)', transition: 'border-color 0.2s ease' }}
            onFocus={e => e.target.style.borderColor = 'var(--green)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>
        {invNum > 0 && (
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            USD {invNum.toLocaleString('en-US')}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {STRATEGIES.map(config => (
          <StrategyCard key={config.key} config={config} data={estrategias[config.key]} investment={invNum} />
        ))}
      </div>
    </div>
  )
}
