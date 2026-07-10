'use client'

import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton({ number, message }) {
  if (!number) return null

  const encoded = encodeURIComponent(message || 'Halo, saya ingin menanyakan produk kelapa Anda.')
  const url = `https://wa.me/${number.replace(/\D/g, '')}?text=${encoded}`

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Chat WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3">
      {/* Tooltip */}
      <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-brand-darker text-white text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg translate-x-2 group-hover:translate-x-0">
        Chat WhatsApp
      </span>
      {/* Button */}
      <div className="w-14 h-14 rounded-full bg-[#25D366] shadow-xl shadow-[#25D366]/30 flex items-center justify-center
        hover:scale-110 active:scale-95 transition-transform duration-200">
        {/* Pulse ring */}
        <span className="absolute w-14 h-14 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <MessageCircle size={26} className="text-white relative z-10" fill="white" />
      </div>
    </a>
  )
}
