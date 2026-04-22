import { useState, useEffect, useCallback } from 'react'

const SHEET_ID = '1oyWqbUNz5aIsV_s4wTw5hLXTGNW-QKCaoItVKiQw23Y'
const SHEETS_BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values`

async function fetchSheet(sheetName) {
  const key = import.meta.env.VITE_GOOGLE_API_KEY
  const res = await fetch(`${SHEETS_BASE}/${encodeURIComponent(sheetName)}?key=${key}`)
  if (!res.ok) throw new Error(`HTTP ${res.status} en hoja "${sheetName}"`)
  const { values = [] } = await res.json()
  if (values.length < 2) return []
  const [headers, ...rows] = values
  return rows.map(row =>
    Object.fromEntries(headers.map((h, i) => [h.trim(), (row[i] ?? '').trim()]))
  )
}

// Flexible column finder — matches by partial upper-case key
function col(obj, ...keys) {
  for (const k of keys) {
    const found = Object.keys(obj).find(h => h.toUpperCase().includes(k.toUpperCase()))
    if (found) return obj[found] || ''
  }
  return ''
}

function parseMoney(str) {
  if (!str) return 0
  let s = String(str).trim()
  // Formato colombiano: punto = miles, coma = decimal (ej: "1.234,56" → 1234.56)
  if (s.includes(',')) {
    s = s.replace(/\./g, '').replace(',', '.')
  }
  return parseFloat(s.replace(/[^0-9.-]/g, '')) || 0
}

// Nike image cache to avoid repeat fetches per session
const nikeCache = new Map()

async function getNikeImage(sku) {
  if (!sku) return null
  if (nikeCache.has(sku)) return nikeCache.get(sku)
  try {
    const url = `https://api.nike.com/product_feed/threads/v2?filter=channelId(d9a5bc42-4b9c-4976-858a-f159cf99c647)&filter=marketplace(US)&filter=language(en)&filter=productInfo.merchProduct.styleColor(${sku})`
    const res = await fetch(url)
    const json = await res.json()
    const img = json?.objects?.[0]?.productInfo?.[0]?.imageUrls?.squarishURL ?? null
    nikeCache.set(sku, img)
    return img
  } catch {
    nikeCache.set(sku, null)
    return null
  }
}

// ─── Sub-components ──────────────────────────────────────────

function SkeletonPulse({ className }) {
  return <div className={`bg-zinc-800 rounded animate-pulse ${className}`} />
}

function KPICard({ label, value, sub, icon, loading }) {
  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <SkeletonPulse className="h-3 w-24 mb-4" />
        <SkeletonPulse className="h-8 w-20 mb-2" />
        <SkeletonPulse className="h-3 w-16" />
      </div>
    )
  }
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-600 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-white tabular-nums">{value ?? '—'}</div>
      {sub && <div className="text-xs text-zinc-500 mt-1 truncate">{sub}</div>}
    </div>
  )
}

function ProductImage({ sku }) {
  const [src, setSrc] = useState(undefined)

  useEffect(() => {
    let alive = true
    getNikeImage(sku).then(img => { if (alive) setSrc(img) })
    return () => { alive = false }
  }, [sku])

  if (src === undefined) return <SkeletonPulse className="w-12 h-12" />
  if (!src) return (
    <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
      <span className="text-zinc-600 text-[10px] font-bold">NIKE</span>
    </div>
  )
  return <img src={src} alt={sku} className="w-12 h-12 object-contain rounded-lg bg-zinc-800 p-0.5" />
}

function StateBadge({ estado }) {
  const e = String(estado).toUpperCase()
  if (e.includes('✅') || e.includes('DISPONIBLE')) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
        ✅ Disponible
      </span>
    )
  }
  if (e.includes('🔔') || e.includes('ALERTA')) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-950 text-amber-400 border border-amber-800">
        🔔 Alerta
      </span>
    )
  }
  if (e.includes('SIN STOCK') || e.includes('AGOTADO')) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-950 text-red-400 border border-red-800">
        🔴 Sin stock
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
      {estado || '❓'}
    </span>
  )
}

function DiffCell({ val }) {
  const n = parseMoney(val)
  if (n > 0) return <span className="text-emerald-400 font-semibold tabular-nums">▲ +${n.toLocaleString()}</span>
  if (n < 0) return <span className="text-red-400 font-semibold tabular-nums">▼ ${n.toLocaleString()}</span>
  return <span className="text-zinc-600">—</span>
}

function SkeletonTableRow({ cols }) {
  return (
    <tr className="border-b border-zinc-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonPulse className={`h-4 ${i === 0 ? 'w-12' : 'w-24'}`} />
        </td>
      ))}
    </tr>
  )
}

// ─── Main dashboard ──────────────────────────────────────────

const PAGE_SIZE = 20

function HistorialTable({ rows, loading, cols = 4 }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
          <th className="px-4 py-3 text-left">SKU</th>
          <th className="px-4 py-3 text-left">Talla</th>
          <th className="px-4 py-3 text-left">Estado</th>
          <th className="px-4 py-3 text-left">Fecha</th>
        </tr>
      </thead>
      <tbody>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={cols} />)
          : rows.length === 0
            ? (
              <tr>
                <td colSpan={cols} className="text-center py-16 text-zinc-600 text-sm">
                  Sin registros en historial
                </td>
              </tr>
            )
            : rows.map((h, i) => (
              <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-zinc-400">{col(h, 'SKU')}</td>
                <td className="px-4 py-3 text-zinc-300">{col(h, 'TALLA')}</td>
                <td className="px-4 py-3"><StateBadge estado={col(h, 'ESTADO')} /></td>
                <td className="px-4 py-3 text-xs text-zinc-500">{col(h, 'FECHA')}</td>
              </tr>
            ))
        }
      </tbody>
    </table>
  )
}

export default function NikeDashboard() {
  const [productos, setProductos] = useState([])
  const [historial, setHistorial] = useState([])
  const [cambios, setCambios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [toast, setToast] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [page, setPage] = useState(-1)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [p, h, c] = await Promise.all([
        fetchSheet('productos_monitoreados'),
        fetchSheet('historial_tallas'),
        fetchSheet('cambios_detectados'),
      ])
      setProductos(p)
      setHistorial(h)
      setCambios(c)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleUpdate = async () => {
    if (updating) return
    setUpdating(true)
    showToast('info', '🔄 n8n está actualizando los datos...')
    try {
      await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL, { mode: 'no-cors' })
    } catch { /* no-cors swallows the opaque response */ }
    await new Promise(r => setTimeout(r, 25000))
    await loadData()
    setUpdating(false)
    showToast('success', '✅ Datos actualizados')
  }

  function showToast(type, text) {
    setToast({ type, text })
    if (type === 'success') setTimeout(() => setToast(null), 4000)
  }

  // ── KPIs ────────────────────────────────────────────────────
  const totalProductos = productos.length

  const totalDisponibles = historial.filter(r => {
    const e = col(r, 'ESTADO').toUpperCase()
    return e.includes('✅') || e.includes('DISPONIBLE')
  }).length

  const productosSinStockTotal = historial.filter(r => {
    const e = col(r, 'ESTADO').toUpperCase()
    return e.includes('SIN STOCK') || e.includes('AGOTADO')
  }).length

  const maxDiff = productos.reduce(
    (best, p) => {
      const d = parseMoney(col(p, 'DIFERENCIA'))
      return d > best.val ? { val: d, nombre: col(p, 'NOMBRE') } : best
    },
    { val: 0, nombre: '—' }
  )

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans" style={{ fontFamily: 'inherit' }}>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-800 text-zinc-200 border border-zinc-600'
          }`}
        >
          {toast.type === 'info' && updating && (
            <span className="w-4 h-4 border-2 border-zinc-400 border-t-white rounded-full animate-spin shrink-0" />
          )}
          {toast.text}
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" style={{ paddingTop: 'calc(var(--nav-h) + 2rem)', paddingBottom: '3rem' }}>

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Nike logo box */}
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg shrink-0">
              <svg viewBox="0 0 24 24" className="w-7 h-5 fill-black" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 9.2L19.6 1 13.4 14.8c-.7 1.6-2.4 2.6-4.1 2.4-1.5-.1-2.7-1-3.3-2.3L1 9.2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight leading-tight">Monitor de Inventario</h1>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  En vivo — actualizado por n8n
                </span>
                {lastUpdate && (
                  <span className="text-xs text-zinc-600">
                    · {lastUpdate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={updating || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm font-semibold hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
          >
            {updating
              ? <span className="w-4 h-4 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
              : <span>🔄</span>
            }
            {updating ? 'Actualizando...' : 'Actualizar ahora'}
          </button>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl px-4 py-3 text-sm">
            ⚠️ Error al cargar datos: {error}
          </div>
        )}

        {/* ── KPIs ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard loading={loading} label="Productos" value={totalProductos} icon="👟" />
          <KPICard loading={loading} label="Tallas disponibles" value={totalDisponibles} icon="✅" />
          <KPICard loading={loading} label="Tallas sin stock" value={productosSinStockTotal} icon="🔴" />
          <KPICard
            loading={loading}
            label="Mayor diferencia"
            value={maxDiff.val > 0 ? `+$${maxDiff.val.toLocaleString()}` : '—'}
            sub={maxDiff.nombre}
            icon="📈"
          />
        </div>

        {/* ── Tabla de productos ── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Productos monitoreados</h2>
              {!loading && (
                <p className="text-xs text-zinc-600 mt-0.5">{totalProductos} producto{totalProductos !== 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-4 py-3 text-left w-16">Foto</th>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">SKU</th>
                  <th className="px-4 py-3 text-right">Precio Web</th>
                  <th className="px-4 py-3 text-right">Mi Precio</th>
                  <th className="px-4 py-3 text-right">Diferencia</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={7} />)
                  : productos.length === 0
                    ? (
                      <tr>
                        <td colSpan={7} className="text-center py-16 text-zinc-600 text-sm">
                          Sin productos en el sheet
                        </td>
                      </tr>
                    )
                    : productos.map((p, i) => {
                      const sku = col(p, 'SKU', 'REF')
                      return (
                        <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <ProductImage sku={sku} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-white max-w-[180px] truncate">{col(p, 'NOMBRE') || '—'}</div>
                            <div className="text-xs text-zinc-500 mt-0.5">{col(p, 'MARCA')}</div>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-zinc-400">{sku || '—'}</td>
                          <td className="px-4 py-3 text-right text-zinc-300 tabular-nums">
                            {col(p, 'PRECIO WEB') || '—'}
                          </td>
                          <td className="px-4 py-3 text-right text-white font-medium tabular-nums">
                            {col(p, 'TU PRECIO', 'MI PRECIO') || '—'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <DiffCell val={col(p, 'DIFERENCIA')} />
                          </td>
                          <td className="px-4 py-3">
                            <StateBadge estado={col(p, 'ESTADO')} />
                          </td>
                        </tr>
                      )
                    })
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Historial con tabs ── */}
        {(() => {
          const reversed = [...historial].reverse()
          const totalPages = Math.max(1, Math.ceil(historial.length / PAGE_SIZE))
          const safePage = Math.min(page, totalPages)
          const pageRows = historial.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
          const activeTab = safePage === 0 ? 'recientes' : 'todos'
          return (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-zinc-800 bg-zinc-900">
                <button
                  onClick={() => setPage(-1)}
                  className={`px-6 py-4 text-xs font-semibold uppercase tracking-widest transition-colors bg-transparent ${
                    page === -1
                      ? 'border-b-2 -mb-px'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  style={page === -1 ? { color: '#00cd69', borderColor: '#00cd69' } : {}}
                >
                  Últimos cambios
                </button>
                <button
                  onClick={() => setPage(1)}
                  className={`px-6 py-4 text-xs font-semibold uppercase tracking-widest transition-colors bg-transparent ${
                    page !== -1
                      ? 'border-b-2 -mb-px'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  style={page !== -1 ? { color: '#00cd69', borderColor: '#00cd69' } : {}}
                >
                  Historial completo
                  {!loading && historial.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-zinc-700 text-zinc-400 text-[10px] font-bold">
                      {historial.length}
                    </span>
                  )}
                </button>
              </div>

              {page === -1 ? (
                /* ── Tab: Últimos cambios ── */
                <div className="overflow-x-auto">
                  {loading ? (
                    <table className="w-full text-sm">
                      <tbody>{Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} cols={5} />)}</tbody>
                    </table>
                  ) : cambios.length === 0 ? (
                    <div className="text-center py-16 text-zinc-600 text-sm">Sin cambios detectados aún</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                          <th className="px-4 py-3 text-left">SKU</th>
                          <th className="px-4 py-3 text-left">Nombre</th>
                          <th className="px-4 py-3 text-left">Talla</th>
                          <th className="px-4 py-3 text-left">Cambio</th>
                          <th className="px-4 py-3 text-left">Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...cambios]
                          .sort((a, b) => new Date(col(b, 'FECHA')) - new Date(col(a, 'FECHA')))
                          .slice(0, 20)
                          .map((c, i) => {
                            const anterior = col(c, 'ESTADO_ANTERIOR', 'ANTERIOR')
                            const actual = col(c, 'ESTADO_ACTUAL', 'ACTUAL')
                            const isDisponible = actual.toUpperCase().includes('DISPONIBLE')
                            const isSinStock = actual.toUpperCase().includes('SIN STOCK') || actual.toUpperCase().includes('AGOTADO')
                            return (
                              <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                <td className="px-4 py-3 font-mono text-xs text-zinc-400">{col(c, 'SKU')}</td>
                                <td className="px-4 py-3 text-zinc-300 max-w-[160px] truncate">{col(c, 'NOMBRE') || '—'}</td>
                                <td className="px-4 py-3 text-zinc-300">{col(c, 'TALLA')}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                                      {anterior || '—'}
                                    </span>
                                    <span className="text-zinc-600 text-xs">→</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                      isDisponible
                                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                        : isSinStock
                                          ? 'bg-red-950 text-red-400 border-red-800'
                                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                    }`}>
                                      {actual || '—'}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-xs text-zinc-500">{col(c, 'FECHA')}</td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                  )}
                </div>
              ) : (
                /* ── Tab: Historial completo ── */
                <>
                  {!loading && totalPages > 1 && (
                    <div className="px-6 py-3 border-b border-zinc-800 flex items-center justify-between">
                      <span className="text-xs text-zinc-600">
                        Mostrando {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, historial.length)} de {historial.length}
                      </span>
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(n => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
                            .reduce((acc, n, idx, arr) => {
                              if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…')
                              acc.push(n)
                              return acc
                            }, [])
                            .map((n, i) =>
                              n === '…'
                                ? <span key={`e-${i}`} className="px-1 text-xs text-zinc-600">…</span>
                                : (
                                  <button
                                    key={n}
                                    onClick={() => setPage(n)}
                                    className={`w-6 h-6 rounded text-xs font-medium transition-colors border ${
                                      n === safePage
                                        ? 'bg-zinc-900 border-zinc-500 text-white'
                                        : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                                    }`}
                                  >
                                    {n}
                                  </button>
                                )
                            )
                          }
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={safePage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                          >←</button>
                          <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={safePage === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                          >→</button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="overflow-x-auto">
                    <HistorialTable loading={loading} rows={pageRows} />
                  </div>
                </>
              )}
            </div>
          )
        })()}

      </div>
    </div>
  )
}
