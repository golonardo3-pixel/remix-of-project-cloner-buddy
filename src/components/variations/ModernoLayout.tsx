import { MessageCircle, MapPin, ArrowRight, ChevronRight } from "lucide-react";
import type { VariationLayoutProps } from "./VariationShared";

const ModernoLayout = ({ lead, displayName, heroTitle, heroSubtitle, ctaText, whatsappLink, heroImage, gallery, reviews, services, benefits, colors, content, mapsLink }: VariationLayoutProps) => {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Minimal sticky nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">{displayName}</span>
          <div className="hidden sm:flex items-center gap-8 text-sm text-zinc-500">
            <a href="#sobre" className="hover:text-zinc-900 transition-colors">Sobre</a>
            <a href="#servicos" className="hover:text-zinc-900 transition-colors">Serviços</a>
            <a href="#depoimentos" className="hover:text-zinc-900 transition-colors">Depoimentos</a>
          </div>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="px-5 py-2 text-sm font-medium rounded-full text-white transition-all hover:scale-105"
            style={{ backgroundColor: `hsl(${colors.primary})` }}>
            Contato
          </a>
        </div>
      </nav>

      {/* Hero: split layout - text left, image right */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 mb-6">
              <MapPin className="w-3 h-3" />
              {lead.city}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              {heroTitle}
            </h1>
            <p className="text-lg text-zinc-500 leading-relaxed mb-8 max-w-md">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold hover:scale-105 transition-transform shadow-lg"
                style={{ backgroundColor: "#25D366" }}>
                <MessageCircle className="w-5 h-5" />
                {ctaText}
              </a>
              <a href="#servicos"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-zinc-200 text-zinc-700 font-semibold hover:border-zinc-400 transition-colors">
                Ver serviços
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
              <img src={heroImage} alt={displayName} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `hsl(${colors.accent})` }}>
                <span className="text-white text-sm font-bold">★</span>
              </div>
              <div>
                <p className="text-sm font-semibold">{lead.google_rating || "4.9"}</p>
                <p className="text-xs text-zinc-400">{lead.google_reviews_count || 50}+ avaliações</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits: horizontal cards */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.slice(0, 4).map((b, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: `hsl(${colors.primary})` }}>
                  {["✦", "◆", "●", "▲"][i]}
                </div>
                <p className="text-sm font-medium text-zinc-700">{typeof b === 'string' ? b : b.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About: centered minimal */}
      <section id="sobre" className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: `hsl(${colors.accent})` }}>Sobre nós</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">{content.aboutHeading}</h2>
          <p className="text-zinc-500 text-lg leading-relaxed">
            {lead.description || content.aboutText}
          </p>
        </div>
      </section>

      {/* Services: clean grid with numbered cards */}
      <section id="servicos" className="py-20 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: `hsl(${colors.accent})` }}>Serviços</p>
            <h2 className="text-3xl sm:text-4xl font-bold">{content.servicesHeading}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={s.title} className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow group">
                <span className="text-4xl font-bold text-zinc-100 group-hover:text-zinc-200 transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-semibold mt-4 mb-3">{s.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-4 text-sm font-medium hover:gap-2 transition-all"
                  style={{ color: `hsl(${colors.primary})` }}>
                  Agendar <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews: minimal cards */}
      <section id="depoimentos" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: `hsl(${colors.accent})` }}>Depoimentos</p>
            <h2 className="text-3xl sm:text-4xl font-bold">O que dizem nossos clientes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((r, i) => (
              <div key={i} className="border border-zinc-100 rounded-2xl p-8">
                <div className="flex gap-1 mb-4">
                  {Array(r.rating).fill(0).map((_, j) => <span key={j} className="text-amber-400">★</span>)}
                </div>
                <p className="text-zinc-600 text-sm leading-relaxed mb-6">"{r.text}"</p>
                <p className="text-sm font-semibold">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="py-20" style={{ backgroundColor: `hsl(${colors.primary})` }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: `hsl(${colors.primaryForeground})` }}>
            Pronto para começar?
          </h2>
          <p className="text-lg mb-8" style={{ color: `hsl(${colors.primaryForeground} / 0.7)` }}>
            Fale conosco agora mesmo pelo WhatsApp
          </p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full text-white font-semibold text-lg hover:scale-105 transition-transform shadow-xl"
            style={{ backgroundColor: "#25D366" }}>
            <MessageCircle className="w-6 h-6" />
            {ctaText}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-semibold text-lg">{displayName}</p>
            <p className="text-zinc-400 text-sm mt-1">{lead.city}</p>
          </div>
          <p className="text-zinc-500 text-xs">© {new Date().getFullYear()} {displayName}</p>
        </div>
      </footer>

      {/* WhatsApp float */}
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
        style={{ backgroundColor: "#25D366" }}>
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
};

export default ModernoLayout;
