export const revalidate = 60
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { CheckCircle2, Award, Users, TrendingUp, Leaf, Globe, Shield } from 'lucide-react'
import { placeholder } from '@/lib/utils'
import FaqSection from '@/components/sections/FaqSection'

export const metadata = { title: 'About Us | PT Putri Palma Nusantara' }

function AboutPage() {
  const t = useTranslations('about')

  const values = [
    { icon: Shield, title: 'Quality First', desc: 'Every coconut goes through strict quality inspection before shipment.' },
    { icon: Globe, title: 'Global Reach', desc: 'Serving buyers in Thailand, China, India and expanding to new markets.' },
    { icon: Users, title: 'Farmer Partnership', desc: 'We work directly with local farmers for stable and ethical sourcing.' },
    { icon: TrendingUp, title: 'Reliable Supply', desc: '± 2,800 tons per month production capacity ensuring consistent supply.' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative py-32 bg-brand-darker overflow-hidden">
        <div className="absolute inset-0">
          <Image src={placeholder(1920, 600, 'About+Hero')} alt="" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-darker/90 to-brand-darker/60" />
        </div>
        <div className="glow-orb w-96 h-96 bg-brand-green/15 -top-24 -right-24" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="badge-pill w-fit mx-auto anim-rise">{t('badge')}</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-2 anim-rise anim-delay-1">{t('title')}</h1>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
              <Image src={placeholder(800, 600, 'Company+Story')} alt="Our Story" fill className="object-cover" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-brand-dark mb-6">Our Story</h2>
              <div className="flex flex-col gap-4 text-gray-600 leading-relaxed">
                <p>{t('description1')}</p>
                <p>{t('description2')}</p>
                <p>{t('description3')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[t('feature1'), t('feature2'), t('feature3'), t('feature4')].map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-brand-green mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Data */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-widest">— {t('legalTitle')}</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-dark mt-2 mb-6">{t('legalTitle')}</h2>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {[
                  [t('legalName'), 'PT Putri Palma Nusantara'],
                  [t('legalType'), t('legalTypeValue')],
                  [t('legalProduct'), t('legalProductValue')],
                  [t('legalMarkets'), 'Thailand, China, India'],
                  [t('legalCapacity'), '± 2,800 Tons / Month'],
                  [t('legalStandard'), t('legalStandardValue')],
                ].map(([label, value], i) => (
                  <div key={label} className={`flex items-center justify-between gap-4 px-6 py-3.5 text-sm ${i % 2 === 0 ? 'bg-brand-light/30' : ''}`}>
                    <span className="text-gray-500 font-medium">{label}</span>
                    <span className="text-brand-dark font-semibold text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-widest">— {t('exportCountriesTitle')}</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-dark mt-2 mb-6">{t('exportCountriesTitle')}</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { flag: '🇹🇭', name: 'Thailand' },
                  { flag: '🇨🇳', name: 'China' },
                  { flag: '🇮🇳', name: 'India' },
                ].map((c) => (
                  <div key={c.name} className="bg-white rounded-2xl border border-gray-100 card-hover text-center py-6">
                    <span className="text-4xl block mb-2">{c.flag}</span>
                    <span className="text-sm font-semibold text-brand-dark">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 card-hover text-center">
                <div className="w-14 h-14 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-brand-muted" />
                </div>
                <h3 className="font-semibold text-brand-dark mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { val: '2,800+', label: t('stat1') },
              { val: '200+', label: t('stat2') },
              { val: '10+', label: t('stat3') },
              { val: '5+', label: t('stat4') },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-4xl font-bold text-brand-green">{val}</p>
                <p className="text-gray-400 text-sm mt-2">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />
    </>
  )
}

export default AboutPage
