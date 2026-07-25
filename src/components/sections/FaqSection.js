'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

function FaqItem({ question, answer, open, onClick }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold text-brand-dark text-sm">{question}</span>
        <ChevronDown
          size={18}
          className={`text-brand-muted flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-gray-500 text-sm leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function FaqSection() {
  const t = useTranslations('faq')
  const [openIndex, setOpenIndex] = useState(0)

  const items = Array.from({ length: 8 }, (_, i) => ({
    q: t(`q${i + 1}`),
    a: t(`a${i + 1}`),
  }))

  const left = items.slice(0, 4)
  const right = items.slice(4)

  return (
    <section className="section-padding bg-white bg-dots">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal direction="up" className="text-center mb-12">
          <div className="badge-pill w-fit mx-auto">{t('badge')}</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-4">{t('title')}</h2>
          <div className="accent-line mx-auto" />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            {left.map((item, i) => (
              <FaqItem
                key={i}
                question={item.q}
                answer={item.a}
                open={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {right.map((item, i) => {
              const idx = i + 4
              return (
                <FaqItem
                  key={idx}
                  question={item.q}
                  answer={item.a}
                  open={openIndex === idx}
                  onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
