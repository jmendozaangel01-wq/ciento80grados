import { useState, useEffect } from 'react'

const CATEGORIES = ['Tech', 'IA', 'Política', 'Deporte', 'Todos']
const WEBHOOK = 'https://n8n.srv1469845.hstgr.cloud/webhook/noticias'

export default function NewsFeed() {
  const [active, setActive]   = useState('Todos')
  const [news, setNews]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)
  const [page, setPage]       = useState(0)
  const PER_PAGE = 3

  useEffect(() => {
    fetch(WEBHOOK)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { setNews(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const filtered = active === 'Todos'
    ? news
    : news.filter(n => n.catLabel === active)

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  const handleTab = (cat) => { setActive(cat); setPage(0) }

  return (
    <section className="news" id="noticias">
      <div className="container">

        <div className="news-header">
          <div>
            <div className="section-label">Feed</div>
            <h2 className="section-title">Noticias</h2>
          </div>
          <div className="news-powered">
            <div className="news-powered-dot" />
            n8n &nbsp;&middot;&nbsp; actualización automática
          </div>
        </div>

        <div className="news-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`news-tab${active === cat ? ' active' : ''}`}
              onClick={() => handleTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && <p className="news-status">Cargando noticias...</p>}
        {error   && <p className="news-status">No se pudieron cargar las noticias. Activa el workflow en n8n.</p>}

        <div className="news-grid">
          {paginated.map((item, i) => (
            <a
              key={i}
              className="news-card"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="news-card-meta">
                <span className={`news-cat ${item.cat}`}>{item.catLabel}</span>
                <span className="news-time">{item.time}</span>
              </div>
              <h4 className="news-title">{item.title}</h4>
              <div className="news-source">Leer más</div>
            </a>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="news-pagination">
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => (
              <button
                key={i}
                className={`news-page-dot${page === i ? ' active' : ''}`}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
            {totalPages > 3 && (
              <>
                <button
                  className="news-page-dot"
                  onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
                  disabled={page === totalPages - 1}
                >›</button>
                <button
                  className="news-page-dot"
                  onClick={() => setPage(totalPages - 1)}
                  disabled={page === totalPages - 1}
                >»</button>
              </>
            )}
          </div>
        )}

      </div>
    </section>
  )
}
