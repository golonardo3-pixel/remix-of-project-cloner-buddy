import { MessageCircle, MapPin } from "lucide-react";
import type { VariationLayoutProps } from "./VariationShared";

const VisualLayout = ({ lead, displayName, heroTitle, heroSubtitle, ctaText, whatsappLink, heroImage, gallery, reviews, services, colors, content }: VariationLayoutProps) => {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Full-screen hero image — almost no text */}
      <section className="relative h-screen">
        <img src={heroImage} alt={displayName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-10">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm tracking-widest uppercase">{displayName}</span>
            <span className="flex items-center gap-1 text-white/60 text-xs">
              <MapPin className="w-3 h-3" /> {lead.city}
            </span>
          </div>
          <div className="max-w-lg">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">{heroTitle}</h1>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold hover:scale-105 transition-transform"
              style={{ backgroundColor: "#25D366" }}>
              <MessageCircle className="w-5 h-5" />
              {ctaText}
            </a>
          </div>
        </div>
      </section>

      {/* Image mosaic gallery */}
      {gallery.length > 0 && (
        <section className="py-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {gallery.slice(0, 6).map((img, i) => (
              <div key={i} className={`overflow-hidden ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Minimal about text between images */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-6">{lead.niche}</p>
          <p className="text-xl sm:text-2xl text-zinc-300 leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Services: image-forward cards */}
      <section className="pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {services.slice(0, 4).map((s, i) => {
            const bgImg = gallery[i % gallery.length]?.src || heroImage;
            return (
            <div key={s.title} className="relative group overflow-hidden aspect-video">
              <img src={bgImg} alt={s.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
              <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{s.title}</h3>
                <p className="text-white/60 text-sm max-w-xs">{s.desc}</p>
              </div>
            </div>
            );
          })}
        </div>
      </section>

      {/* Reviews overlay style */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {reviews.slice(0, 2).map((r, i) => (
              <div key={i}>
                <div className="flex gap-1 mb-4">
                  {Array(r.rating).fill(0).map((_, j) => <span key={j} className="text-amber-400 text-lg">★</span>)}
                </div>
                <p className="text-zinc-300 text-lg italic leading-relaxed mb-4">"{r.text}"</p>
                <p className="text-sm font-semibold text-white">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width CTA image */}
      <section className="relative py-32">
        <img src={gallery[1] || heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Agende agora</h2>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full text-white font-semibold text-lg hover:scale-105 transition-transform shadow-2xl"
            style={{ backgroundColor: "#25D366" }}>
            <MessageCircle className="w-6 h-6" />
            {ctaText}
          </a>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="py-8 text-center text-zinc-600 text-xs">
        © {new Date().getFullYear()} {displayName}
      </footer>

      <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
        style={{ backgroundColor: "#25D366" }}>
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
};

export default VisualLayout;
