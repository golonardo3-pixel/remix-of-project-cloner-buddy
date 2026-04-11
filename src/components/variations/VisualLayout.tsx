import { VariationLayoutProps } from "./VariationShared";
import { MessageCircle, Phone, MapPin, Star, Instagram } from "lucide-react";

/**
 * VISUAL — Image-forward, portfolio style
 * Structure: Full-screen hero → Mosaic gallery → Minimal about →
 * Services grid → Review strip → Split image+CTA → Footer
 */
const VisualLayout = (p: VariationLayoutProps) => {
  const accent = `hsl(${p.colors.accent})`;

  return (
    <div className="min-h-screen bg-neutral-950 text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Full-screen hero image */}
      <section className="relative h-screen min-h-[500px]">
        <img src={p.heroImage} alt={p.displayName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950" />
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-12 md:pb-16">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm tracking-widest uppercase mb-3 opacity-70">{p.lead.niche}{p.lead.city ? ` • ${p.lead.city}` : ""}</p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-xl">{p.displayName}</h1>
          </div>
        </div>
      </section>

      {/* Mosaic gallery */}
      {p.gallery.length > 0 && (
        <section className="py-10 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {p.gallery.slice(0, 1).map((img, i) => (
                <div key={i} className="col-span-2 row-span-2">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover rounded-lg aspect-square" loading="lazy" />
                </div>
              ))}
              {p.gallery.slice(1, 7).map((img, i) => (
                <div key={i}>
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover rounded-lg aspect-square" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Minimal about */}
      <section className="py-14 md:py-20">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-xl md:text-2xl font-light leading-relaxed text-neutral-300 mb-4">{p.heroSubtitle}</h2>
          <div className="w-10 h-[1px] mx-auto bg-neutral-700 mb-4" />
          <p className="text-neutral-500 text-sm">{p.lead.description || p.content.aboutText}</p>
        </div>
      </section>

      {/* Services — minimal grid */}
      <section className="py-14 bg-neutral-900">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xs tracking-[0.2em] uppercase text-neutral-500 text-center mb-10">Serviços</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {p.services.map((s, i) => (
              <div key={i} className="text-center p-6">
                <h3 className="font-medium text-sm mb-1">{s.title}</h3>
                <p className="text-neutral-500 text-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal review strip */}
      {p.reviews.length > 0 && (
        <section className="py-14">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
              {p.reviews.slice(0, 5).map((r, i) => (
                <div key={i} className="flex-shrink-0 w-64 snap-start">
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-neutral-400 text-sm mb-2">"{r.text}"</p>
                  <p className="text-xs font-medium text-neutral-500">{r.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Split: Image + CTA */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[50vh]">
        <div className="relative min-h-[250px]">
          {p.gallery.length > 2 ? (
            <img src={p.gallery[2].src} alt="Visual" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          ) : p.gallery.length > 1 ? (
            <img src={p.gallery[1].src} alt="Visual" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          ) : (
            <img src={p.heroImage} alt="Visual" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          )}
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-8 bg-neutral-900">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Vamos conversar?</h2>
          <p className="text-neutral-400 text-sm text-center mb-8 max-w-xs">
            {p.lead.city ? `Atendimento profissional em ${p.lead.city}.` : "Atendimento profissional."}
          </p>
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
      <footer className="bg-neutral-950 border-t border-neutral-800 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p className="font-medium text-neutral-300">{p.displayName}</p>
          <div className="flex items-center gap-4">
            {p.lead.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.lead.city}</span>}
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {p.lead.phone}</span>
            {p.lead.instagram && (
              <a href={`https://instagram.com/${p.lead.instagram.replace("@","")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-neutral-300">
                <Instagram className="w-3 h-3" /> {p.lead.instagram}
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VisualLayout;
