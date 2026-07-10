'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, Eye, EyeOff, Loader2, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login gagal. Periksa email dan password.')
        return
      }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1f04] via-[#1a2e05] to-[#0f1f04] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#a4dc4a]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#a4dc4a]/5 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#a4dc4a] flex items-center justify-center mb-4 shadow-lg shadow-[#a4dc4a]/20">
              <Leaf size={26} className="text-[#1a2e05]" />
            </div>
            <h1 className="text-white text-xl font-bold tracking-tight">Palm Trade Admin</h1>
            <p className="text-gray-400 text-sm mt-1">Masuk ke panel manajemen</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                <Lock size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@palmtrade.com" required
                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#a4dc4a]/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-[#a4dc4a]/50 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="mt-2 w-full bg-[#a4dc4a] text-[#1a2e05] font-bold py-3 rounded-xl text-sm hover:bg-[#b8e85c] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Masuk...</> : 'Masuk ke Dashboard'}
            </button>
          </form>
          <p className="text-center text-gray-600 text-xs mt-6">PT Palm Trade Company © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
