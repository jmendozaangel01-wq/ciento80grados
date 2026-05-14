export default function StockHero({ stockData }) {
  const { name, ticker, price, change, volume, sector } = stockData

  const changeNum = parseFloat(change) || 0
  const isPositive = changeNum >= 0
  const changeColor = isPositive ? 'var(--green)' : '#ef4444'
  const changeBg = isPositive ? 'var(--green-dim)' : 'rgba(239,68,68,0.08)'
  const changeBorder = isPositive ? 'rgba(0,230,118,0.2)' : 'rgba(239,68,68,0.2)'
  const changeSign = isPositive ? '+' : ''

  const priceNum = parseFloat(price)
  const formattedPrice = isNaN(priceNum)
    ? price
    : priceNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const formattedVolume = volume ? Number(volume).toLocaleString('en-US') : 'N/A'

  return (
    <div className="fade-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '28px 32px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, flexShrink: 0, background: 'var(--green-dim)', border: '1px solid rgba(0,230,118,0.2)', fontFamily: 'var(--font-display)', color: 'var(--green)' }}>
            {ticker.slice(0, 2)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--green)' }}>
                {ticker}
              </span>
              {sector && sector !== 'N/A' && (
                <span className="tag">{sector}</span>
              )}
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '2px' }}>
              {name !== ticker ? name : 'S&P 500'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
              ${formattedPrice}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '2px', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
              Precio actual
            </div>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: '3px', fontSize: '0.875rem', fontWeight: 600, border: `1px solid ${changeBorder}`, color: changeColor, background: changeBg, fontFamily: 'var(--font-display)' }}>
            {changeSign}{changeNum.toFixed(2)}%
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
        <StatPill label="Volumen" value={formattedVolume} />
        {sector && sector !== 'N/A' && <StatPill label="Sector" value={sector} />}
      </div>
    </div>
  )
}

function StatPill({ label, value }) {
  return (
    <div style={{ padding: '8px 14px', borderRadius: '3px', fontSize: '0.875rem', background: 'var(--bg-card-alt)', border: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--muted)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}: </span>
      <span style={{ color: 'var(--text)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}
