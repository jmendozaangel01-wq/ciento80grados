import { useState } from 'react'

const ANALYSIS_TYPES = [
  {
    value: 'posts',
    label: 'Posts del perfil',
    icon: '▦',
    desc: 'Analiza el contenido publicado',
  },
  {
    value: 'comments',
    label: 'Comentarios',
    icon: '◈',
    desc: 'Extrae conversaciones y sentimiento',
  },
  {
    value: 'profile',
    label: 'Perfil completo',
    icon: '◉',
    desc: 'Métricas y datos del perfil',
  },
  {
    value: 'hashtag',
    label: 'Hashtag',
    icon: '◇',
    desc: 'Explora posts por etiqueta',
  },
]

const WEBHOOK_URL = 'https://n8n.srv1469845.hstgr.cloud/webhook/instagram-intelligence'

/* ─── inline style tokens ─────────────────────────────────── */
const T = {
  bg:        '#0a0a0a',
  bgCard:    '#111111',
  bgAlt:     '#1a1a1a',
  green:     '#00E676',
  greenDim:  'rgba(0, 230, 118, 0.10)',
  greenGlow: 'rgba(0, 230, 118, 0.22)',
  text:      '#F5F5F5',
  muted:     '#888888',
  border:    '#222222',
  borderSub: '#181818',
  red:       '#FF4D4D',
  redDim:    'rgba(255, 77, 77, 0.10)',
}

/* ─── shared input base ───────────────────────────────────── */
const inputBase = {
  width: '100%',
  background: T.bgAlt,
  border: `1px solid ${T.border}`,
  borderRadius: '6px',
  color: T.text,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '15px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

/* ─── keyframes injected once ─────────────────────────────── */
if (typeof document !== 'undefined' && !document.getElementById('ig-intel-styles')) {
  const style = document.createElement('style')
  style.id = 'ig-intel-styles'
  style.textContent = `
    @keyframes igFadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes igPulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.35; }
    }
    @keyframes igSpin {
      to { transform: rotate(360deg); }
    }
    @keyframes igCheckDraw {
      from { stroke-dashoffset: 40; }
      to   { stroke-dashoffset: 0; }
    }
    .ig-type-card {
      cursor: pointer;
      background: ${T.bgAlt};
      border: 1px solid ${T.border};
      border-radius: 8px;
      padding: 16px 14px;
      transition: border-color 0.18s, background 0.18s, transform 0.15s;
      user-select: none;
    }
    .ig-type-card:hover {
      border-color: rgba(0,230,118,0.4);
      transform: translateY(-2px);
    }
    .ig-type-card.selected {
      border-color: #00E676;
      background: rgba(0, 230, 118, 0.08);
      box-shadow: 0 0 0 1px #00E676 inset, 0 4px 24px rgba(0,230,118,0.12);
    }
    .ig-input:focus {
      border-color: #00E676 !important;
      box-shadow: 0 0 0 3px rgba(0,230,118,0.14) !important;
    }
    .ig-submit:hover:not(:disabled) {
      background: #00ff88 !important;
      transform: translateY(-1px);
      box-shadow: 0 6px 28px rgba(0,230,118,0.35) !important;
    }
    .ig-submit:active:not(:disabled) {
      transform: translateY(0);
    }
    .ig-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .ig-select:focus {
      border-color: #00E676 !important;
      box-shadow: 0 0 0 3px rgba(0,230,118,0.14) !important;
    }
    .ig-select option {
      background: #1a1a1a;
      color: #F5F5F5;
    }
    .ig-textarea:focus {
      border-color: #00E676 !important;
      box-shadow: 0 0 0 3px rgba(0,230,118,0.14) !important;
    }
  `
  document.head.appendChild(style)
}

export default function InstagramIntelligence() {
  const [username,  setUsername]  = useState('')
  const [tipo,      setTipo]      = useState('posts')
  const [limit,     setLimit]     = useState(10)
  const [email,     setEmail]     = useState('')
  const [context,   setContext]   = useState('')
  const [status,    setStatus]    = useState('idle') // idle | loading | success | error
  const [errorMsg,  setErrorMsg]  = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !email.trim()) return

    setStatus('loading')
    setErrorMsg('')

    const body = {
      instagram_url: username.startsWith('http')
        ? username
        : `https://www.instagram.com/${username.replace(/^@/, '')}/`,
      tipo,
      limit: Number(limit),
      email: email.trim(),
      context: context.trim(),
    }

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message || 'Ocurrió un error. Intenta de nuevo.')
      setStatus('error')
    }
  }

  const reset = () => {
    setStatus('idle')
    setUsername('')
    setEmail('')
    setContext('')
    setTipo('posts')
    setLimit(10)
    setErrorMsg('')
  }

  /* ── SUCCESS ──────────────────────────────────────────────── */
  if (status === 'success') {
    return (
      <div style={{
        ...wrapStyle,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '420px', textAlign: 'center',
        animation: 'igFadeUp 0.5s ease both',
      }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ marginBottom: '24px' }}>
          <circle cx="32" cy="32" r="31" stroke={T.green} strokeWidth="1.5" opacity="0.3" />
          <circle cx="32" cy="32" r="24" stroke={T.green} strokeWidth="1" opacity="0.15" />
          <polyline
            points="20,32 28,41 44,24"
            stroke={T.green}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="40"
            style={{ animation: 'igCheckDraw 0.6s 0.2s ease both' }}
          />
        </svg>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: 700, color: T.text, marginBottom: '10px' }}>
          Análisis en camino
        </div>
        <p style={{ color: T.muted, fontSize: '14px', maxWidth: '300px', lineHeight: '1.6', marginBottom: '32px' }}>
          El reporte llegará a <span style={{ color: T.green }}>{email}</span> en unos minutos.
        </p>
        <button onClick={reset} style={{
          background: 'transparent', border: `1px solid ${T.border}`,
          color: T.muted, borderRadius: '6px', padding: '9px 20px',
          fontFamily: "'DM Sans', sans-serif", fontSize: '13px',
          cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.green; e.currentTarget.style.color = T.text }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted }}
        >
          Nuevo análisis
        </button>
      </div>
    )
  }

  /* ── FORM ─────────────────────────────────────────────────── */
  return (
    <div style={wrapStyle}>

      {/* ── header ── */}
      <div style={{ marginBottom: '36px', animation: 'igFadeUp 0.45s ease both' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '7px',
          background: T.greenDim, border: `1px solid rgba(0,230,118,0.2)`,
          borderRadius: '20px', padding: '5px 13px', marginBottom: '18px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.green, animation: 'igPulse 2s ease infinite' }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: T.green, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Instagram Intelligence
          </span>
        </div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: T.text, lineHeight: 1.15, margin: 0 }}>
          Análisis de<br />
          <span style={{ color: T.green }}>competencia</span>
        </h2>
        <p style={{ color: T.muted, fontSize: '14px', marginTop: '10px', lineHeight: 1.6 }}>
          Extrae datos reales de Instagram para entender a tu competencia.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* ── 1. username ── */}
        <Field label="Perfil de Instagram" required style={{ animationDelay: '0.05s' }}>
          <div style={{
            display: 'flex', alignItems: 'stretch',
            border: `1px solid ${T.border}`, borderRadius: '6px',
            background: T.bgAlt, overflow: 'hidden',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
            onFocusCapture={e => { e.currentTarget.style.borderColor = T.green; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(0,230,118,0.14)` }}
            onBlurCapture={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = 'none' }}
          >
            <span style={{
              padding: '0 12px', display: 'flex', alignItems: 'center',
              borderRight: `1px solid ${T.border}`,
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: '12px', color: T.muted, whiteSpace: 'nowrap',
              background: T.bgCard, letterSpacing: '-0.01em',
            }}>
              instagram.com/
            </span>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={e => setUsername(e.target.value.replace(/\s/g, ''))}
              required
              style={{
                ...inputBase,
                background: 'transparent',
                border: 'none',
                padding: '12px 14px',
                borderRadius: 0,
              }}
            />
          </div>
        </Field>

        {/* ── 2. tipo de análisis ── */}
        <Field label="Tipo de análisis" required style={{ animationDelay: '0.1s' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {ANALYSIS_TYPES.map(t => (
              <div
                key={t.value}
                className={`ig-type-card${tipo === t.value ? ' selected' : ''}`}
                onClick={() => setTipo(t.value)}
                role="radio"
                aria-checked={tipo === t.value}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '16px',
                    color: tipo === t.value ? T.green : T.muted,
                    transition: 'color 0.18s',
                  }}>{t.icon}</span>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '13px',
                    color: tipo === t.value ? T.text : T.text,
                  }}>{t.label}</span>
                </div>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '11px',
                  color: T.muted,
                  margin: 0,
                  lineHeight: 1.4,
                }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </Field>

        {/* ── 3. cantidad ── */}
        <Field label="Cantidad de resultados" required style={{ animationDelay: '0.15s' }}>
          <select
            className="ig-select"
            value={limit}
            onChange={e => setLimit(e.target.value)}
            style={{
              ...inputBase,
              padding: '12px 14px',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              paddingRight: '38px',
              cursor: 'pointer',
            }}
          >
            <option value={10}>10 resultados</option>
            <option value={25}>25 resultados</option>
            <option value={50}>50 resultados</option>
          </select>
        </Field>

        {/* ── 4. email ── */}
        <Field label="Email del cliente" required style={{ animationDelay: '0.2s' }}>
          <input
            type="email"
            placeholder="cliente@empresa.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="ig-input"
            style={{ ...inputBase, padding: '12px 14px' }}
          />
        </Field>

        {/* ── 5. contexto ── */}
        <Field label={<>Contexto del negocio <span style={{ color: T.muted, fontWeight: 400, fontSize: '12px' }}>(opcional)</span></>} style={{ animationDelay: '0.25s' }}>
          <textarea
            placeholder="Ej. Tienda de ropa deportiva femenina, competimos con marcas locales en Bogotá…"
            value={context}
            onChange={e => setContext(e.target.value)}
            rows={3}
            className="ig-textarea"
            style={{
              ...inputBase,
              padding: '12px 14px',
              resize: 'vertical',
              minHeight: '90px',
              lineHeight: 1.6,
            }}
          />
        </Field>

        {/* ── error ── */}
        {status === 'error' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: T.redDim, border: `1px solid rgba(255,77,77,0.25)`,
            borderRadius: '6px', padding: '12px 14px', marginBottom: '20px',
            animation: 'igFadeUp 0.3s ease both',
          }}>
            <span style={{ color: T.red, fontSize: '16px' }}>⚠</span>
            <span style={{ color: T.red, fontFamily: "'DM Sans', sans-serif", fontSize: '13px' }}>{errorMsg}</span>
          </div>
        )}

        {/* ── submit ── */}
        <button
          type="submit"
          disabled={status === 'loading' || !username.trim() || !email.trim()}
          className="ig-submit"
          style={{
            width: '100%',
            background: T.green,
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            padding: '14px',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '15px',
            letterSpacing: '0.03em',
            cursor: 'pointer',
            transition: 'background 0.18s, transform 0.15s, box-shadow 0.18s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: `0 4px 20px rgba(0,230,118,0.2)`,
            marginTop: '4px',
          }}
        >
          {status === 'loading' ? (
            <>
              <span style={{
                width: '16px', height: '16px',
                border: '2px solid rgba(0,0,0,0.2)',
                borderTopColor: '#000',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'igSpin 0.7s linear infinite',
              }} />
              Procesando…
            </>
          ) : (
            <>
              Iniciar análisis
              <span style={{ fontSize: '13px', opacity: 0.7 }}>→</span>
            </>
          )}
        </button>

      </form>

    </div>
  )
}

/* ─── wrapper style ───────────────────────────────────────── */
const wrapStyle = {
  background: '#111111',
  border: '1px solid #222222',
  borderRadius: '12px',
  padding: 'clamp(24px, 4vw, 40px)',
  maxWidth: '560px',
  width: '100%',
  margin: '0 auto',
}

/* ─── Field wrapper ───────────────────────────────────────── */
function Field({ label, required, children, style = {} }) {
  return (
    <div style={{
      marginBottom: '22px',
      animation: 'igFadeUp 0.45s ease both',
      ...style,
    }}>
      <label style={{
        display: 'block',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '13px',
        fontWeight: 500,
        color: '#aaaaaa',
        marginBottom: '8px',
        letterSpacing: '0.02em',
      }}>
        {label}
        {required && <span style={{ color: '#00E676', marginLeft: '3px' }}>*</span>}
      </label>
      {children}
    </div>
  )
}
