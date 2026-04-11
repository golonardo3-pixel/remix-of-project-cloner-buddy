import { VariationLayoutProps } from "./VariationShared";
import { MessageCircle, MapPin, Phone, Star, ArrowRight } from "lucide-react";

/**
 * PREMIUM — Institutional / luxury style
 * Structure: Thin top bar → Hero with serif typography → Editorial about →
 * Services in 2-col → Featured testimonial → Edge-to-edge gallery → Contact → Footer
 */
const PremiumLayout = (p: VariationLayoutProps) => {
  const accent = `hsl(${p.colors.accent})`;
  const primary = `hsl(${p.colors.primary})`;
  const primaryFg = `hsl(${p.colors.primaryForeground})`;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      {/* Thin top bar */}
      <header className="bg-stone-900 text-stone-300 text-xs py-2.5 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="tracking-[0.15em] uppercase font-medium">{p.displayName}</span>
          <span className="flex items-center gap-2">
            <MapPin className="w-3 h-3" /> {p.lead.city}
          </span>
        </div>
      </header>

      {/* Hero — editorial, big serif title */}
      <section className="relative min-h-[80vh] flex items-center">
        <img src={p.heroImage} alt={p.displayName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-20">
          <div className="w-20 h-[1px] mx-auto mb-8" style={{ backgroundColor: accent }} />
          <h1 className="text-3xl md:text-5xl lg:text-6xl leading-tight font-normal text-white mb-6">
            {p.heroTitle}
          </h1>
          <p className="text-white/70 text-base md:text-xl max-w-xl mx-auto mb-10 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            {p.heroSubtitle}
          </p>
          <a
            href={p.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 border-2 border-white/40 text-white text-sm tracking-widest uppercase hover:bg-white hover:text-stone-900 transition-all duration-300"
          >
            Agendar Agora <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* About — centered editorial */}
      <section className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center px-6">
          <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: accent, fontFamily: "'Inter', sans-serif" }}>Sobre nós</p>
          <h2 className="text-2xl md:text-4xl leading-relaxed mb-8">{p.content.aboutHeading}</h2>
          <div className="w-12 h-[1px] mx-auto mb-8" style={{ backgroundColor: accent }} />
          <p className="text-stone-500 text-base md:text-lg leading-loose" style={{ fontFamily: "'Inter', sans-serif" }}>
            {p.lead.description || p.content.aboutText}
          </p>
        </div>
      </section>

      {/* Services — 2 column */}
      <section className="py-20 bg-stone-100">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs tracking-[0.25em] uppercase text-center mb-4" style={{ color: accent, fontFamily: "'Inter', sans-serif" }}>Serviços</p>
          <h2 className="text-2xl md:text-4xl text-center mb-16">{p.content.servicesHeading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {p.services.map((s, i) => (
              <div key={i} className="bg-white p-8 md:p-10 border border-stone-200">
                <h3 className="text-xl mb-3">{s.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Single featured testimonial */}
      {p.reviews.length > 0 && (
        <section className="py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center px-6">
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl italic leading-relaxed text-stone-700 mb-6">
              "{p.reviews[0].text}"
            </blockquote>
            <p className="text-sm tracking-widest uppercase text-stone-400" style={{ fontFamily: "'Inter', sans-serif" }}>
              — {p.reviews[0].name}
            </p>
          </div>
        </section>
      )}

      {/* Gallery — edge-to-edge strip */}
      {p.gallery.length > 0 && (
        <section className="overflow-hidden">
          <div className="flex">
            {p.gallery.slice(0, 5).map((img, i) => (
              <img key={i} src={img.url} alt={img.alt} className="w-1/3 md:w-1/5 h-64 object-cover" loading="lazy" />
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="py-20 md:py-32 bg-stone-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <div className="w-20 h-[1px] mx-auto mb-8" style={{ backgroundColor: accent }} />
          <h2 className="text-2xl md:text-4xl mb-4">Entre em contato</h2>
          <p className="text-stone-400 text-sm mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
            Atendimento exclusivo em {p.lead.city} e região.
          </p>
          <a
            href={p.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-stone-900 text-sm tracking-widest uppercase hover:bg-stone-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Falar pelo WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-500 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
          <p>© {new Date().getFullYear()} {p.displayName}</p>
          <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> {p.lead.phone}</p>
        </div>
      </footer>
    </div>
  );
};

export default PremiumLayout;
