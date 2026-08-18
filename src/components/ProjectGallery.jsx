import { useState, useCallback, useEffect } from 'react'
import ProjectCover from './ProjectCover'

function Chevron({ direction }) {
  return (
    <svg width="13" height="22" viewBox="0 0 13 22" fill="none" aria-hidden="true">
      <path
        d={direction === 'prev' ? 'M11 1L2 11l9 10' : 'M2 1l9 10-9 10'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Pages through one project's photos: the cover first, then everything in
 * `gallery`. The arrows move between images of THIS project only — jumping to
 * another project is what the prev/next links at the bottom of the page do.
 *
 * With no images at all (the state every project starts in) it degrades to the
 * plain generated placeholder and renders no controls.
 */
export default function ProjectGallery({ project }) {
  const images = [project.cover, ...project.gallery].filter(Boolean)
  const count = images.length
  const hasControls = count > 1
  const [index, setIndex] = useState(0)

  // Guards against landing out of range when the viewer is reused for another
  // project with fewer photos.
  useEffect(() => { setIndex(0) }, [project.slug])

  const go = useCallback(step => {
    setIndex(i => (i + step + count) % count)
  }, [count])

  // Scoped to the viewer rather than the window on purpose: a global arrow-key
  // listener would steal the keys the reader uses to scroll the page.
  const handleKeyDown = e => {
    if (!hasControls) return
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1) }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
  }

  return (
    <div
      className="pf-viewer"
      tabIndex={hasControls ? 0 : undefined}
      onKeyDown={handleKeyDown}
      role={hasControls ? 'group' : undefined}
      aria-label={hasControls ? `Fotos de ${project.title}` : undefined}
    >
      <ProjectCover
        project={project}
        src={images[index]}
        alt={count ? `${project.title}, foto ${index + 1} de ${count}` : undefined}
        eager
        className="pf-detail-cover"
      />

      {hasControls && (
        <>
          <button
            type="button"
            className="pf-viewer-arrow pf-viewer-arrow--prev"
            onClick={() => go(-1)}
            aria-label="Foto anterior"
          >
            <Chevron direction="prev" />
          </button>

          <button
            type="button"
            className="pf-viewer-arrow pf-viewer-arrow--next"
            onClick={() => go(1)}
            aria-label="Foto siguiente"
          >
            <Chevron direction="next" />
          </button>

          <div className="pf-viewer-count" aria-live="polite">
            {index + 1} / {count}
          </div>

          <div className="pf-viewer-dots">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`pf-viewer-dot${i === index ? ' pf-viewer-dot--active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Ir a la foto ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
