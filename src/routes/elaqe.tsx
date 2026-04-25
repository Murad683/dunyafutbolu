import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { clsx } from "clsx";
import { Layout } from "@/components/layout/Layout";

export const Route = createFileRoute("/elaqe")({
  head: () => ({
    meta: [
      { title: "Əlaqə | Dünya Futbolu" },
      { name: "description", content: "Dünya Futbolu portalı ilə əlaqə saxlayın. Təkliflərinizi və fikirlərinizi bizimlə bölüşün." },
    ],
  }),
  component: ElaqePage,
});

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "#", color: "#1877F2" },
  { icon: Instagram, label: "Instagram", href: "#", color: "#E4405F" },
  { icon: Youtube, label: "YouTube", href: "#", color: "#FF0000" },
  { icon: MessageCircle, label: "Telegram", href: "#", color: "#26A5E4" },
];

function ElaqePage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B0000] to-[#a30000] rounded-card mb-8 overflow-hidden">
          <div className="py-8 px-6 md:px-10 flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 shrink-0">
              <Mail size={24} className="text-white" aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Bizimlə Əlaqə</h1>
              <p className="text-white/70 text-sm mt-0.5">Suallarınız və təklifləriniz üçün bizimlə əlaqə saxlayın</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* LEFT — form */}
          <div>
            <div className="bg-surface-white rounded-card border border-surface-border/50 shadow-card p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-1">Mesaj göndər</h2>
              <p className="text-sm text-text-muted mb-6">Bütün sahələri doldurun və biz 24 saat ərzində cavab verəcəyik.</p>

              {sent && (
                <div className="mb-6 px-4 py-3 rounded-card bg-green-50 border border-green-200 text-sm text-green-700 font-medium animate-slide-down">
                  ✓ Mesajınız uğurla göndərildi! Tezliklə sizinlə əlaqə saxlayacağıq.
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1.5">Ad, Soyad</label>
                    <input id="name" type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Adınızı daxil edin" className="w-full h-11 px-4 rounded-input border border-surface-border bg-surface-off text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-red focus:bg-surface-white transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">E-poçt</label>
                    <input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@nümunə.az" className="w-full h-11 px-4 rounded-input border border-surface-border bg-surface-off text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-red focus:bg-surface-white transition-colors" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-1.5">Mövzu</label>
                  <input id="subject" type="text" required value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Mövzunu qeyd edin" className="w-full h-11 px-4 rounded-input border border-surface-border bg-surface-off text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-red focus:bg-surface-white transition-colors" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-1.5">Mesaj</label>
                  <textarea id="message" required rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Mesajınızı yazın..." className="w-full px-4 py-3 rounded-input border border-surface-border bg-surface-off text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-red focus:bg-surface-white transition-colors resize-none" />
                </div>
                <button type="submit" className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-button bg-brand-red text-white font-medium text-sm hover:bg-brand-red-hover transition-colors shadow-sm">
                  <Send size={16} aria-hidden />
                  Göndər
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT — info */}
          <div className="flex flex-col gap-5">
            {/* Contact Info */}
            <div className="bg-surface-white rounded-card border border-surface-border/50 shadow-card p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">Əlaqə Məlumatları</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-red/10 shrink-0">
                    <Mail size={16} className="text-brand-red" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">E-poçt</p>
                    <a href="mailto:info@dunyafutbolu.az" className="text-sm text-brand-red hover:underline">info@dunyafutbolu.az</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-red/10 shrink-0">
                    <Phone size={16} className="text-brand-red" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Telefon</p>
                    <a href="tel:+994501234567" className="text-sm text-text-secondary">+994 50 123 45 67</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-red/10 shrink-0">
                    <MapPin size={16} className="text-brand-red" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Ünvan</p>
                    <p className="text-sm text-text-secondary">Bakı şəhəri, Nəsimi rayonu</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-surface-white rounded-card border border-surface-border/50 shadow-card p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">Sosial Şəbəkələr</h3>
              <div className="grid grid-cols-2 gap-3">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-4 py-3 rounded-card bg-surface-off hover:bg-surface-light border border-surface-border/50 transition-colors group">
                    <s.icon size={18} style={{ color: s.color }} aria-hidden />
                    <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-surface-off rounded-card border border-surface-border/50 overflow-hidden">
              <div className="h-[200px] bg-gradient-to-br from-surface-light to-surface-off flex flex-col items-center justify-center gap-2">
                <MapPin size={32} className="text-text-muted" aria-hidden />
                <span className="text-sm font-medium text-text-muted">Xəritə</span>
                <span className="text-xs text-text-muted/60">Bakı, Azərbaycan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
