import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getNicheContent, professionalizeName } from "@/lib/niche-content";
import { getNicheColors } from "@/lib/gallery-images";
import type { SiteContentOverrides } from "@/lib/site-content-types";
import { MessageCircle, Star, MapPin, Phone, CheckCircle, Zap, Shield, Clock } from "lucide-react";

const LeadSiteConversion = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: lead, isLoading, error } = useQuery({
    queryKey: ["lead-site-conversion", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as any;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Carregando...</p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold mb-2 text-foreground">Site não encontrado</h1>
          <p className="text-muted-foreground">Verifique o link e tente novamente.</p>
        </div>
      </div>
    );
  }

  const displayName = professionalizeName(lead.company_name, lead.niche);
  const content = getNicheContent(lead.niche, lead.city, displayName);
  const colors = getNicheColors(lead.niche);
  const sc: SiteContentOverrides | null = lead.site_content;

  const heroTitle = sc?.heroTitle || displayName;
  const heroSubtitle = sc?.heroSubtitle || content.heroSubtitle;
  const urgencyBadge = (sc?.urgencyBadge || content.urgencyBadge).replace("⚡ ", "");
  const ctaText = sc?.ctaText || content.ctaText;
  const whatsappMsg = sc?.whatsappMessage || content.whatsappMessage;
  const servicesTitle = sc?.servicesTitle || "O que oferecemos";
  const servicesSubtitle = sc?.servicesSubtitle || "Toque no botão e pergunte sobre qualquer serviço";
  const reviewsTitle = sc?.reviewsTitle || "O que dizem nossos clientes";
  const contactTitle = sc?.contactTitle || `Fale diretamente com ${displayName}`;
  const contactSubtitle = sc?.contactSubtitle || "Sem formulário, sem espera. Atendimento direto e pessoal.";
  const finalCtaTitle = sc?.finalCtaTitle || "Não perca tempo!";
  const finalCtaSubtitle = sc?.finalCtaSubtitle || `Clique no botão abaixo e fale agora com ${displayName} em ${lead.city}. Atendimento imediato via WhatsApp.`;
  const workingHours = sc?.workingHours || "Seg a Sex: 9h às 20h · Sáb: 9h às 18h";

  const whatsappLink = `https://wa.me/${lead.phone}?text=${encodeURIComponent(whatsappMsg)}`;

  const displayServices = sc?.services && sc.services.length > 0
    ? sc.services
    : lead.services_list && lead.services_list.length > 0
      ? lead.services_list
      : content.services.map((s: { title: string }) => s.title);

  const displayReviews = sc?.reviews && sc.reviews.length > 0 ? sc.reviews : content.reviews;

  const benefits = sc?.benefits && sc.benefits.length > 0
    ? sc.benefits.map((b) => ({ ...b, icon: Zap }))
    : [
        { icon: Zap, title: "Atendimento Imediato", desc: "Resposta na hora pelo WhatsApp" },
        { icon: Shield, title: "Equipe Preparada", desc: `Profissionais de confiança em ${lead.city}` },
        { icon: Clock, title: "Não Espere Piorar", desc: "Resolva hoje, não amanhã" },
        { icon: CheckCircle, title: "Serviço com Garantia", desc: "Trabalho profissional e seguro" },
      ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header — clean, name only */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 max-w-5xl mx-auto">
          <h1 className="font-display text-base sm:text-xl font-semibold tracking-tight text-foreground">
            {displayName}
          </h1>
          <span className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-green-500" />
            {lead.city}
          </span>
        </div>
      </header>

      <main>
        {/* Hero — Full impact, single CTA */}
        <section className="relative min-h-[55vh] sm:min-h-[70vh] md:min-h-[90vh] flex items-center overflow-hidden">
          <img
            src={content.heroImage}
            alt={`${displayName} em ${lead.city}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/45" />
          <div className="relative z-10 px-4 sm:px-5 py-8 sm:py-10 md:py-16 max-w-2xl mx-auto w-full text-center">
            {/* Urgency pill */}
            <div
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 text-xs sm:text-sm font-bold animate-pulse backdrop-blur-sm"
              style={{ backgroundColor: "#25D366", color: "#fff" }}
            >
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {urgencyBadge}
            </div>

            <h1 className="text-white font-display text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-snug sm:leading-tight mb-3 sm:mb-4 drop-shadow-lg">
              {heroTitle}
            </h1>

            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
              <span className="text-white/90 text-xs sm:text-sm font-medium drop-shadow">{lead.city}</span>
            </div>

            <p className="text-white/85 text-xs sm:text-base md:text-lg mb-4 sm:mb-6 max-w-lg mx-auto leading-relaxed drop-shadow">
              {heroSubtitle}
            </p>

            {/* Star rating */}
            <div className="flex items-center justify-center gap-1 mb-5 sm:mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Primary CTA */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 text-sm sm:text-base md:text-xl font-bold rounded-xl shadow-2xl transition-transform hover:scale-105"
              style={{ backgroundColor: "#25D366", color: "#fff" }}
            >
              <MessageCircle className="w-5 sm:w-6 h-5 sm:h-6" />
              {ctaText.toUpperCase()}
            </a>
            <p className="text-white/50 text-[10px] sm:text-xs mt-3 sm:mt-4">⚡ Resposta em menos de 2 minutos</p>
          </div>
        </section>

        {/* Benefits strip */}
        <section className="py-8 md:py-10" style={{ backgroundColor: `hsl(${colors.primary})` }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4 sm:px-5 max-w-4xl mx-auto">
            {benefits.map((b) => (
              <div key={b.title} className="text-center py-4">
                {b.icon && <b.icon className="w-8 h-8 mx-auto mb-2" style={{ color: `hsl(${colors.accent})` }} />}
                <h3 className="font-bold text-sm mb-1" style={{ color: `hsl(${colors.primaryForeground})` }}>{b.title}</h3>
                <p className="text-xs" style={{ color: `hsl(${colors.primaryForeground} / 0.7)` }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services as quick checklist + CTA */}
        <section className="py-10 md:py-16 px-4 sm:px-5">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-foreground">
              {servicesTitle}
            </h2>
            <p className="text-muted-foreground mb-8 text-sm">{servicesSubtitle}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 text-left">
              {displayServices.slice(0, 8).map((service: string | { title: string }) => {
                const name = typeof service === "string" ? service : service.title;
                return (
                  <div key={name} className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                    <CheckCircle className="w-5 h-5 shrink-0" style={{ color: "#25D366" }} />
                    <span className="text-foreground font-medium text-sm">{name}</span>
                  </div>
                );
              })}
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-xl shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: "#25D366", color: "#fff" }}
            >
              <MessageCircle className="w-6 h-6" />
              Quero saber mais – WhatsApp
            </a>
          </div>
        </section>

        {/* Social proof — compact reviews */}
        {displayReviews.length > 0 && (
          <section className="py-10 md:py-16 px-4 sm:px-5" style={{ backgroundColor: `hsl(${colors.secondary})` }}>
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-center mb-6 md:mb-8 text-foreground">
                {reviewsTitle}
              </h2>
              <div className="space-y-4">
                {displayReviews.map((r) => (
                  <div key={r.name} className="bg-background rounded-xl p-5 shadow-sm flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                      style={{ backgroundColor: `hsl(${colors.primary})`, color: `hsl(${colors.primaryForeground})` }}>
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-foreground">{r.name}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">"{r.text}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact info + CTA */}
        <section className="py-10 md:py-16 px-4 sm:px-5">
          <div className="max-w-md mx-auto text-center">
            <h2 className="font-display text-xl sm:text-2xl font-bold mb-3 text-foreground">
              {contactTitle}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {contactSubtitle}
            </p>

            <div className="space-y-3 mb-8 text-left">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
                <MapPin className="w-5 h-5 shrink-0" style={{ color: `hsl(${colors.accent})` }} />
                <span className="text-foreground text-sm">{lead.city}</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
                <Phone className="w-5 h-5 shrink-0" style={{ color: `hsl(${colors.accent})` }} />
                <span className="text-foreground text-sm">{lead.phone}</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
                <Clock className="w-5 h-5 shrink-0" style={{ color: `hsl(${colors.accent})` }} />
                <span className="text-foreground text-sm">{workingHours}</span>
              </div>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full px-8 py-5 text-lg font-bold rounded-xl shadow-xl transition-transform hover:scale-105"
              style={{ backgroundColor: "#25D366", color: "#fff" }}
            >
              <MessageCircle className="w-6 h-6" />
              CHAMAR NO WHATSAPP AGORA
            </a>
            <p className="text-muted-foreground text-xs mt-3">Atendimento rápido e sem compromisso</p>
          </div>
        </section>

        {/* Final urgency CTA */}
        <section className="py-10 md:py-16" style={{ backgroundColor: "#25D366" }}>
          <div className="px-4 sm:px-5 max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
              Não perca tempo!
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Clique no botão abaixo e fale agora com {displayName} em {lead.city}.
              Atendimento imediato via WhatsApp.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 text-xl font-bold rounded-xl shadow-2xl transition-transform hover:scale-105 bg-white text-green-600"
            >
              <MessageCircle className="w-7 h-7" />
              FALAR AGORA
            </a>
          </div>
        </section>
      </main>

      {/* Mini footer */}
      <footer className="py-8 px-5 text-center" style={{ backgroundColor: `hsl(${colors.primary})` }}>
        <p className="text-xs" style={{ color: `hsl(${colors.primaryForeground} / 0.5)` }}>
          © {new Date().getFullYear()} {displayName} · {lead.city}
        </p>
      </footer>

      {/* Floating WhatsApp FAB — compact on mobile, no bounce to avoid distraction */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chamar no WhatsApp agora"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center w-14 h-14 sm:w-auto sm:h-auto sm:px-5 sm:py-3 rounded-full shadow-2xl transition-transform hover:scale-110 text-white font-bold text-sm"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle className="w-6 h-6 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline ml-2">WhatsApp</span>
      </a>
    </div>
  );
};

export default LeadSiteConversion;
