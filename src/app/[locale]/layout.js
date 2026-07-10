import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import PageTransition from '@/components/ui/PageTransition'
import { getSiteSettings } from '@/lib/siteSettings'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()

  const [messages, settings] = await Promise.all([
    getMessages({ locale }),
    getSiteSettings(),
  ])

  const showWa = settings.wa_show !== 'false'

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <PageTransition />
      <Navbar />
      <main>{children}</main>
      <Footer />
      {showWa && (
        <WhatsAppButton
          number={settings.wa_number || '6282293807717'}
          message={settings.wa_message}
        />
      )}
    </NextIntlClientProvider>
  )
}
