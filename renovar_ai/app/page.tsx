'use client'

import { useState, useRef, RefObject } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lsbwgrzkffyeisdlsoki.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzYndncnprZmZ5ZWlzZGxzb2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MTI0MDAsImV4cCI6MjA1OTE4ODQwMH0.MPoiyzNFSrID29p6'
)

const ESPACIOS = [
  { id: 'sala-de-estar',  label: 'Sala de estar',  icon: '🛋️' },
  { id: 'cocina',         label: 'Cocina',          icon: '🍳' },
  { id: 'bano',           label: 'Baño',            icon: '🚿' },
  { id: 'dormitorio',     label: 'Dormitorio',      icon: '🛏️' },
  { id: 'oficina',        label: 'Oficina',         icon: '💼' },
  { id: 'terraza',        label: 'Terraza',         icon: '🌿' },
]

const ESTILOS = [
  { id: 'moderno-minimalista', label: 'Moderno Minimalista' },
  { id: 'industrial',          label: 'Industrial'          },
  { id: 'escandinavo',         label: 'Escandinavo'         },
  { id: 'mediterraneo',        label: 'Mediterráneo'        },
  { id: 'rustico',             label: 'Rústico'             },
  { id: 'contemporaneo',       label: 'Contemporáneo'       },
]

// ── Icons ──────────────────────────────────────────────────────────────────

function IconMail({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function IconUpload({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

function IconRefresh({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  )
}

function IconCheck({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function IconVideo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  )
}

function IconAlert({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

// ── DropZone ───────────────────────────────────────────────────────────────

interface DropZoneProps {
  tag: string
  preview: string
  isDragOver: boolean
  inputRef: RefObject<HTMLInputElement>
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave: () => void
  onClick: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function DropZone({ tag, preview, isDragOver, inputRef, onDrop, onDragOver, onDragLeave, onClick, onChange }: DropZoneProps) {
  const classes = [
    'dropzone',
    isDragOver ? 'drag-over' : '',
    preview    ? 'has-image' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`Subir ${tag}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="dropzone-input"
        onChange={onChange}
      />

      {preview ? (
        <>
          <div
            className="dropzone-preview"
            style={{ backgroundImage: `url(${preview})` }}
          />
          <div className="dropzone-preview-overlay">
            <IconRefresh size={18} />
            <span>Cambiar foto</span>
          </div>
          <span className="dropzone-badge">{tag}</span>
        </>
      ) : (
        <>
          <div className="dropzone-icon">
            <IconUpload size={20} />
          </div>
          <span className="dropzone-tag">{tag}</span>
          <span className="dropzone-hint">Arrastra o haz clic para subir</span>
        </>
      )}
    </div>
  )
}

// ── Success Screen ─────────────────────────────────────────────────────────

function SuccessScreen({ email, onReset }: { email: string; onReset: () => void }) {
  return (
    <div className="success-screen">
      <div className="success-card">
        <div className="success-icon">
          <IconCheck size={32} />
        </div>
        <h2 className="success-title">
          ¡Tu video está<br /><em>en camino!</em>
        </h2>
        <p className="success-subtitle">
          Nuestra IA está procesando tu espacio. Recibirás el video de transformación en tu correo en unos minutos.
        </p>
        <div className="success-email-badge">
          <IconMail size={13} />
          <strong>{email}</strong>
        </div>
        <br />
        <button className="new-request-btn" onClick={onReset}>
          <IconRefresh size={14} />
          Generar otra renovación
        </button>
      </div>
    </div>
  )
}

// ── Main Form ──────────────────────────────────────────────────────────────

export default function RenovarAI() {
  const [email, setEmail]                   = useState('')
  const [fotoAntes, setFotoAntes]           = useState<File | null>(null)
  const [fotoDespues, setFotoDespues]       = useState<File | null>(null)
  const [previewAntes, setPreviewAntes]     = useState('')
  const [previewDespues, setPreviewDespues] = useState('')
  const [espacio, setEspacio]               = useState('')
  const [estilo, setEstilo]                 = useState('')
  const [loading, setLoading]               = useState(false)
  const [success, setSuccess]               = useState(false)
  const [error, setError]                   = useState('')
  const [dragOver, setDragOver]             = useState<'antes' | 'despues' | null>(null)

  const refAntes   = useRef<HTMLInputElement>(null)
  const refDespues = useRef<HTMLInputElement>(null)

  const handleFile = (file: File, type: 'antes' | 'despues') => {
    const url = URL.createObjectURL(file)
    if (type === 'antes') {
      setFotoAntes(file)
      setPreviewAntes(url)
    } else {
      setFotoDespues(file)
      setPreviewDespues(url)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: 'antes' | 'despues') => {
    e.preventDefault()
    setDragOver(null)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handleFile(file, type)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, type: 'antes' | 'despues') => {
    e.preventDefault()
    setDragOver(type)
  }

  const uploadPhoto = async (file: File, label: string): Promise<string> => {
    const ext  = file.name.split('.').pop() ?? 'jpg'
    const path = `${Date.now()}-${label}.${ext}`
    const { error } = await supabase.storage
      .from('fotos-renovar')
      .upload(path, file, { upsert: true })
    if (error) throw new Error(error.message)
    const { data } = supabase.storage.from('fotos-renovar').getPublicUrl(path)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="page">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <div className="brand-mark">R</div>
          <span className="brand-name">Renovar <em>AI</em></span>
        </div>
        <span className="header-badge">Beta</span>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">Inteligencia Artificial</div>
        <h1 className="hero-title">
          Visualiza tu espacio<br />
          <em>renovado</em>
        </h1>
        <p className="hero-subtitle">
          Sube dos fotos de tu espacio, elige el estilo y nuestra IA generará un video de transformación en minutos.
        </p>
      </section>

      {/* Form */}
      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="form-section">
            <label className="field-label" htmlFor="email">
              Correo electrónico
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <IconMail size={16} />
              </span>
              <input
                id="email"
                className="input"
                type="email"
                placeholder="arquitecto@estudio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <hr className="section-divider" />

          {/* Photos */}
          <div className="form-section">
            <label className="field-label">
              Fotos del espacio
              <span className="field-label-sub">— antes y referencia</span>
            </label>
            <div className="photos-grid">
              <DropZone
                tag="Foto Antes"
                preview={previewAntes}
                isDragOver={dragOver === 'antes'}
                inputRef={refAntes}
                onDrop={(e) => handleDrop(e, 'antes')}
                onDragOver={(e) => handleDragOver(e, 'antes')}
                onDragLeave={() => setDragOver(null)}
                onClick={() => refAntes.current?.click()}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 'antes')}
              />
              <DropZone
                tag="Foto Después"
                preview={previewDespues}
                isDragOver={dragOver === 'despues'}
                inputRef={refDespues}
                onDrop={(e) => handleDrop(e, 'despues')}
                onDragOver={(e) => handleDragOver(e, 'despues')}
                onDragLeave={() => setDragOver(null)}
                onClick={() => refDespues.current?.click()}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 'despues')}
              />
            </div>
          </div>

          <hr className="section-divider" />

          {/* Espacio */}
          <div className="form-section">
            <label className="field-label">Tipo de espacio</label>
            <div className="selector-grid">
              {ESPACIOS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`selector-card ${espacio === item.label ? 'selected' : ''}`}
                  onClick={() => setEspacio(item.label)}
                >
                  <span className="selector-icon">{item.icon}</span>
                  <span className="selector-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="section-divider" />

          {/* Estilo */}
          <div className="form-section">
            <label className="field-label">Estilo de diseño</label>
            <div className="selector-grid">
              {ESTILOS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`selector-card style-card ${estilo === item.label ? 'selected' : ''}`}
                  onClick={() => setEstilo(item.label)}
                >
                  <span className="selector-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="error-msg">
              <IconAlert size={15} />
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Procesando tu solicitud…
              </>
            ) : (
              <>
                <IconVideo size={18} />
                Generar mi video
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
