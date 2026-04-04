import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lsbwgrzkffyeisdlsoki.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzYndncnprZmZ5ZWlzZGxzb2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNDE4MTgsImV4cCI6MjA5MDcxNzgxOH0.rh8F-Iyit_39lgqq5swF7F6qSte8--z97_iOlEAHJT4'
)

const ESPACIOS = [
  { id: 'sala-de-estar', label: 'Sala de estar', icon: '🛋️' },
  { id: 'cocina',        label: 'Cocina',         icon: '🍳' },
  { id: 'bano',          label: 'Baño',           icon: '🚿' },
  { id: 'dormitorio',    label: 'Dormitorio',     icon: '🛏️' },
  { id: 'oficina',       label: 'Oficina',        icon: '💼' },
  { id: 'terraza',       label: 'Terraza',        icon: '🌿' },
]

const ESTILOS = [
  { id: 'moderno-minimalista', label: 'Moderno Minimalista' },
  { id: 'industrial',          label: 'Industrial'          },
  { id: 'escandinavo',         label: 'Escandinavo'         },
  { id: 'mediterraneo',        label: 'Mediterráneo'        },
  { id: 'rustico',             label: 'Rústico'             },
  { id: 'contemporaneo',       label: 'Contemporáneo'       },
]

// ── Styles ─────────────────────────────────────────────────────────────────

const s = {
  page: {
    minHeight: '100vh',
    paddingTop: '72px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--muted)',
    fontSize: '13px',
    fontFamily: 'var(--font-body)',
    textDecoration: 'none',
    transition: 'color 0.2s',
    paddingTop: '40px',
    paddingBottom: '12px',
  },
  hero: {
    maxWidth: '680px',
    marginBottom: '48px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(32px, 5vw, 52px)',
    fontWeight: 800,
    lineHeight: 1.1,
    color: 'var(--text)',
    marginBottom: '16px',
  },
  subtitle: {
    color: 'var(--muted)',
    fontSize: '16px',
    lineHeight: 1.7,
    maxWidth: '480px',
  },
  formCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '40px',
    marginBottom: '64px',
  },
  fieldLabel: {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginBottom: '12px',
  },
  fieldSection: {
    marginBottom: '36px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid var(--border)',
    margin: '36px 0',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--muted)',
    pointerEvents: 'none',
    display: 'flex',
  },
  input: {
    width: '100%',
    height: '52px',
    padding: '0 16px 0 44px',
    background: 'var(--bg-card-alt)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  photosGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  selectorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
  },
  errorMsg: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 14px',
    background: 'rgba(255,80,80,0.08)',
    border: '1px solid rgba(255,80,80,0.22)',
    borderRadius: '6px',
    color: '#ff6b6b',
    fontSize: '13px',
    marginBottom: '24px',
  },
  submitBtn: {
    width: '100%',
    height: '56px',
    background: 'var(--green)',
    border: 'none',
    borderRadius: '8px',
    color: '#0a0a0a',
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    fontWeight: 700,
    letterSpacing: '0.03em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'opacity 0.2s, transform 0.1s',
  },
}

// ── DropZone ───────────────────────────────────────────────────────────────

function DropZone({ tag, preview, isDragOver, inputRef, onDrop, onDragOver, onDragLeave, onClick, onChange }) {
  const borderColor = isDragOver || preview ? 'var(--green)' : 'var(--border)'
  const bg = isDragOver
    ? 'rgba(0,230,118,0.07)'
    : preview
    ? 'var(--bg-card-alt)'
    : 'var(--bg-card-alt)'

  return (
    <div
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      style={{
        position: 'relative',
        height: '180px',
        borderRadius: '10px',
        border: `1.5px dashed ${borderColor}`,
        background: bg,
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transition: 'border-color 0.2s, background 0.2s',
        boxShadow: isDragOver ? '0 0 0 3px rgba(0,230,118,0.15)' : 'none',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onChange}
      />

      {preview ? (
        <>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${preview})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
          {/* hover overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10,10,10,0.55)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
            className="dropzone-overlay"
          >
            <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>Cambiar foto</span>
          </div>
          <span style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'var(--green)',
            color: '#0a0a0a',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '3px 8px',
            borderRadius: '20px',
            fontFamily: 'var(--font-mono)',
          }}>
            {tag}
          </span>
        </>
      ) : (
        <>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--green)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
          }}>
            {tag}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--muted)', opacity: 0.7, textAlign: 'center', padding: '0 12px' }}>
            Arrastra o haz clic para subir
          </span>
        </>
      )}
    </div>
  )
}

// ── Selector Card ──────────────────────────────────────────────────────────

function SelectorCard({ label, icon, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: icon ? '6px' : '0',
        padding: '16px 10px',
        minHeight: icon ? 'auto' : '60px',
        background: selected ? 'rgba(0,230,118,0.08)' : 'var(--bg-card-alt)',
        border: `1px solid ${selected ? 'var(--green)' : 'var(--border)'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s, transform 0.1s',
        textAlign: 'center',
        color: selected ? 'var(--text)' : 'var(--muted)',
        boxShadow: selected ? '0 0 0 3px rgba(0,230,118,0.12)' : 'none',
      }}
      onMouseEnter={e => {
        if (!selected) e.currentTarget.style.borderColor = '#333'
      }}
      onMouseLeave={e => {
        if (!selected) e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      {icon && <span style={{ fontSize: '20px', lineHeight: 1 }}>{icon}</span>}
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: 1.3,
        color: 'inherit',
      }}>
        {label}
      </span>
    </button>
  )
}

// ── Success Screen ─────────────────────────────────────────────────────────

function SuccessScreen({ email, onReset }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        padding: '56px 40px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(0,230,118,0.1)',
          border: '1px solid rgba(0,230,118,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 28px',
          color: 'var(--green)',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '30px',
          fontWeight: 800,
          color: 'var(--text)',
          marginBottom: '12px',
          lineHeight: 1.2,
        }}>
          ¡Tu video está<br />
          <span style={{ color: 'var(--green)' }}>en camino!</span>
        </h2>
        <p style={{
          fontSize: '15px',
          color: 'var(--muted)',
          lineHeight: 1.7,
          maxWidth: '320px',
          margin: '0 auto 28px',
        }}>
          Nuestra IA está procesando tu espacio. Recibirás el video de transformación en tu correo en unos minutos.
        </p>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          padding: '8px 16px',
          background: 'var(--bg-card-alt)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          fontSize: '13px',
          color: 'var(--muted)',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{email}</strong>
        </div>
        <br />
        <button
          onClick={onReset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '24px',
            padding: '10px 20px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--muted)',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#333'
            e.currentTarget.style.color = 'var(--text)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--muted)'
          }}
        >
          ↩ Generar otra renovación
        </button>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function RenovarAI() {
  const [email, setEmail]                   = useState('')
  const [fotoAntes, setFotoAntes]           = useState(null)
  const [fotoDespues, setFotoDespues]       = useState(null)
  const [previewAntes, setPreviewAntes]     = useState('')
  const [previewDespues, setPreviewDespues] = useState('')
  const [espacio, setEspacio]               = useState('')
  const [estilo, setEstilo]                 = useState('')
  const [loading, setLoading]               = useState(false)
  const [success, setSuccess]               = useState(false)
  const [error, setError]                   = useState('')
  const [dragOver, setDragOver]             = useState(null)

  const refAntes   = useRef(null)
  const refDespues = useRef(null)

  const handleFile = (file, type) => {
    const url = URL.createObjectURL(file)
    if (type === 'antes') {
      setFotoAntes(file)
      setPreviewAntes(url)
    } else {
      setFotoDespues(file)
      setPreviewDespues(url)
    }
  }

  const handleDrop = (e, type) => {
    e.preventDefault()
    setDragOver(null)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handleFile(file, type)
  }

  const handleDragOver = (e, type) => {
    e.preventDefault()
    setDragOver(type)
  }

  const uploadPhoto = async (file, label) => {
    const ext  = file.name.split('.').pop() ?? 'jpg'
    const path = `${Date.now()}-${label}.${ext}`
    const { error } = await supabase.storage
      .from('fotos-renovar')
      .upload(path, file, { upsert: true })
    if (error) throw new Error(error.message)
    const { data } = supabase.storage.from('fotos-renovar').getPublicUrl(path)
    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !fotoAntes || !fotoDespues || !espacio || !estilo) {
      setError('Por favor completa todos los campos antes de continuar.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const [fotoAntesUrl, fotoDespuesUrl] = await Promise.all([
        uploadPhoto(fotoAntes, 'antes'),
        uploadPhoto(fotoDespues, 'despues'),
      ])
      await fetch('https://n8n.srv1469845.hstgr.cloud/webhook/renovar-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          foto_antes_url:   fotoAntesUrl,
          foto_despues_url: fotoDespuesUrl,
          espacio,
          estilo,
        }),
      })
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error al procesar tu solicitud. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setEmail('')
    setFotoAntes(null)
    setFotoDespues(null)
    setPreviewAntes('')
    setPreviewDespues('')
    setEspacio('')
    setEstilo('')
    setError('')
    setSuccess(false)
  }

  if (success) {
    return <SuccessScreen email={email} onReset={handleReset} />
  }

  return (
    <div style={s.page}>
      <div className="container">

        {/* Back link */}
        <Link
          to="/"
          style={s.backLink}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
        >
          ← Volver al inicio
        </Link>

        {/* Hero */}
        <div style={s.hero}>
          <div className="section-label">Herramientas IA</div>
          <h1 style={s.title}>
            Renovar<br />
            <span style={{ color: 'var(--green)' }}>AI</span>
          </h1>
          <p style={s.subtitle}>
            Sube dos fotos de tu espacio, elige el estilo y nuestra IA generará un video
            de transformación en minutos.
          </p>
        </div>

        {/* Form */}
        <div style={s.formCard}>
          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div style={s.fieldSection}>
              <label style={s.fieldLabel} htmlFor="email">
                Correo electrónico
              </label>
              <div style={s.inputWrapper}>
                <span style={s.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  style={s.input}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--green)'
                    e.target.style.boxShadow   = '0 0 0 3px rgba(0,230,118,0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border)'
                    e.target.style.boxShadow   = 'none'
                  }}
                />
              </div>
            </div>

            <hr style={s.divider} />

            {/* Photos */}
            <div style={s.fieldSection}>
              <span style={s.fieldLabel}>
                Fotos del espacio
                <span style={{ fontFamily: 'var(--font-body)', letterSpacing: 0, textTransform: 'none', fontSize: '12px', marginLeft: '8px', opacity: 0.6 }}>
                  — antes y referencia
                </span>
              </span>
              <div style={s.photosGrid}>
                <DropZone
                  tag="Foto Antes"
                  preview={previewAntes}
                  isDragOver={dragOver === 'antes'}
                  inputRef={refAntes}
                  onDrop={e => handleDrop(e, 'antes')}
                  onDragOver={e => handleDragOver(e, 'antes')}
                  onDragLeave={() => setDragOver(null)}
                  onClick={() => refAntes.current?.click()}
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0], 'antes')}
                />
                <DropZone
                  tag="Foto Después"
                  preview={previewDespues}
                  isDragOver={dragOver === 'despues'}
                  inputRef={refDespues}
                  onDrop={e => handleDrop(e, 'despues')}
                  onDragOver={e => handleDragOver(e, 'despues')}
                  onDragLeave={() => setDragOver(null)}
                  onClick={() => refDespues.current?.click()}
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0], 'despues')}
                />
              </div>
            </div>

            <hr style={s.divider} />

            {/* Espacio */}
            <div style={s.fieldSection}>
              <span style={s.fieldLabel}>Tipo de espacio</span>
              <div style={s.selectorGrid}>
                {ESPACIOS.map(item => (
                  <SelectorCard
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    selected={espacio === item.label}
                    onClick={() => setEspacio(item.label)}
                  />
                ))}
              </div>
            </div>

            <hr style={s.divider} />

            {/* Estilo */}
            <div style={s.fieldSection}>
              <span style={s.fieldLabel}>Estilo de diseño</span>
              <div style={s.selectorGrid}>
                {ESTILOS.map(item => (
                  <SelectorCard
                    key={item.id}
                    label={item.label}
                    selected={estilo === item.label}
                    onClick={() => setEstilo(item.label)}
                  />
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={s.errorMsg}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...s.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = '1' }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: '18px', height: '18px',
                    border: '2px solid rgba(10,10,10,0.3)',
                    borderTopColor: '#0a0a0a',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                    flexShrink: 0,
                  }} />
                  Procesando…
                </>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                  Generar mi video
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-copy">&copy; 2026 creado por 180°</div>
            <div className="footer-right">
              <Link to="/#servicios" className="footer-link">Servicios</Link>
              <Link to="/#portfolio" className="footer-link">Portfolio</Link>
              <Link to="/#contacto" className="footer-link">Contacto</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
