'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition() {
  const pathname = usePathname()
  const barRef = useRef(null)
  const rafRef = useRef(null)

  const animate = useCallback(() => {
    const bar = barRef.current
    if (!bar) return
    // Reset tanpa transisi
    bar.style.cssText = 'width:0%;opacity:1;transition:none'
    // Frame berikutnya: animasikan ke 90%
    rafRef.current = requestAnimationFrame(() => {
      bar.style.cssText = 'width:90%;opacity:1;transition:width 0.4s cubic-bezier(0.4,0,0.2,1)'
      // Selesaikan
      setTimeout(() => {
        bar.style.cssText = 'width:100%;opacity:1;transition:width 0.15s ease'
        setTimeout(() => {
          bar.style.cssText = 'width:100%;opacity:0;transition:opacity 0.3s ease'
        }, 150)
      }, 400)
    })
  }, [])

  useEffect(() => {
    animate()
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [pathname, animate])

  return (
    <div ref={barRef} aria-hidden="true"
      style={{
        position: 'fixed', top: 0, left: 0,
        height: '2px', width: '0%',
        background: 'linear-gradient(90deg, #a4dc4a, #b8e85c)',
        zIndex: 9999, opacity: 0, pointerEvents: 'none',
      }}
    />
  )
}
