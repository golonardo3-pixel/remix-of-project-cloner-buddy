import { VariationLayoutProps } from "./VariationShared";
import { MessageCircle, Phone, MapPin, Star } from "lucide-react";

/**
 * SIMPLES — Ultra minimal, text-focused, no frills
 * Structure: Name + city → Text hero (no image) → Bullet services list →
 * 3 short reviews → Phone + WhatsApp CTA → One-line footer
 */
const SimplesLayout = (p: VariationLayoutProps) => {
  return (
    <div className="min-h-screen bg-white text-gray-800" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header — plain text */}
      <header className="border-b border-gray-200 px-5 py-4 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold">{p.displayName}</h1>
        {p.lead.city && (
          <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5" /> {p.lead.city}
          </p>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-5 py-10 space-y-12">
        {/* Hero — text only, no image */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold leading-snug mb-3">{p.heroTitle}</h2>
          {p.heroSubtitle && <p className="text-gray-500 text-base leading-relaxed mb-6">{p.heroSubtitle}</p>}
          <a
            href={p.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle className="w-4 h-4" /> {p.ctaText}
          </a>
        </section>

        {/* Gallery — simple grid */}
        {p.gallery.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4">Galeria do negócio</h3>
            <div className="grid grid-cols-2 gap-2">
              {p.gallery.slice(0, 6).map((img, i) => (
                <img key={i} src={img.src} alt={img.alt} className="w-full aspect-square object-cover rounded-lg" loading="lazy" />
              ))}
            </div>
          </section>
        )}

        {/* Services — simple bullet list */}
        <section>
          <h3 className="text-lg font-bold mb-4">Serviços</h3>
          <ul className="space-y-3">
            {p.services.map((s, i) => (
              <li key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
                {p.serviceImages[i] ? (
                  <img src={p.serviceImages[i].src} alt={p.serviceImages[i].alt || s.title} className="w-16 h-16 rounded-md object-cover shrink-0" loading="lazy" />
                ) : (
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                )}
                <div>
                  <p className="font-medium text-sm">{s.title}</p>
                  <p className="text-gray-400 text-xs">{s.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Reviews — compact */}
        {p.reviews.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-4">Avaliações</h3>
            <div className="space-y-4">
              {p.reviews.slice(0, 3).map((r, i) => (
                <div key={i} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex gap-0.5 mb-1">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">"{r.text}"</p>
                  <p className="text-xs text-gray-400 font-medium">{r.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact info */}
        <section className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3">Contato</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4" /> {p.lead.phone}</p>
            {p.lead.city && <p className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4" /> {p.lead.city}</p>}
          </div>
          <a
            href={p.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle className="w-4 h-4" /> Chamar no WhatsApp
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} {p.displayName}{p.lead.city ? ` • ${p.lead.city}` : ""}
      </footer>
    </div>
  );
};

export default SimplesLayout;
