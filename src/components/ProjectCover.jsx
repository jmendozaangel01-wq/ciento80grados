import { useState } from 'react'

/**
 * Cover image for a project, with a generated stand-in when no screenshot
 * exists yet. Both branches share the same aspect-ratio box so the grid never
 * shifts while images load, which is what keeps CLS flat.
 *
 * The fallback also covers a `cover` path that 404s, so a typo or a deleted
 * file degrades to the placeholder instead of a broken image icon.
 */
export default function ProjectCover({ project, eager = false, className = '' }) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(project.cover) && !failed

  return (
    <div className={`pf-cover ${className}`.trim()}>
      {showImage ? (
        <img
          src={project.cover}
          alt={`Captura del proyecto ${project.title}`}
          className="pf-cover-img"
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="pf-cover-fallback" aria-hidden="true">
          <span className="pf-cover-symbol">{project.symbol}</span>
          <span className="pf-cover-name">{project.title}</span>
        </div>
      )}
    </div>
  )
}
