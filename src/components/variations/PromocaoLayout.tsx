import { MessageCircle, MapPin, Zap, Clock, Star, AlertTriangle } from "lucide-react";
import type { VariationLayoutProps } from "./VariationShared";

const PromocaoLayout = ({ lead, displayName, heroTitle, heroSubtitle, ctaText, whatsappLink, heroImage, reviews, services, benefits, colors, content }: VariationLayoutProps) => {
  return (
    <div className="min-h-screen bg-zinc-900 text-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Urgent top banner */}
      <div className="bg-red-600 text-white text-center py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 animate-pulse">
        <Zap className="w-4 h-4" />
        PROMOÇÃO POR TEMPO LIMITADO — Vagas preenchendo rápido!
        <Zap className="w-4 h-4" />
      </div>

      {/* Bold hero: full-width image with massive overlay text */}
      <section className="relative min-h-[70vh] flex items-center">
        <img src={heroImage} alt={displayName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 via-red-900/70 to-amber-900/60" />
        <div className="relative z-10 px-6 py-16 max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-black px-4 py-2 rounded-md text-xs font-bold uppercase mb-6">
            <AlertTriangle className="w-4 h-4" />
            Oferta especial em {lead.city}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-[1.05] mb-4">
            {heroTitle}
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-lg">{heroSubtitle}</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-xl text-white font-bold text-lg shadow-2xl hover:scale-105 transition-transform"
            style={{ backgroundColor: "#25D366" }}>
            <MessageCircle className="w-6 h-6" />
            QUERO APROVEITAR AGORA
          </a>
          <div className="flex items-center gap-2 mt-6 text-sm text-white/60">
            <Clock className="w-4 h-4" />
            Promoção válida por tempo limitado
          </div>
        </div>
      </section>

      {/* Benefits: bold horizontal strip */}
      <section className="bg-amber-400 text-black py-6">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {benefits.slice(0, 4).map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-sm font-bold">
              <span className="text-red-600 text-lg">✓</span>
              {typeof b === 'string' ? b : b.title}
            </div>
          ))}
        </div>
      </section>

      {/* Services: large cards with CTA on each */}
      <section className="py-16 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center text-3xl sm:text-4xl font-black uppercase mb-4">O que está incluso</h2>
          <p className="text-center text-zinc-400 mb-12">Aproveite antes que acabe</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-zinc-800 rounded-xl p-8 border border-zinc-700 hover:border-amber-400/50 transition-colors">
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-zinc-400 text-sm mb-6">{s.desc}</p>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-red-500 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Reservar vaga
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof: review strip */}
      <section className="py-16 bg-zinc-900">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center text-2xl font-bold mb-10">Quem já aproveitou, recomenda</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((r, i) => (
              <div key={i} className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
                <div className="flex gap-1 mb-3">
                  {Array(r.rating).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-zinc-300 text-sm mb-4">"{r.text}"</p>
                <p className="text-sm font-semibold text-white">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final urgency CTA */}
      <section className="py-20 bg-gradient-to-b from-red-900 to-red-950 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <Zap className="w-12 h-12 text-amber-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-black uppercase mb-4">Não perca essa oportunidade!</h2>
          <p className="text-red-200 mb-8">Vagas limitadas em {lead.city}. Garanta a sua agora.</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-12 py-6 rounded-xl text-white font-bold text-xl shadow-2xl hover:scale-105 transition-transform animate-bounce"
            style={{ backgroundColor: "#25D366" }}>
            <MessageCircle className="w-7 h-7" />
            GARANTIR MINHA VAGA
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-zinc-500 py-8 text-center text-xs">
        <p>© {new Date().getFullYear()} {displayName} — {lead.city}</p>
      </footer>

      <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform"
        style={{ backgroundColor: "#25D366" }}>
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};

export default PromocaoLayout;
