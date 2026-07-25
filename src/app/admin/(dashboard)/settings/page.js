'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Home, Info, Package, Images, Newspaper,
  Users, Phone, Save, Loader2, CheckCircle2,
  MessageCircle, Globe, ChevronDown, ChevronUp
} from 'lucide-react'

// ── Komponen Field ──────────────────────────────────────────
function Field({ label, name, value, onChange, type = 'text', placeholder, hint }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name} value={value || ''} onChange={onChange} placeholder={placeholder} rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-green resize-none"
        />
      ) : (
        <input
          type={type} name={name} value={value || ''} onChange={onChange} placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-green"
        />
      )}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

// ── Komponen Section Card ───────────────────────────────────
function SectionCard({ icon: Icon, title, color = 'green', children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            color === 'green' ? 'bg-brand-light text-brand-muted' :
            color === 'blue' ? 'bg-blue-50 text-blue-600' :
            color === 'orange' ? 'bg-orange-50 text-orange-600' :
            color === 'purple' ? 'bg-purple-50 text-purple-600' :
            color === 'red' ? 'bg-red-50 text-red-500' :
            'bg-gray-100 text-gray-600'
          }`}>
            <Icon size={16} />
          </div>
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-50">{children}</div>}
    </div>
  )
}

// ── Halaman Utama ───────────────────────────────────────────
export default function SettingsPage() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => { setSettings(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handle = useCallback((e) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 size={28} className="animate-spin text-brand-green" />
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengaturan Website</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola konten semua halaman & tombol WhatsApp</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-brand-green text-brand-dark font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-brand-yellow transition-all disabled:opacity-60">
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
          {saving ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan Semua'}
        </button>
      </div>

      <div className="flex flex-col gap-4">

        {/* ── WhatsApp Button ── */}
        <SectionCard icon={MessageCircle} title="Tombol WhatsApp" color="green" defaultOpen={true}>
          <Field label="Nomor WhatsApp" name="wa_number" value={settings.wa_number} onChange={handle}
            placeholder="6282293807717" hint="Format: 62xxxxxxxxxx (tanpa + atau spasi)" />
          <Field label="Pesan Default" name="wa_message" value={settings.wa_message} onChange={handle}
            placeholder="Halo, saya ingin menanyakan produk kelapa Anda." />
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tampilkan Tombol WA</label>
            <select name="wa_show" value={settings.wa_show || 'true'} onChange={handle}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-brand-green">
              <option value="true">Ya — Tampilkan</option>
              <option value="false">Tidak — Sembunyikan</option>
            </select>
          </div>
        </SectionCard>

        {/* ── Beranda ── */}
        <SectionCard icon={Home} title="Beranda (Hero)" color="green">
          <Field label="Badge" name="hero_badge" value={settings.hero_badge} onChange={handle} placeholder="Trusted Coconut Exporter" />
          <Field label="Judul Utama (ID)" name="hero_title_id" value={settings.hero_title_id} onChange={handle} placeholder="Ekspor Kelapa Premium" />
          <Field label="Judul Utama (EN)" name="hero_title_en" value={settings.hero_title_en} onChange={handle} placeholder="Premium Coconut Export" />
          <Field label="Kata Kunci / Highlight (ID)" name="hero_highlight_id" value={settings.hero_highlight_id} onChange={handle} placeholder="Berkualitas Tinggi" />
          <Field label="Kata Kunci / Highlight (EN)" name="hero_highlight_en" value={settings.hero_highlight_en} onChange={handle} placeholder="High Quality" />
          <Field label="Subjudul (ID)" name="hero_subtitle_id" value={settings.hero_subtitle_id} onChange={handle} type="textarea"
            placeholder="Kami mengekspor kelapa terbaik Indonesia..." />
          <Field label="Subjudul (EN)" name="hero_subtitle_en" value={settings.hero_subtitle_en} onChange={handle} type="textarea"
            placeholder="We export the finest Indonesian coconuts..." />
          <Field label="Teks Tombol Utama (ID)" name="hero_cta_primary_id" value={settings.hero_cta_primary_id} onChange={handle} placeholder="Lihat Produk" />
          <Field label="Teks Tombol Utama (EN)" name="hero_cta_primary_en" value={settings.hero_cta_primary_en} onChange={handle} placeholder="View Products" />
          <Field label="Statistik 1 (contoh: 2800+)" name="hero_stat1_value" value={settings.hero_stat1_value} onChange={handle} placeholder="2,800+" />
          <Field label="Label Stat 1 (ID)" name="hero_stat1_label_id" value={settings.hero_stat1_label_id} onChange={handle} placeholder="Ton per Bulan" />
          <Field label="Statistik 2 (contoh: 3)" name="hero_stat2_value" value={settings.hero_stat2_value} onChange={handle} placeholder="3" />
          <Field label="Label Stat 2 (ID)" name="hero_stat2_label_id" value={settings.hero_stat2_label_id} onChange={handle} placeholder="Negara Tujuan" />
          <Field label="Statistik 3 (contoh: 5+)" name="hero_stat3_value" value={settings.hero_stat3_value} onChange={handle} placeholder="5+" />
          <Field label="Label Stat 3 (ID)" name="hero_stat3_label_id" value={settings.hero_stat3_label_id} onChange={handle} placeholder="Tahun Pengalaman" />
        </SectionCard>

        {/* ── Tentang Kami ── */}
        <SectionCard icon={Info} title="Tentang Kami" color="blue">
          <Field label="Judul (ID)" name="about_title_id" value={settings.about_title_id} onChange={handle} placeholder="Tentang PT Putri Palma Nusantara" />
          <Field label="Judul (EN)" name="about_title_en" value={settings.about_title_en} onChange={handle} placeholder="About PT Putri Palma Nusantara" />
          <Field label="Deskripsi (ID)" name="about_desc_id" value={settings.about_desc_id} onChange={handle} type="textarea"
            placeholder="PT Putri Palma Nusantara adalah eksportir kelapa..." />
          <Field label="Deskripsi (EN)" name="about_desc_en" value={settings.about_desc_en} onChange={handle} type="textarea"
            placeholder="PT Putri Palma Nusantara is a coconut exporter..." />
          <Field label="Stat 1 — Nilai" name="about_stat1_value" value={settings.about_stat1_value} onChange={handle} placeholder="50+" />
          <Field label="Stat 1 — Label (ID)" name="about_stat1_label_id" value={settings.about_stat1_label_id} onChange={handle} placeholder="Mitra Bisnis" />
          <Field label="Stat 2 — Nilai" name="about_stat2_value" value={settings.about_stat2_value} onChange={handle} placeholder="200+" />
          <Field label="Stat 2 — Label (ID)" name="about_stat2_label_id" value={settings.about_stat2_label_id} onChange={handle} placeholder="Kontainer Diekspor" />
          <Field label="Stat 3 — Nilai" name="about_stat3_value" value={settings.about_stat3_value} onChange={handle} placeholder="10+" />
          <Field label="Stat 3 — Label (ID)" name="about_stat3_label_id" value={settings.about_stat3_label_id} onChange={handle} placeholder="Negara Mitra" />
          <Field label="Stat 4 — Nilai" name="about_stat4_value" value={settings.about_stat4_value} onChange={handle} placeholder="5+" />
          <Field label="Stat 4 — Label (ID)" name="about_stat4_label_id" value={settings.about_stat4_label_id} onChange={handle} placeholder="Tahun Berpengalaman" />
        </SectionCard>

        {/* ── Produk ── */}
        <SectionCard icon={Package} title="Produk" color="orange">
          <Field label="Badge" name="products_badge" value={settings.products_badge} onChange={handle} placeholder="Our Products" />
          <Field label="Judul (ID)" name="products_title_id" value={settings.products_title_id} onChange={handle} placeholder="Produk Unggulan Kami" />
          <Field label="Judul (EN)" name="products_title_en" value={settings.products_title_en} onChange={handle} placeholder="Our Featured Products" />
          <Field label="Subjudul (ID)" name="products_subtitle_id" value={settings.products_subtitle_id} onChange={handle} type="textarea"
            placeholder="Kelapa semi-husked berkualitas ekspor..." />
          <Field label="Subjudul (EN)" name="products_subtitle_en" value={settings.products_subtitle_en} onChange={handle} type="textarea"
            placeholder="Export-quality semi-husked coconuts..." />
        </SectionCard>

        {/* ── Galeri ── */}
        <SectionCard icon={Images} title="Galeri" color="purple">
          <Field label="Badge" name="gallery_badge" value={settings.gallery_badge} onChange={handle} placeholder="Photo Gallery" />
          <Field label="Judul (ID)" name="gallery_title_id" value={settings.gallery_title_id} onChange={handle} placeholder="Galeri Foto" />
          <Field label="Judul (EN)" name="gallery_title_en" value={settings.gallery_title_en} onChange={handle} placeholder="Photo Gallery" />
          <Field label="Subjudul (ID)" name="gallery_subtitle_id" value={settings.gallery_subtitle_id} onChange={handle} type="textarea"
            placeholder="Dokumentasi kegiatan dan produk kami..." />
          <Field label="Subjudul (EN)" name="gallery_subtitle_en" value={settings.gallery_subtitle_en} onChange={handle} type="textarea"
            placeholder="Documentation of our activities and products..." />
        </SectionCard>

        {/* ── Berita ── */}
        <SectionCard icon={Newspaper} title="Berita / Artikel" color="blue">
          <Field label="Badge" name="news_badge" value={settings.news_badge} onChange={handle} placeholder="Latest News" />
          <Field label="Judul (ID)" name="news_title_id" value={settings.news_title_id} onChange={handle} placeholder="Berita Terbaru" />
          <Field label="Judul (EN)" name="news_title_en" value={settings.news_title_en} onChange={handle} placeholder="Latest News" />
          <Field label="Subjudul (ID)" name="news_subtitle_id" value={settings.news_subtitle_id} onChange={handle} type="textarea" />
          <Field label="Subjudul (EN)" name="news_subtitle_en" value={settings.news_subtitle_en} onChange={handle} type="textarea" />
        </SectionCard>

        {/* ── Tim ── */}
        <SectionCard icon={Users} title="Tim Kami" color="green">
          <Field label="Badge" name="team_badge" value={settings.team_badge} onChange={handle} placeholder="Our Team" />
          <Field label="Judul (ID)" name="team_title_id" value={settings.team_title_id} onChange={handle} placeholder="Tim Kami" />
          <Field label="Judul (EN)" name="team_title_en" value={settings.team_title_en} onChange={handle} placeholder="Our Team" />
          <Field label="Subjudul (ID)" name="team_subtitle_id" value={settings.team_subtitle_id} onChange={handle} type="textarea" />
          <Field label="Subjudul (EN)" name="team_subtitle_en" value={settings.team_subtitle_en} onChange={handle} type="textarea" />
        </SectionCard>

        {/* ── Hubungi Kami ── */}
        <SectionCard icon={Phone} title="Hubungi Kami" color="red">
          <Field label="Judul (ID)" name="contact_title_id" value={settings.contact_title_id} onChange={handle} placeholder="Hubungi Kami" />
          <Field label="Judul (EN)" name="contact_title_en" value={settings.contact_title_en} onChange={handle} placeholder="Contact Us" />
          <Field label="Nomor Telepon" name="contact_phone" value={settings.contact_phone} onChange={handle} placeholder="+62 822-9380-7717" />
          <Field label="Email" name="contact_email" value={settings.contact_email} onChange={handle} placeholder="info@palmtrade.com" type="email" />
          <Field label="Alamat (ID)" name="contact_address_id" value={settings.contact_address_id} onChange={handle} type="textarea"
            placeholder="Jl. Contoh No. 123, Sulawesi Selatan" />
          <Field label="Alamat (EN)" name="contact_address_en" value={settings.contact_address_en} onChange={handle} type="textarea"
            placeholder="Jl. Contoh No. 123, South Sulawesi, Indonesia" />
        </SectionCard>

        {/* ── SEO / Global ── */}
        <SectionCard icon={Globe} title="SEO & Info Global" color="blue">
          <Field label="Nama Perusahaan" name="company_name" value={settings.company_name} onChange={handle} placeholder="PT Putri Palma Nusantara" />
          <Field label="Tagline (ID)" name="company_tagline_id" value={settings.company_tagline_id} onChange={handle} placeholder="Eksportir Kelapa Terpercaya" />
          <Field label="Tagline (EN)" name="company_tagline_en" value={settings.company_tagline_en} onChange={handle} placeholder="Trusted Coconut Exporter" />
          <Field label="Meta Description (ID)" name="meta_desc_id" value={settings.meta_desc_id} onChange={handle} type="textarea" />
          <Field label="Meta Description (EN)" name="meta_desc_en" value={settings.meta_desc_en} onChange={handle} type="textarea" />
        </SectionCard>

      </div>

      {/* Floating Save */}
      <div className="sticky bottom-6 flex justify-end mt-6">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-brand-dark text-white font-bold px-7 py-3 rounded-2xl text-sm shadow-xl hover:bg-brand-darker transition-all disabled:opacity-60">
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle2 size={15} className="text-brand-green" /> : <Save size={15} />}
          {saving ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan Semua Perubahan'}
        </button>
      </div>
    </div>
  )
}
