import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { createAdminClient } from '@/lib/supabaseServer'
import { placeholder, getWhatsAppLink } from '@/lib/utils'
import {
  ArrowLeft, CheckCircle2, FileText, Phone,
  Package, Weight, Leaf, Box, Truck, DollarSign
} from 'lucide-react'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { id, locale } = await params
  const supabase = createAdminClient()
  const { data } = await supabase.from('products').select('market').eq('id', id).single()
  return { title: data ? `${data.market} Coconut | PT Putri Palma Nusantara` : 'Product Detail' }
}

const FLAG_MAP = { Thailand: '🇹🇭', China: '🇨🇳', India: '🇮🇳' }

const SPEC_ICONS = {
  quality:      { icon: CheckCircle2, labelKey: 'specQuality' },
  weight_range: { icon: Weight,       labelKey: 'specWeight' },
  color:        { icon: Leaf,         labelKey: 'specColor' },
  husk_type:    { icon: Leaf,         labelKey: 'specHusk' },
  condition:    { icon: Package,      labelKey: 'specCondition' },
  packaging:    { icon: Box,          labelKey: 'specPackaging' },
  capacity:     { icon: Truck,        labelKey: 'specCapacity' },
  price:        { icon: DollarSign,   labelKey: 'specPrice' },
}

export default async function ProductDetailPage({ params }) {
  const { id, locale } = await params
  const t = await getTranslations('products')
  const tNav = await getTranslations('nav')
  const supabase = createAdminClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  // Ambil produk lain untuk "Produk Terkait"
  const { data: others } = await supabase
    .from('products')
    .select('id, market, weight_range, image_url')
    .eq('is_active', true)
    .neq('id', id)
    .limit(2)

  const flag = FLAG_MAP[product.market] || '🌴'

  const specs = Object.entries(SPEC_ICONS)
    .filter(([key]) => product[key])
    .map(([key, meta]) => ({ ...meta, label: t(meta.labelKey), value: product[key] }))

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-sm text-gray-400">
          <Link href={`/${locale}`} className="hover:text-brand-dark transition-colors">{tNav('home')}</Link>
          <span>/</span>
          <Link href={`/${locale}/products`} className="hover:text-brand-dark transition-colors">{tNav('products')}</Link>
          <span>/</span>
          <span className="text-brand-dark font-medium">{product.market}</span>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">

            {/* Gambar */}
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[500px]">
              <Image
                src={product.image_url || placeholder(600, 500, `${product.market}+Coconut`)}
                alt={`${product.market} Coconut`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-4xl">{flag}</span>
                <h1 className="text-white font-display font-bold text-3xl mt-2">
                  {product.market} Market
                </h1>
                <p className="text-gray-300 text-sm mt-1">{t('exportGradeLabel')}</p>
              </div>
              {/* Badge */}
              <div className="absolute top-6 right-6 bg-brand-green text-brand-dark text-xs font-bold px-3 py-1.5 rounded-full">
                {t('exportReady')}
              </div>
            </div>

            {/* Detail */}
            <div className="p-8 flex flex-col">
              {/* Back */}
              <Link href={`/${locale}/products`}
                className="inline-flex items-center gap-1.5 text-gray-400 hover:text-brand-dark text-sm mb-6 transition-colors w-fit">
                <ArrowLeft size={15} /> {t('backToProducts')}
              </Link>

              {/* Spesifikasi */}
              <h2 className="font-semibold text-brand-dark text-sm uppercase tracking-wider mb-4">
                {t('specsTitle')}
              </h2>
              <div className="flex flex-col gap-3 mb-8">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <div className="w-7 h-7 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={13} className="text-brand-muted" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="text-gray-800 text-sm font-medium mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dokumen */}
              {product.documents?.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-semibold text-brand-dark text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText size={14} /> {t('documents')}
                  </h2>
                  <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                    {product.documents.map((doc) => (
                      <div key={doc} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={13} className="text-brand-green flex-shrink-0" />
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detail Information */}
              <div className="mb-8">
                <h2 className="font-semibold text-brand-dark text-sm uppercase tracking-wider mb-3">
                  {t('detailInfoTitle')}
                </h2>
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  {[
                    [t('moqLabel'), t('moqValue')],
                    [t('paymentLabel'), t('paymentValue')],
                    [t('shipmentLabel'), t('shipmentValue')],
                    [t('specCapacity'), product.capacity],
                  ].filter(([, v]) => v).map(([label, value], i) => (
                    <div key={label} className={`flex items-center justify-between gap-4 px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-gray-50' : ''}`}>
                      <span className="text-gray-500">{label}</span>
                      <span className="text-brand-dark font-semibold text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <a
                  href={getWhatsAppLink(`Hello, I'm interested in coconut supply for ${product.market} market. Product ID: ${product.id}`)}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 bg-brand-green text-brand-dark font-bold px-5 py-3.5 rounded-full text-sm text-center hover:bg-brand-yellow transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={15} /> {t('whatsappCta')}
                </a>
                <Link href={`/${locale}/contact`}
                  className="flex-1 border-2 border-brand-green text-brand-dark font-semibold px-5 py-3.5 rounded-full text-sm text-center hover:bg-brand-green transition-all">
                  {t('requestQuote')}
                </Link>
              </div>
            </div>
          </div>

          {/* Produk Terkait */}
          {others && others.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-6">{t('otherProducts')}</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {others.map((p) => (
                  <Link key={p.id} href={`/${locale}/products/${p.id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all flex gap-4 p-4 items-center">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={p.image_url || placeholder(200, 200, p.market)}
                        alt={p.market} fill className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">{FLAG_MAP[p.market] || '🌴'} {p.market} Market</p>
                      <p className="font-semibold text-brand-dark text-sm">{p.weight_range}</p>
                      <p className="text-brand-muted text-xs mt-1 font-medium">{t('viewDetail')} →</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back button */}
          <div className="mt-10 text-center">
            <Link href={`/${locale}/products`}
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-6 py-3 rounded-full text-sm hover:border-brand-green hover:text-brand-dark transition-all">
              <ArrowLeft size={15} /> {t('viewAll')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
