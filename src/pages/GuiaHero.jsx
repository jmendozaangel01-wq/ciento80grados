import { useState } from 'react'
import { Link } from 'react-router-dom'

// ── Copy Button ────────────────────────────────────────────────────────────

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 12px',
        background: copied ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${copied ? 'rgba(0,230,118,0.4)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '5px',
        color: copied ? 'var(--green)' : 'var(--muted)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Copiado
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copiar
        </>
      )}
    </button>
  )
}

// ── Prompt Block ───────────────────────────────────────────────────────────

function PromptBlock({ label, text, negative }) {
  return (
    <div style={{
      background: '#0f0f0f',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '10px',
      overflow: 'hidden',
      marginTop: '12px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        gap: '12px',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: negative ? '#ff7b7b' : 'var(--green)',
        }}>
          {label || (negative ? 'Negative prompt' : 'Prompt')}
        </span>
        <CopyButton text={text} />
      </div>
      <div style={{
        padding: '16px',
        fontFamily: 'var(--font-mono)',
        fontSize: '12.5px',
        lineHeight: 1.8,
        color: 'rgba(255,255,255,0.75)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {text}
      </div>
    </div>
  )
}

// ── Step Number ────────────────────────────────────────────────────────────

function StepNumber({ n }) {
  return (
    <div style={{
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: 'rgba(0,230,118,0.1)',
      border: '1px solid rgba(0,230,118,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: '12px',
      fontWeight: 700,
      color: 'var(--green)',
      flexShrink: 0,
    }}>
      {String(n).padStart(2, '0')}
    </div>
  )
}

// ── Tip ───────────────────────────────────────────────────────────────────

function Tip({ text }) {
  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-start',
      padding: '10px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ color: 'var(--green)', flexShrink: 0, marginTop: '2px', fontSize: '14px' }}>—</span>
      <span style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>{text}</span>
    </div>
  )
}

// ── Section Header ─────────────────────────────────────────────────────────

function SectionHeader({ label, title }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--green)',
        marginBottom: '10px',
      }}>
        {label}
      </div>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(22px, 3.5vw, 30px)',
        fontWeight: 800,
        color: 'var(--text)',
        lineHeight: 1.2,
        margin: 0,
      }}>
        {title}
      </h2>
    </div>
  )
}

// ── Callout ────────────────────────────────────────────────────────────────

function Callout({ icon, text, variant = 'tip' }) {
  const colors = {
    tip:     { bg: 'rgba(0,230,118,0.06)',  border: 'rgba(0,230,118,0.2)',  color: 'var(--green)' },
    warning: { bg: 'rgba(255,180,0,0.06)',  border: 'rgba(255,180,0,0.25)', color: '#ffb400' },
    config:  { bg: 'rgba(120,120,255,0.06)', border: 'rgba(120,120,255,0.2)', color: '#8888ff' },
  }
  const c = colors[variant] || colors.tip
  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      padding: '14px 16px',
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: '8px',
      marginTop: '12px',
    }}>
      <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
      <span style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.6 }}>{text}</span>
    </div>
  )
}

// ── Divider ────────────────────────────────────────────────────────────────

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '56px 0' }} />
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function GuiaHero() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px' }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: '#0a0a0a',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '64px 0 56px',
        marginBottom: '0',
      }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--muted)',
              fontSize: '13px',
              fontFamily: 'var(--font-body)',
              textDecoration: 'none',
              marginBottom: '40px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
          >
            ← Volver al inicio
          </Link>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--green)',
            marginBottom: '16px',
          }}>
            180 Grados — Guía Práctica
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 58px)',
            fontWeight: 800,
            lineHeight: 1.05,
            color: 'var(--text)',
            marginBottom: '20px',
          }}>
            Hero Animado<br />
            <span style={{ color: 'var(--green)' }}>con IA</span>
          </h1>

          <p style={{
            fontSize: '16px',
            color: 'var(--muted)',
            lineHeight: 1.7,
            maxWidth: '520px',
            marginBottom: '32px',
          }}>
            Crea videos tipo <em>exploded view</em> y <em>particle morph</em> para el banner de tu página web usando Kling AI.
          </p>

          {/* Pills */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['Kling AI', 'Exploded View', 'Particle Morph', 'Hero Web'].map(tag => (
              <span key={tag} style={{
                padding: '5px 12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--muted)',
                letterSpacing: '0.05em',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container" style={{ maxWidth: '760px', padding: '64px 24px' }}>

        {/* ── Qué vas a lograr ── */}
        <div style={{
          padding: '32px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          marginBottom: '64px',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--green)',
            marginBottom: '16px',
          }}>
            Al terminar esta guía
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text)', lineHeight: 1.7, marginBottom: '16px' }}>
            Tendrás un hero (banner principal) para tu página web con un video generado por inteligencia artificial que muestra tus productos de una forma cinematográfica — igual a los comerciales de Apple o Samsung.
          </p>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
            No necesitas saber programar para generar los videos. Solo necesitas Kling AI y tu producto.
          </p>
          <div style={{
            marginTop: '20px',
            padding: '12px 16px',
            background: 'rgba(0,230,118,0.06)',
            border: '1px solid rgba(0,230,118,0.18)',
            borderRadius: '8px',
            fontSize: '14px',
            color: 'var(--muted)',
            lineHeight: 1.6,
          }}>
            ✅ Esta guía usa ejemplos reales: una lámpara decorativa y unos AirPods — generados completamente con IA.
          </div>
        </div>

        {/* ── Qué es un hero animado ── */}
        <SectionHeader label="Concepto" title="¿Qué es un hero animado?" />
        <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '28px' }}>
          El hero es la primera sección que ven tus visitantes al entrar a tu página web. Normalmente es una imagen o un texto grande. Con esta técnica, lo transformas en un video que muestra tu producto desarmándose y volviéndose a armar — o transformándose en partículas que forman otro objeto.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {[
            {
              title: 'Exploded View',
              desc: 'El producto se desarma en el aire mostrando todas sus partes, y luego se vuelve a armar.',
            },
            {
              title: 'Particle Morph',
              desc: 'Un objeto se desintegra en miles de partículas que se reorganizan formando otro objeto diferente.',
            },
          ].map(item => (
            <div key={item.title} style={{
              padding: '24px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: '10px',
              }}>
                {item.title}
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <Divider />

        {/* ── Lo que necesitas ── */}
        <SectionHeader label="Requisitos" title="Lo que necesitas" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          {[
            { name: 'Kling AI', hint: 'klingai.com — Para generar imágenes y videos con IA' },
            { name: 'Fotos de tus productos', hint: 'Con fondo blanco o neutro, mejor calidad posible' },
            { name: 'Claude Code', hint: 'Para integrar el video en tu página web' },
            { name: 'Acceso al código de tu página', hint: 'Shopify, WordPress, o HTML propio' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 20px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(0,230,118,0.1)',
                border: '1px solid rgba(0,230,118,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--green)',
                flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--muted)' }}>{item.hint}</div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ── Proceso ── */}
        <SectionHeader label="Visión general" title="El proceso paso a paso" />
        <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '28px' }}>
          El flujo completo tiene 4 pasos. Cada uno se explica en detalle con ejemplos reales en las siguientes secciones.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {[
            { n: '01', title: 'Foto original del producto', desc: 'Consigue una imagen limpia de tu producto' },
            { n: '02', title: 'Imagen exploded view', desc: 'Usa Kling Image Generation para crear la versión desarmada' },
            { n: '03', title: 'Video de la transición', desc: 'Usa Kling Video Generation para animar entre las dos imágenes' },
            { n: '04', title: 'Integración web', desc: 'Le dices a Claude Code que adapte el video a tu página' },
          ].map((step, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start',
              padding: '20px 24px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              marginBottom: '4px',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '22px',
                fontWeight: 800,
                color: 'rgba(0,230,118,0.25)',
                lineHeight: 1,
                minWidth: '36px',
              }}>
                {step.n}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* ── Ejemplo 1: Lámpara ── */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 14px',
          background: 'rgba(0,230,118,0.08)',
          border: '1px solid rgba(0,230,118,0.2)',
          borderRadius: '20px',
          marginBottom: '24px',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--green)' }}>
            Ejemplo 1
          </span>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Lámpara decorativa</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(0,230,118,0.6)', letterSpacing: '0.1em' }}>
            EXPLODED VIEW
          </span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 3.5vw, 30px)',
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.2,
          marginBottom: '16px',
        }}>
          Lámpara decorativa — Exploded View
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '40px' }}>
          Cómo tomar una lámpara de techo vintage y crear un video donde sus piezas se desarman en el aire y luego se ensamblan, terminando con la bombilla Edison encendida en el centro.
        </p>

        {/* Paso 1 */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          <StepNumber n={1} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
              Consigue la foto completa del producto
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '12px' }}>
              Si tu foto original está cortada o no muestra el producto completo, primero completa la imagen en Kling. Sube la foto incompleta y usa este prompt:
            </p>
            <PromptBlock
              label="Kling Image Generation — Completar foto"
              text={`@Image1 full view of an ornate ceiling pendant lamp with decorative golden brass mount attached to ceiling, complete lantern body fully visible, geometric cage frame with frosted glass panels, vintage Edison bulb glowing warm amber, entire lamp from ceiling mount to bottom tip in frame, centered composition, dark gray background, soft dramatic studio lighting, product photography, no cropping`}
            />
            <Callout
              variant="tip"
              icon="💡"
              text="Agrega 'entire lamp from ceiling mount to bottom tip in frame' y 'no cropping' para que Kling no corte la imagen."
            />
          </div>
        </div>

        {/* Paso 2 */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          <StepNumber n={2} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
              Genera el Exploded View
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '12px' }}>
              Ve a Image Generation en Kling. Sube la foto completa de la lámpara como referencia. Usa este prompt:
            </p>
            <PromptBlock
              label="Kling Image Generation — Exploded view"
              text={`@Image1 exploded view of this ornate ceiling pendant lamp, all components separated and floating in mid-air: decorative golden brass ceiling mount plate hovering at top, ornamental scrolled connector pieces floating apart, each metal cage rod drifting outward separately, frosted glass panels suspended individually, Edison bulb glowing warm amber floating in center. All parts spread in space with subtle rotation, dark gray background, soft dramatic studio lighting, luxury product photography style, no people, no text`}
            />
            <Callout
              variant="config"
              icon="⚙️"
              text="Configura: 2K HD — Auto — 2 variaciones. Escoge la que mejor muestre todas las partes separadas."
            />
          </div>
        </div>

        {/* Paso 3 */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          <StepNumber n={3} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
              Genera el video de ensamblaje
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '12px' }}>
              Ve a Video Generation. Carga la imagen del exploded view a la izquierda y la lámpara completa a la derecha. Kling va a animar la transición entre ambas.
            </p>
            <PromptBlock
              label="Kling Video Generation — Prompt"
              text={`The scattered lamp components slowly float inward from all directions, the frosted glass panels glide back into position, the metal cage rods lock into place, and the Edison bulb settles in the center glowing warm amber. All pieces converge and assemble into a complete ornate ceiling pendant lamp. Slow, elegant, cinematic motion. Camera completely still. Dark gray background. Luxury product commercial style.`}
            />
            <PromptBlock
              label="Negative prompt"
              negative
              text={`fast motion, shaky camera, blurry, distorted, morphing, people, hands, text, watermark, flickering`}
            />
            <Callout
              variant="config"
              icon="⚙️"
              text="Configuración recomendada: 1080p — 5 segundos — Creatividad 0.4"
            />
          </div>
        </div>

        <Divider />

        {/* ── Ejemplo 2: AirPods ── */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 14px',
          background: 'rgba(136,136,255,0.08)',
          border: '1px solid rgba(136,136,255,0.2)',
          borderRadius: '20px',
          marginBottom: '24px',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8888ff' }}>
            Ejemplo 2
          </span>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Producto de tecnología</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(136,136,255,0.7)', letterSpacing: '0.1em' }}>
            PARTICLE MORPH
          </span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 3.5vw, 30px)',
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.2,
          marginBottom: '16px',
        }}>
          Producto de tecnología — Particle Morph
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '12px' }}>
          Un objeto se desintegra en miles de partículas brillantes que se reorganizan formando otro objeto. El resultado es idéntico al estilo de los comerciales de transformers o productos Apple.
        </p>
        <Callout
          variant="warning"
          icon="⚠️"
          text="Este efecto funciona especialmente bien con productos que tienen formas reconocibles y fondo oscuro o negro."
        />
        <div style={{ marginBottom: '40px' }} />

        {/* Paso 1 */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          <StepNumber n={1} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
              Genera imágenes premium del producto
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '12px' }}>
              Si tus fotos no tienen la calidad cinematográfica que quieres, usa Kling para mejorarlas. Sube varias fotos de referencia y usa este prompt:
            </p>
            <PromptBlock
              label="Kling Image Generation — Producto premium"
              text={`@Image1 @Image2 @Image3 single left earbud floating in mid-air, perfectly centered, ultra high quality product photography, soft gradient background in deep space gray, dramatic studio lighting with subtle rim light highlighting the glossy surface, the mesh sensor detail sharp and visible, silicon ear tip clean and defined, stem pointing downward, slight 3/4 angle view, photorealistic, 8K quality, luxury commercial aesthetic, isolated product shot`}
            />
            <Callout
              variant="tip"
              icon="💡"
              text="Usa varias fotos de referencia (@Image1 @Image2 @Image3) para que Kling mantenga consistencia en los detalles del producto."
            />
          </div>
        </div>

        {/* Paso 2 */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          <StepNumber n={2} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
              Genera la versión espejo (si aplica)
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '12px' }}>
              Si tu producto tiene versión izquierda y derecha (como auriculares), genera la segunda usando solo la primera imagen como referencia:
            </p>
            <PromptBlock
              label="Kling Image Generation — Versión espejo"
              text={`@Image1 same product photography style, but right side version, mirror of this image, identical lighting setup with dramatic rim light on black background, same glossy surface, same mesh sensor detail, same silicon ear tip, ultra high quality, 8K, luxury commercial aesthetic`}
            />
          </div>
        </div>

        {/* Paso 3 */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
          <StepNumber n={3} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
              Genera el video Particle Morph
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '12px' }}>
              Ve a Video Generation. Carga la imagen del objeto inicial (izquierda) y el objeto final (derecha). Usa este prompt:
            </p>
            <PromptBlock
              label="Kling Video Generation — Particle morph"
              text={`The left object slowly begins to disintegrate into thousands of tiny glowing particles, breaking apart from the edges inward, each fragment drifting and swirling through the dark space. The particles flow and converge, morphing mid-air into the shape of the right object, assembling piece by piece from particles into a solid object. The transformation is fluid, cinematic, dramatic. Particles glow with subtle white and silver light against the deep black background. Slow motion, epic sci-fi product reveal style. Camera completely still.`}
            />
            <PromptBlock
              label="Negative prompt"
              negative
              text={`fast motion, blurry, morphing blob, melting, distorted shape, people, text, watermark`}
            />
            <Callout
              variant="config"
              icon="⚙️"
              text="Configuración recomendada: 1080p — 5 segundos"
            />
          </div>
        </div>

        <Divider />

        {/* ── Integración web ── */}
        <SectionHeader label="Paso final" title="Integración en tu página con Claude Code" />
        <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '32px' }}>
          Una vez tienes el video descargado desde Kling, el siguiente paso es meterlo en tu página como el hero principal. Para esto vas a usar Claude Code — copia y pega el mensaje de abajo adaptando los detalles de tu sitio.
        </p>

        <PromptBlock
          label="Claude Code — Instrucción base"
          text={`Tengo una página web con tema personalizado. Quiero reemplazar el hero/banner actual por un video de fondo en loop. El video ya está listo y lo voy a subir manualmente como archivo de contenido.

Necesito que:
1. Revises la estructura actual del hero en el tema
2. Implementes un section de hero con video de fondo en loop, sin sonido, autoplay, que ocupe el 100% del ancho de pantalla
3. El video tenga un overlay oscuro semitransparente encima para que el texto del hero sea legible
4. Encima del video quede espacio para título, subtítulo y botón CTA
5. Sea responsive — en móvil que no se vea cortado

El archivo de video lo voy a referenciar desde el CDN una vez lo suba. Déjame un placeholder claro donde poner la URL.`}
        />

        <div style={{ margin: '24px 0' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: '12px',
          }}>
            Si tu video tiene fondo negro — agrega esto:
          </div>
          <PromptBlock
            label="Claude Code — Instrucción de color para fondos oscuros"
            text={`El hero tiene un video de fondo con fondo negro profundo. Necesito que todo el section mantenga consistencia visual con ese color:
1. Fondo del section: #0a0a0a (negro profundo, no negro puro para evitar banding)
2. Overlay sobre el video: rgba(0, 0, 0, 0.3) — solo para suavizar, no para oscurecer
3. Texto del hero: blanco #ffffff o gris muy claro #f0f0f0
4. Botón CTA: fondo transparente con borde blanco (ghost button), texto blanco
5. Asegúrate de que no haya ningún color de fondo blanco o gris claro heredado del tema que rompa la transición entre el hero y la siguiente sección

El objetivo es que el video y el banner se sientan como una sola pieza visual oscura y premium.`}
          />
        </div>

        <div style={{ margin: '24px 0' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: '12px',
          }}>
            Si tu sitio está en Shopify — agrega esto al inicio:
          </div>
          <PromptBlock
            label="Claude Code — Para Shopify"
            text={`Tengo una tienda Shopify con tema personalizado en Liquid. El video lo voy a subir desde el panel de Shopify en Contenido > Archivos. Una vez subido me dará una URL del CDN de Shopify (cdn.shopify.com). Usa esa URL como placeholder en el código del section.`}
          />
        </div>

        <Divider />

        {/* ── Consejos ── */}
        <SectionHeader label="Pro tips" title="Consejos para mejores resultados" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {[
            {
              title: 'En Kling Image Generation',
              tips: [
                'Usa fondos neutros (blanco, gris o negro) en tus fotos originales — facilita el trabajo de la IA',
                'Genera siempre 2 variaciones y escoge la mejor',
                'Si una generación sale mal, ajusta el prompt agregando más descripción de las partes del objeto',
                'La creatividad entre 0.4 y 0.5 da los mejores resultados para producto — más alto y la IA inventa cosas',
              ],
            },
            {
              title: 'En Kling Video Generation',
              tips: [
                '1080p para hero web — 720p se ve pixelado en pantallas grandes',
                '5 segundos es suficiente para la mayoría de transiciones',
                "El sentido 'ensamblaje' (de desarmado a completo) termina en el producto perfecto — más impactante para e-commerce",
                "El sentido 'desintegración a otro objeto' (particle morph) funciona mejor para mostrar variantes o colecciones",
              ],
            },
            {
              title: 'En la integración web',
              tips: [
                'Comprime el video antes de subirlo — usa HandBrake o Squoosh para reducir el peso sin perder calidad',
                'El video debe estar en formato MP4 (H.264) para compatibilidad máxima con todos los navegadores',
                'Agrega siempre un poster image (la imagen final del producto) que aparezca mientras carga el video',
                'En móvil considera mostrar una imagen estática en lugar del video para no afectar la velocidad',
              ],
            },
          ].map(group => (
            <div key={group.title}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: '8px',
              }}>
                {group.title}
              </div>
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                overflow: 'hidden',
                padding: '8px 16px',
              }}>
                {group.tips.map((tip, i) => (
                  <Tip key={i} text={tip} />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Footer ── */}
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
