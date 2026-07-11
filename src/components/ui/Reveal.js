'use client'

import { useEffect, useRef } from 'react'

// Scroll-reveal ringan berbasis IntersectionObserver.
// Pakai classList langsung (bukan state) agar tidak memicu re-render React.
export default function Reveal({
  children,
  direction = 'up', // 'up' | 'left' | 'right' | 'zoom'
  delay = 0,        // detik
  className = '',
  once = true,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible')
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          if (once) io.disconnect()
        } else if (!once) {
          el.classList.remove('is-visible')
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      data-reveal={direction}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  )
}
