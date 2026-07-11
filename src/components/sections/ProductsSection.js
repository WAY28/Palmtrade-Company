'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, Phone, ArrowRight, CheckCircle2, Package } from 'lucide-react'
import { placeholder, getWhatsAppLink } from '@/lib/utils'
import Reveal from '@/components/ui/Reveal'

const FLAG_MAP = { Thailand: '🇹🇭', China: '🇨🇳', India: '🇮🇳' }
const COLOR_MAP = {
  Thailand: 'from-blue-500 to-blue-700',
  China: 'from-red-500 to-red-700',
  India: 'from-orange-500 to-orange-700',
}

export default function ProductsSection({ products = [] }) {
  const t = useTranslations('products')
  const locale = useLocale()
  const [active, setActive] = useState(0)

  if (products.length === 0) {
    return (
      <section id="products" className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="badge-pill w-fit mx-auto">{t('badge')}</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-4">{t('title')}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t('subtitle')}</p>
          </div>
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Package size={48} className="mb-4 opacity-40" />
            <p className="text-lg font-medium">{t('emptyTitle')}</p>
            <p className="text-sm mt-1">{t('emptyHint')}</p>
          </div>
        </div>
      </section>
    )
  }

  const current = products[active]
  const flag = FLAG_MAP[current?.market] || '🌴'
  const accentColor = COLOR_MAP[current?.market] || 'from-brand-green to-brand-dark'

  // Build specs dari field Supabase
  const specs = []
  if (current?.quality) specs.push({ label: t('specQuality'), value: current.quality })
  if (current?.weight_range) specs.push({ label: t('specWeight'), value: current.weight_range })
  if (current?.color) specs.push({ label: t('specColor'), value: current.color })
  if (current?.husk_type) specs.push({ label: t('specHusk'), value: current.husk_type })
  if (current?.condition) specs.push({ label: t('specCondition'), value: current.condition })
  if (current?.packaging) specs.push({ label: t('specPackaging'), value: current.packaging })
  if (current?.capacity) specs.push({ label: t('specCapacity'), value: current.capacity })
  if (current?.price) specs.push({ label: t('specPrice'), value: current.price })

  return (
    <section id="products" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <Reveal direction="up" className="text-center mb-12">
          <div className="badge-pill w-fit mx-auto">{t('badge')}</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-4">{t('title')}</h2>
          <div className="accent-line mx-auto mb-4" />
          <p className="text-gray-500 max-w-2xl mx-auto">{t('subtitle')}</p>
        </Reveal>

        {/* Market tabs */}
        <Reveal direction="up" delay={0.1} className="flex flex-wrap justify-center gap-3 mb-10">
          {products.map((product, i) => (
            <button key={product.id || i} onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                active === i
                  ? 'bg-brand-green text-brand-dark shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-green hover:text-brand-dark'
              }`}>
              <span className="text-lg">{FLAG_MAP[product.market] || '🌴'}</span>
              {product.market}
            </button>
          ))}
        </Reveal>

        {/* Product detail */}
        <Reveal direction="up" delay={0.15} className="grid lg:grid-cols-2 gap-10 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          {/* Image */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
            <Image
              src={current.image_url || placeholder(600, 400, `${current.market}+Coconut`)}
              alt={`Coconut ${current.market}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-3xl">{flag}</span>
              <h3 className="text-white font-display font-bold text-2xl mt-1">{current.market}</h3>
              <p className="text-gray-300 text-sm">Semi Husked Coconut — Export Grade</p>
            </div>
          </div>

          {/* Specs */}
          <div className="p-8 flex flex-col">
            <h4 className="font-semibold text-brand-dark mb-4 text-sm uppercase tracking-wider">Specifications</h4>
            <table className="spec-table mb-6">
              <tbody>
                {specs.map(({ label, value }) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td className="text-gray-700">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Documents */}
            {current.documents?.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-brand-dark mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                  <FileText size={14} /> {t('documents')}
                </h4>
                <div className="flex flex-col gap-2">
                  {current.documents.map((doc) => (
                    <div key={doc} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={13} className="text-brand-green flex-shrink-0" />
                      {doc}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-auto">
              <a href={getWhatsAppLink(`Hello, I'm interested in coconut supply for ${current.market} market`)}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 bg-brand-green text-brand-dark font-bold px-5 py-3 rounded-full text-sm text-center hover:bg-brand-yellow btn-press flex items-center justify-center gap-2">
                <Phone size={15} /> {t('ctaContact')}
              </a>
              <Link href={`/${locale}/products/${current.id}`}
                className="border-2 border-brand-green text-brand-dark font-semibold px-5 py-3 rounded-full text-sm hover:bg-brand-green btn-press flex items-center gap-2">
                <ArrowRight size={15} /> Detail
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
