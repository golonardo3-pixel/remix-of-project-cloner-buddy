import { VariationLayoutProps } from "./VariationShared";
import { MessageCircle, MapPin, Phone, Star, ChevronRight, Instagram } from "lucide-react";

/**
 * MODERNO — Clean landing page style
 * Structure: Sticky CTA bar → Full-bleed hero → Horizontal benefits strip →
 * Services in 3-col cards → Testimonials carousel-style → Contact CTA → Minimal footer
 */
const ModernoLayout = (p: VariationLayoutProps) => {
  const accent = `hsl(${p.colors.accent})`;
  const primary = `hsl(${p.colors.primary})`;
  const primaryFg = `hsl(${p.colors.primaryForeground})`;

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Floating top CTA bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <span className="font-bold text-lg tracking-tight">{p.displayName}</span>
          <a
            href={p.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle className="w-4 h-4" /> {p.ctaText}
          </a>
        </div>
      </div>

      {/* Hero — full width, left-aligned text */}
      <section className="relative h-[70vh] min-h-[420px] flex items-end">
        <img src={p.heroImage} alt={p.displayName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pb-12 md:pb-16">
          <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: accent }}>
            {p.lead.niche} • {p.lead.city}
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-2xl mb-4">
            {p.heroTitle}
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-lg mb-6">{p.heroSubtitle}</p>
          <a
            href={p.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-base font-bold text-white shadow-xl transition-transform hover:scale-105"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle className="w-5 h-5" /> {p.ctaText}
          </a>
        </div>
      </section>

      {/* Horizontal benefits strip */}
      <section className="border-b border-gray-100 py-5">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-10">
          {p.benefits.slice(0, 4).map((b, i) => (
            <span key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
              {typeof b === "string" ? b : b.title}
            </span>
          ))}
        </div>
      </section>

      {/* Services — 3 column cards */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Nossos Serviços</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {p.services.map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-lg" style={{ backgroundColor: accent }}>
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — horizontal scroll cards */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">O que dizem nossos clientes</h2>
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x">
            {p.reviews.slice(0, 6).map((r, i) => (
              <div key={i} className="flex-shrink-0 w-72 snap-start bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">"{r.text}"</p>
                <p className="font-semibold text-sm">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery — masonry-ish */}
      {p.gallery.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Galeria</h2>
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {p.gallery.slice(0, 9).map((img, i) => (
                <img key={i} src={img.url} alt={img.alt} className="w-full rounded-lg" loading="lazy" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 text-center" style={{ backgroundColor: primary, color: primaryFg }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="opacity-70 mb-8">Atendimento profissional em {p.lead.city}. Fale conosco agora.</p>
          <a
            href={p.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white shadow-xl hover:brightness-110 transition"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle className="w-5 h-5" /> {p.ctaText}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="text-white font-bold text-lg mb-1">{p.displayName}</p>
            <p className="text-sm">{p.lead.city}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Phone className="w-4 h-4" /> {p.lead.phone}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernoLayout;
