import { MessageCircle, MapPin, Phone } from "lucide-react";
import type { VariationLayoutProps } from "./VariationShared";

const SimplesLayout = ({ lead, displayName, heroTitle, heroSubtitle, ctaText, whatsappLink, services, colors, content }: VariationLayoutProps) => {
  return (
    <div className="min-h-screen bg-white text-zinc-800" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Simple header */}
      <header className="border-b border-zinc-200 py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="font-bold text-lg">{displayName}</span>
          <span className="text-sm text-zinc-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {lead.city}
          </span>
        </div>
      </header>

      {/* No hero image — text only hero */}
      <section className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">{heroTitle}</h1>
        <p className="text-zinc-500 text-base mb-8">{heroSubtitle}</p>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-white font-medium text-sm"
          style={{ backgroundColor: "#25D366" }}>
          <MessageCircle className="w-4 h-4" />
          {ctaText}
        </a>
      </section>

      <hr className="border-zinc-100 max-w-2xl mx-auto" />

      {/* Services: simple list */}
      <section className="max-w-2xl mx-auto px-6 py-12">
        <h2 className="text-xl font-bold mb-6">Serviços</h2>
        <ul className="space-y-4">
          {services.map((s) => (
            <li key={s.title} className="border-b border-zinc-100 pb-4">
              <h3 className="font-semibold text-base">{s.title}</h3>
              <p className="text-zinc-500 text-sm mt-1">{s.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <hr className="border-zinc-100 max-w-2xl mx-auto" />

      {/* Contact: inline */}
      <section className="max-w-2xl mx-auto px-6 py-12">
        <h2 className="text-xl font-bold mb-4">Contato</h2>
        <div className="space-y-3 text-sm text-zinc-600">
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-zinc-400" />
            {lead.phone}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-zinc-400" />
            {lead.city}
          </p>
        </div>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-md text-white font-medium text-sm"
          style={{ backgroundColor: "#25D366" }}>
          <MessageCircle className="w-4 h-4" />
          Falar pelo WhatsApp
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-6 px-6 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} {displayName}
      </footer>
    </div>
  );
};

export default SimplesLayout;
