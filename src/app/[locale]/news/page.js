import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight, Newspaper } from 'lucide-react'
import { createAdminClient } from '@/lib/supabaseServer'
import { placeholder, formatDate, truncate } from '@/lib/utils'

export const revalidate = 60
export const metadata = { title: 'News | PT Palm Trade Company' }

export default async function NewsPage({ params }) {
  const { locale } = await params
  const t = await getTranslations('news')
  let posts = []
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('posts')
      .select('id,slug,title_id,title_en,excerpt_id,excerpt_en,image_url,created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    posts = data || []
  } catch {}

  return (
    <>
      <section className="relative py-32 bg-brand-darker overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src={placeholder(1920, 600, 'News+Hero')} alt="" fill className="object-cover" />
        </div>
        <div className="glow-orb w-96 h-96 bg-brand-green/15 -top-24 -right-24" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="badge-pill w-fit mx-auto anim-rise">{t('badge')}</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-2 anim-rise anim-delay-1">{t('title')}</h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto anim-rise anim-delay-2">{t('subtitle')}</p>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Newspaper size={48} className="mb-4 opacity-40" />
              <p className="text-lg font-medium">{t('emptyTitlePage')}</p>
              <p className="text-sm mt-1">{t('emptyHintPage')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((post) => {
                const title = locale === 'id' ? post.title_id : post.title_en
                const excerpt = locale === 'id' ? post.excerpt_id : post.excerpt_en
                return (
                  <Link key={post.id} href={`/${locale}/news/${post.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover block">
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={post.image_url || placeholder(600, 400, 'News')} alt={title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                        <Calendar size={12} />
                        {formatDate(post.created_at, locale)}
                      </div>
                      <h3 className="font-display font-bold text-brand-dark text-lg leading-snug mb-3 line-clamp-2 group-hover:text-brand-muted transition-colors">
                        {title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">{truncate(excerpt, 100)}</p>
                      <span className="inline-flex items-center gap-1.5 text-brand-muted text-sm font-semibold group-hover:gap-2.5 transition-all">
                        {t('readMore')} <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
