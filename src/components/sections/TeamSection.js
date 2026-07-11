import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { Users } from 'lucide-react'
import { placeholder } from '@/lib/utils'
import Reveal from '@/components/ui/Reveal'

export default function TeamSection({ team = [], standalone = false }) {
  const t = useTranslations('team')
  const locale = useLocale()

  return (
    <section id="team" className="section-padding bg-white bg-dots">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {!standalone && (
          <Reveal direction="up" className="text-center mb-12">
            <div className="badge-pill w-fit mx-auto">{t('badge')}</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-4">{t('title')}</h2>
            <div className="accent-line mx-auto mb-4" />
            <p className="text-gray-500 max-w-xl mx-auto">{t('subtitle')}</p>
          </Reveal>
        )}

        {team.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Users size={48} className="mb-4 opacity-40" />
            <p className="text-lg font-medium">{t('emptyTitle')}</p>
            <p className="text-sm mt-1">{t('emptyHint')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <Reveal key={member.id} direction="up" delay={Math.min(i, 3) * 0.08}>
              <div className="group text-center card-hover">
                <div className="relative mx-auto w-36 h-36 rounded-full overflow-hidden mb-4 ring-4 ring-gray-100 group-hover:ring-brand-green transition-all">
                  <Image src={member.photo_url || placeholder(300, 300, member.name)} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="font-semibold text-brand-dark mb-1">{member.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{locale === 'id' ? member.role_id : member.role_en}</p>
                {member.social_url && (
                  <a href={member.social_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-brand-green hover:text-brand-dark transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                )}
              </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
