'use client'

import { useTranslations } from 'next-intl'
import { ShieldCheck, Leaf, Award, Globe2 } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const ICONS = [ShieldCheck, Leaf, Award, Globe2]

export default function TrustBadges() {
  const t = useTranslations('trust')
  const items = [1, 2, 3, 4].map((n) => ({
    icon: ICONS[n - 1],
    label: t(`item${n}`),
  }))

  return (
    <section className="relative bg-brand-darker border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal direction="up" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(({ icon: Icon, label }, i) => (
            <div
              key={i}
              className="flex items-center gap-3 justify-center md:justify-start px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-green/40 transition-colors duration-300"
            >
              <div className="w-9 h-9 rounded-full bg-brand-green/15 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-brand-green" />
              </div>
              <span className="text-white/80 text-xs sm:text-sm font-medium">{label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
