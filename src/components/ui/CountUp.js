'use client'

import { useEffect, useRef } from 'react'

// Angka statistik naik perlahan saat terlihat di viewport.
// Menerima nilai string seperti "2,800+", "5+", "3" — prefix/suffix dipertahankan.
export default function CountUp({ value, duration = 1.6, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const match = String(value).match(/^([^0-9]*)([\d.,]+)(.*)$/)
    if (!match || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = value
      return
    }

    const [, prefix, numStr, suffix] = match
    const target = parseFloat(numStr.replace(/,/g, ''))
    const useSeparator = numStr.includes(',')
    let started = false

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return
        started = true
        io.disconnect()
        const t0 = performance.now()
        const step = (now) => {
          const p = Math.min((now - t0) / (duration * 1000), 1)
          const eased = 1 - Math.pow(1 - p, 3) // ease-out cubic
          const current = Math.round(target * eased)
          el.textContent =
            prefix + (useSeparator ? current.toLocaleString('en-US') : current) + suffix
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}
