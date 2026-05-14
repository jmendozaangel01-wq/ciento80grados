import { useEffect, useRef } from 'react'

export default function StockChart({ ticker }) {
  const containerRef = useRef(null)
  const containerId = `tv_chart_${ticker}`

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function createWidget() {
      if (!window.TradingView) return
      container.innerHTML = `<div id="${containerId}"></div>`
      new window.TradingView.widget({
        container_id: containerId,
        symbol: ticker,
        interval: 'D',
        theme: 'dark',
        style: '1',
        locale: 'es',
        width: '100%',
        height: 420,
        toolbar_bg: '#111111',
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        backgroundColor: '#0a0a0a',
        gridColor: 'rgba(34,34,34,0.6)',
      })
    }

    if (window.TradingView) {
      createWidget()
    } else {
      const existing = document.getElementById('tradingview-script')
      if (existing) {
        existing.addEventListener('load', createWidget)
      } else {
        const script = document.createElement('script')
        script.id = 'tradingview-script'
        script.src = 'https://s3.tradingview.com/tv.js'
        script.async = true
        script.onload = createWidget
        document.head.appendChild(script)
      }
    }

    return () => {
      if (container) container.innerHTML = ''
    }
  }, [ticker])

  return (
    <div className="fade-in" style={{ overflow: 'hidden', border: '1px solid var(--border)', borderRadius: '4px' }}>
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{ticker}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>· Gráfico diario</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--muted)', opacity: 0.5, fontFamily: 'var(--font-mono)' }}>TradingView</span>
      </div>
      <div ref={containerRef} style={{ height: '420px', background: 'var(--bg)' }} />
    </div>
  )
}
