import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabaseServer'
import { placeholder, getWhatsAppLink } from '@/lib/utils'
import { ArrowRight, Phone, Package } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

export const revalidate = 60
export const metadata = { title: 'Products | PT Putri Palma Nusantara' }

const FLAG_MAP = { Thailand: '🇹🇭', China: '🇨🇳', India: '🇮🇳' }

export default async function ProductsPage({ params }) {
  const { locale } = await params
  const t = await getTranslations('products')
  let products = []
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('products').select('*').eq('is_active', true).order('sort_order')
    products = data || []
  } catch {}

  return (
    <>
      {/* Hero */}
      <section className="relative py-32 bg-brand-darker overflow-hidden">
        <div className="absolute inset-0">
          <Image src={placeholder(1920, 600, 'Coconut+Products')} alt="" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-darker/90 to-transparent" />
        </div>
        <div className="glow-orb w-96 h-96 bg-brand-green/15 -top-24 -right-24" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="badge-pill w-fit mx-auto anim-rise">{t('badge')}</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-2 anim-rise anim-delay-1">{t('title')}</h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto anim-rise anim-delay-2">{t('subtitle')}</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Package size={48} className="mb-4 opacity-40" />
              <p className="text-lg font-medium">{t('emptyTitle')}</p>
              <p className="text-sm mt-1">{t('emptyHint')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, i) => (
                <Reveal key={product.id} direction="up" delay={Math.min(i % 3, 2) * 0.1}>
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 card-hover group flex flex-col h-full">
                  {/* Image */}
                  <Link href={`/${locale}/products/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.image_url || placeholder(600, 400, `${product.market}+Coconut`)}
                      alt={product.market} fill className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-2xl">{FLAG_MAP[product.market] || '🌴'}</span>
                      <p className="text-white font-display font-bold text-xl mt-1">{product.market}</p>
                    </div>
                    <div className="absolute top-4 right-4 bg-brand-green text-brand-dark text-xs font-bold px-3 py-1 rounded-full">
                      {t('exportReady')}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-col gap-1.5 mb-5 flex-1">
                      {product.weight_range && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{t('specWeight')}</span>
                          <span className="font-medium text-gray-700">{product.weight_range}</span>
                        </div>
                      )}
                      {product.husk_type && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{t('specHusk')}</span>
                          <span className="font-medium text-gray-700">{product.husk_type}</span>
                        </div>
                      )}
                      {product.capacity && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{t('specCapacity')}</span>
                          <span className="font-medium text-gray-700">{product.capacity}</span>
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="flex gap-2">
                      <Link href={`/${locale}/products/${product.id}`}
                        className="flex-1 border border-brand-green text-brand-dark font-semibold px-4 py-2.5 rounded-full text-sm text-center hover:bg-brand-green transition-all flex items-center justify-center gap-1.5">
                        <ArrowRight size={14} /> {t('detail')}
                      </Link>
                      <a href={getWhatsAppLink(`Hello, I'm interested in coconut for ${product.market} market`)}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 bg-brand-green text-brand-dark font-bold px-4 py-2.5 rounded-full text-sm text-center hover:bg-brand-yellow transition-all flex items-center justify-center gap-1.5">
                        <Phone size={14} /> {t('contactBtn')}
                      </a>
                    </div>
                  </div>
                </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
