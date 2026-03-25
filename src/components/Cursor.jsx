import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const pos     = useRef({ x: 0, y: 0 })
  const ring    = useRef({ x: 0, y: 0 })
  const rafRef  = useRef(null)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top  = e.clientY + 'px'
      }
    }

    const onOver = (e) => {
      const el = e.target
      if (el.closest('a') || el.closest('button') || el.tagName === 'A' || el.tagName === 'BUTTON') {
        setHovering(true)
      }
    }
    const onOut = () => setHovering(false)

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.11
      ring.current.y += (pos.current.y - ring.current.y) * 0.11
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px'
        ringRef.current.style.top  = ring.current.y + 'px'
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring${hovering ? ' hovering' : ''}`} />
    </>
  )
}
