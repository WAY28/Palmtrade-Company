export const revalidate = 60
import { getTranslations } from 'next-intl/server'
import ContactSection from '@/components/sections/ContactSection'
import Image from 'next/image'
import { placeholder } from '@/lib/utils'

export const metadata = { title: 'Contact Us | PT Putri Palma Nusantara' }

export default async function ContactPage() {
  const t = await getTranslations('contact')
  return (
    <>
      <section className="relative py-32 bg-brand-darker overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src={placeholder(1920, 600, 'Contact+Hero')} alt="" fill className="object-cover" />
        </div>
        <div className="glow-orb w-96 h-96 bg-brand-green/15 -top-24 -right-24" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="badge-pill w-fit mx-auto anim-rise">{t('badge')}</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-2 anim-rise anim-delay-1">{t('title')}</h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto anim-rise anim-delay-2">{t('subtitle')}</p>
        </div>
      </section>
      <ContactSection standalone />
    </>
  )
}
