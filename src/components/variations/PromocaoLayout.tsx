import { VariationLayoutProps } from "./VariationShared";
import { MessageCircle, Clock, Zap, Star, Phone, AlertTriangle } from "lucide-react";

/**
 * PROMOÇÃO — High-urgency sales page
 * Structure: Urgency bar → Bold hero → Benefits checklist →
 * Services as offer cards → Big testimonials → Repeating CTA → Footer
 */
const PromocaoLayout = (p: VariationLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Urgency top bar */}
      <div className="bg-red-600 text-white text-center py-2.5 px-4">
        <p className="text-xs md:text-sm font-bold flex items-center justify-center gap-2 animate-pulse">
          <AlertTriangle className="w-4 h-4" />
          OFERTA POR TEMPO LIMITADO — VAGAS ACABANDO!
        </p>
      </div>

      {/* Hero — bold, centered, urgency-driven */}
      <section className="relative py-16 md:py-24 text-center">
        <img src={p.heroImage} alt={p.displayName} className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-amber-500 text-black text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" /> PROMOÇÃO EXCLUSIVA
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">{p.heroTitle}</h1>
          <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto mb-8">{p.heroSubtitle}</p>
          <a
            href={p.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-5 bg-green-500 hover:bg-green-400 text-white text-lg font-black rounded-xl shadow-2xl shadow-green-500/30 transition-all hover:scale-105 animate-bounce"
          >
            <MessageCircle className="w-6 h-6" /> QUERO APROVEITAR AGORA!
          </a>
        </div>
      </section>

      {/* Benefits — checklist */}
      <section className="py-14 bg-gray-900">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-black text-center mb-10">
            Por que escolher a <span className="text-amber-400">{p.displayName}</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {p.benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-800 rounded-lg p-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <span className="text-sm font-medium">{typeof b === "string" ? b : b.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services as offer cards */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-black text-center mb-2">Serviços em Destaque</h2>
          <p className="text-center text-amber-400 text-sm font-bold mb-10">Preços especiais por tempo limitado!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {p.services.map((s, i) => (
              <div key={i} className="border-2 border-amber-500/30 bg-gray-900 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">OFERTA</div>
                <h3 className="text-lg font-bold mb-2 text-amber-400">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {p.reviews.length > 0 && (
        <section className="py-14 bg-gray-900">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-black text-center mb-10">Clientes Satisfeitos</h2>
            <div className="space-y-6">
              {p.reviews.slice(0, 4).map((r, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm mb-3">"{r.text}"</p>
                  <p className="text-amber-400 font-bold text-sm">{r.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Repeating CTA */}
      <section className="py-16 text-center bg-gradient-to-b from-gray-950 to-red-950/30">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-red-400 text-sm font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" /> Últimas vagas disponíveis
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-6">Não perca essa oportunidade!</h2>
          <a
            href={p.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-5 bg-green-500 hover:bg-green-400 text-white text-lg font-black rounded-xl shadow-2xl shadow-green-500/30 transition-all hover:scale-105"
          >
            <MessageCircle className="w-6 h-6" /> GARANTIR MINHA VAGA
          </a>
          <p className="text-gray-500 text-xs mt-4">{p.lead.city ? `Atendimento em ${p.lead.city} e região` : "Atendimento disponível"}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        <p>{p.displayName}{p.lead.city ? ` • ${p.lead.city}` : ""} • <Phone className="w-3 h-3 inline" /> {p.lead.phone}</p>
      </footer>
    </div>
  );
};

export default PromocaoLayout;
