'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, User, LogOut, Loader2, Menu } from 'lucide-react'

export default function AdminHeader({ onMenuClick = () => {} }) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch {
      setLoggingOut(false)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="lg:hidden w-9 h-9 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand-light transition-colors" aria-label="Open menu">
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <p className="text-xs text-gray-400 uppercase tracking-wider truncate">PT Palm Trade Company</p>
          <p className="text-gray-800 font-semibold text-sm">Admin Dashboard</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand-light transition-colors">
          <Bell size={16} />
        </button>
        <div className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center">
          <User size={16} className="text-brand-dark" />
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          title="Logout"
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors disabled:opacity-60"
        >
          {loggingOut
            ? <Loader2 size={16} className="animate-spin" />
            : <LogOut size={16} />
          }
        </button>
      </div>
    </header>
  )
}
