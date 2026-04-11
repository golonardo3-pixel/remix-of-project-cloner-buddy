import { MessageCircle, MapPin, Phone, Star } from "lucide-react";
import type { VariationLayoutProps } from "./VariationShared";

const PremiumLayout = ({ lead, displayName, heroTitle, heroSubtitle, ctaText, whatsappLink, heroImage, gallery, reviews, services, benefits, colors, content, mapsLink }: VariationLayoutProps) => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
      {/* Elegant top bar */}
      <div className="bg-stone-900 text-stone-300 text-xs text-center py-2 tracking-widest uppercase">
        Atendimento exclusivo em {lead.city}
      </div>

      {/* Full-width hero with centered overlay */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        <img src={heroImage} alt={displayName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-900/80" />
        <div className="relative z-10 text-center max-w-3xl px-6">
          <div className="w-20 h-px bg-amber-400 mx-auto mb-8" />
          <p className="text-amber-400 text-sm tracking-[0.3em] uppercase mb-6">
            {lead.niche} • {lead.city}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8">
            {displayName}
          </h1>
          <p className="text-white/70 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
            {heroSubtitle}
          </p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-none border-2 border-amber-400 text-amber-400 font-medium tracking-wider uppercase text-sm hover:bg-amber-400 hover:text-stone-900 transition-all"
            style={{ fontFamily: "Inter, sans-serif" }}>
            <MessageCircle className="w-5 h-5" />
            {ctaText}
          </a>
          <div className="w-20 h-px bg-amber-400 mx-auto mt-10" />
        </div>
      </section>

      {/* About: wide horizontal layout with large spacing */}
      <section className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-amber-700 text-xs tracking-[0.3em] uppercase mb-6">Nossa história</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-10 leading-snug">{content.aboutHeading}</h2>
          <div className="w-16 h-px bg-amber-400 mx-auto mb-10" />
          <p className="text-stone-500 text-lg leading-[1.9]" style={{ fontFamily: "Inter, sans-serif" }}>
            {lead.description || content.aboutText}
          </p>
        </div>
      </section>

      {/* Services: elegant list (not grid) */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-6">Experiências</p>
            <h2 className="text-3xl sm:text-4xl font-bold">{content.servicesHeading}</h2>
          </div>
          <div className="space-y-0">
            {services.map((s, i) => (
              <div key={s.title} className="border-t border-stone-700 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{s.title}</h3>
                  <p className="text-stone-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{s.desc}</p>
                </div>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                  className="text-amber-400 text-sm tracking-wider uppercase hover:text-amber-300 transition-colors whitespace-nowrap"
                  style={{ fontFamily: "Inter, sans-serif" }}>
                  Reservar →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery: large single image + small grid */}
      {gallery.length > 0 && (
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-8">
            <div className="text-center mb-16">
              <p className="text-amber-700 text-xs tracking-[0.3em] uppercase mb-6">Galeria</p>
              <h2 className="text-3xl sm:text-4xl font-bold">Nosso espaço</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:row-span-2 rounded-none overflow-hidden">
                <img src={gallery[0].src} alt={gallery[0].alt} className="w-full h-full object-cover min-h-[400px]" />
              </div>
              {gallery.slice(1, 3).map((img, i) => (
                <div key={i} className="rounded-none overflow-hidden">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover min-h-[200px]" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials: large quote style */}
      <section className="py-24 bg-stone-100">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <p className="text-amber-700 text-xs tracking-[0.3em] uppercase mb-6">Depoimentos</p>
          {reviews.slice(0, 1).map((r, i) => (
            <div key={i}>
              <p className="text-2xl sm:text-3xl leading-relaxed text-stone-700 mb-8 italic">
                "{r.text}"
              </p>
              <div className="flex items-center justify-center gap-1 mb-3">
                {Array(r.rating).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="font-semibold text-lg">{r.name}</p>
            </div>
          ))}
          <div className="flex justify-center gap-8 mt-12">
            {reviews.slice(1, 3).map((r, i) => (
              <div key={i} className="text-left max-w-xs">
                <p className="text-stone-500 text-sm italic mb-3">"{r.text}"</p>
                <p className="text-sm font-semibold">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-stone-900 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="w-20 h-px bg-amber-400 mx-auto mb-8" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Agende sua experiência</h2>
          <p className="text-stone-400 mb-10" style={{ fontFamily: "Inter, sans-serif" }}>
            Atendimento exclusivo. Agende pelo WhatsApp.
          </p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-12 py-5 border-2 border-amber-400 text-amber-400 tracking-wider uppercase text-sm hover:bg-amber-400 hover:text-stone-900 transition-all"
            style={{ fontFamily: "Inter, sans-serif" }}>
            <MessageCircle className="w-5 h-5" />
            {ctaText}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-10 text-center text-xs tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
        <p>© {new Date().getFullYear()} {displayName} — {lead.city}</p>
      </footer>

      <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-stone-900 hover:scale-110 transition-transform"
        style={{ backgroundColor: "#C8A96E" }}>
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};

export default PremiumLayout;
