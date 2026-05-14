import { useState } from 'react'

const QUICK_TICKERS = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'META']

export default function SearchBox({ onSearch, loading }) {
  const [input, setInput] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const ticker = input.trim().toUpperCase()
    if (ticker) onSearch(ticker)
  }

  function handleChip(ticker) {
    setInput(ticker)
    onSearch(ticker)
  }

  return (
    <div style={{ width: '100%', maxWidth: '680px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: '16px', color: 'var(--muted)', pointerEvents: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value.toUpperCase())}
            placeholder="Busca un ticker… AAPL, TSLA, NVDA"
            maxLength={10}
            disabled={loading}
            style={{
              width: '100%',
              paddingLeft: '44px',
              paddingRight: '140px',
              paddingTop: '14px',
              paddingBottom: '14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '3px',
              color: 'var(--text)',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              opacity: loading ? 0.6 : 1,
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--green)'
              e.target.style.boxShadow = '0 0 0 3px rgba(0,230,118,0.12)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--border)'
              e.target.style.boxShadow = 'none'
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary"
            style={{
              position: 'absolute',
              right: '6px',
              padding: '8px 20px',
              fontSize: '0.875rem',
              opacity: loading || !input.trim() ? 0.4 : 1,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Analizando…' : 'Analizar'}
          </button>
        </div>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', justifyContent: 'center' }}>
        {QUICK_TICKERS.map(ticker => (
          <button
            key={ticker}
            onClick={() => handleChip(ticker)}
            disabled={loading}
            className="tag"
            style={{
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.4 : 1,
              padding: '6px 14px',
              fontSize: '0.75rem',
              transition: 'border-color 0.2s, color 0.2s',
              background: 'none',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.borderColor = 'var(--green)'
                e.currentTarget.style.color = 'var(--green)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--muted)'
            }}
          >
            {ticker}
          </button>
        ))}
      </div>
    </div>
  )
}
