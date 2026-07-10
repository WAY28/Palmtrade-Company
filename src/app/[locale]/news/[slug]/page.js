import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowLeft } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabaseServer'
import { placeholder, formatDate } from '@/lib/utils'

export default async function NewsDetailPage({ params }) {
  const { locale, slug } = await params
  const t = await getTranslations('news')

  let post = null
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    post = data
  } catch {}

  if (!post) notFound()

  const title = locale === 'id' ? post.title_id : post.title_en
  const content = locale === 'id' ? post.content_id : post.content_en

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-16 bg-brand-darker">
        <div className="absolute inset-0">
          <Image src={post.image_url || placeholder(1200, 600)} alt={title} fill className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-darker/80 to-brand-darker/95" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-4">
            <Calendar size={13} />
            {t('publishedOn')} {formatDate(post.created_at, locale)}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">{title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 text-brand-muted text-sm font-medium mb-10 hover:text-brand-dark transition-colors"
          >
            <ArrowLeft size={15} />
            {t('backToNews')}
          </Link>

          <div className="relative aspect-video rounded-2xl overflow-hidden mb-10">
            <Image src={post.image_url || placeholder(800, 450)} alt={title} fill className="object-cover" />
          </div>

          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            style={{ lineHeight: '1.8' }}
            dangerouslySetInnerHTML={{ __html: content || '<p>Content coming soon.</p>' }}
          />
        </div>
      </section>
    </>
  )
}
