'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Images, Newspaper,
  Users, MessageSquare, Leaf, ExternalLink, Settings, X
} from 'lucide-react'

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/gallery', label: 'Gallery', icon: Images },
  { href: '/admin/news', label: 'News / Posts', icon: Newspaper },
  { href: '/admin/team', label: 'Our Team', icon: Users },
  { href: '/admin/contacts', label: 'Messages', icon: MessageSquare },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
]

export default function AdminSidebar({ open = false, onClose = () => {} }) {
  const pathname = usePathname()
  const isActive = (link) => link.exact ? pathname === link.href : pathname.startsWith(link.href)

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-brand-darker border-r border-white/10 flex flex-col min-h-screen flex-shrink-0 transform transition-transform duration-300 lg:static lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center">
              <Leaf size={16} className="text-brand-dark" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Putri Palma</p>
              <p className="text-brand-green text-[10px] uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white p-1" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {LINKS.map((link) => {
            const Icon = link.icon
            const active = isActive(link)
            return (
              <Link key={link.href} href={link.href} onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active ? 'bg-brand-green text-brand-dark' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}>
                <Icon size={17} />
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-3 pb-6">
          <Link href="/id" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-white/10 transition-all">
            <ExternalLink size={16} /> View Website
          </Link>
        </div>
      </aside>
    </>
  )
}
