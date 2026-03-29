import { useState, useEffect } from 'react'

const API_KEY    = import.meta.env.VITE_YOUTUBE_API_KEY
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID

async function fetchVideos() {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=9&type=video`
  )
  if (!res.ok) throw new Error('YouTube API error')
  const data = await res.json()
  return data.items.map(item => ({
    id:        item.id.videoId,
    title:     item.snippet.title,
    thumb:     item.snippet.thumbnails.medium.url,
    published: item.snippet.publishedAt,
  }))
}

function VideoThumb({ video, onClick }) {
  return (
    <button className="yt-thumb" onClick={() => onClick(video.id)}>
      <div className="yt-thumb-img-wrap">
        <img src={video.thumb} alt={video.title} loading="lazy" />
        <div className="yt-thumb-play">▶</div>
      </div>
      <p className="yt-thumb-title">{video.title}</p>
    </button>
  )
}

export default function YouTube() {
  const [videos,  setVideos]  = useState([])
  const [active,  setActive]  = useState(null)
  const [error,   setError]   = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
      .then(vids => {
        setVideos(vids)
        setActive(vids[0]?.id ?? null)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  // Pick 2 random suggestions (excluding featured)
  const suggestions = videos.length > 1
    ? videos.slice(1).sort(() => Math.random() - 0.5).slice(0, 2)
    : []

  const featured = videos.find(v => v.id === active)

  return (
    <section className="yt-section" id="youtube">
      <div className="container">

        <div className="section-label">YouTube</div>
        <h2 className="section-title">Contenido reciente<span className="green">.</span></h2>

        {loading && <p className="yt-status">Cargando videos…</p>}
        {error   && <p className="yt-status yt-status--error">No se pudieron cargar los videos.</p>}

        {!loading && !error && featured && (
          <>
            {/* ── Featured player ── */}
            <div className="yt-featured">
              <div className="yt-player-wrap">
                <iframe
                  key={active}
                  src={`https://www.youtube.com/embed/${active}?autoplay=0&rel=0`}
                  title={featured.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="yt-featured-title">{featured.title}</p>
            </div>

            {/* ── Suggestions ── */}
            {suggestions.length > 0 && (
              <div className="yt-suggestions">
                <p className="yt-suggestions-label">Te puede interesar</p>
                <div className="yt-suggestions-grid">
                  {suggestions.map(v => (
                    <VideoThumb key={v.id} video={v} onClick={setActive} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  )
}
