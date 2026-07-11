import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, Newspaper } from 'lucide-react'
import { placeholder, formatDate, truncate } from '@/lib/utils'
import Reveal from '@/components/ui/Reveal'

export default function NewsSection({ posts = [] }) {
  const t = useTranslations('news')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  return (
    <section id="news" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal direction="up" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="badge-pill w-fit">{t('badge')}</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-3">{t('title')}</h2>
            <div className="accent-line" />
          </div>
          {posts.length > 0 && (
            <Link href={`/${locale}/news`}
              className="inline-flex items-center gap-2 text-brand-muted font-semibold text-sm hover:text-brand-dark transition-colors flex-shrink-0">
              {tCommon('seeAll')} <ArrowRight size={15} />
            </Link>
          )}
        </Reveal>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Newspaper size={48} className="mb-4 opacity-40" />
            <p className="text-lg font-medium">{t('emptyTitle')}</p>
            <p className="text-sm mt-1">{t('emptyHint')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.slice(0, 3).map((post, i) => {
              const title = locale === 'id' ? post.title_id : post.title_en
              const excerpt = locale === 'id' ? post.excerpt_id : post.excerpt_en
              return (
                <Reveal key={post.id} direction="up" delay={i * 0.1}>
                <Link href={`/${locale}/news/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover block">
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={post.image_url || placeholder(600, 400, 'News')} alt={title} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
