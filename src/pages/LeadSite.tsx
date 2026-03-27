import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getNicheContent, professionalizeName } from "@/lib/niche-content";
import { getGalleryImages, getNicheColors } from "@/lib/gallery-images";
import { MessageCircle, Star, MapPin, Phone, Clock, ExternalLink, Instagram } from "lucide-react";
import LeadSiteGallery from "@/components/LeadSiteGallery";
import LeadSiteContactForm from "@/components/LeadSiteContactForm";
import LeadSiteSocialProof from "@/components/LeadSiteSocialProof";
import { generateReviews } from "@/lib/review-generator";

const LeadSite = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: lead, isLoading, error } = useQuery({
    queryKey: ["lead-site", slug],
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

  // Get gallery: uploaded photos first, then niche stock (shuffled by slug)
  const gallery = getGalleryImages(lead.niche, lead.photos || undefined, lead.slug);
  
  const whatsappLink = `https://wa.me/${lead.phone}?text=${encodeURIComponent(content.whatsappMessage)}`;
  const generatedReviews = generateReviews(lead.niche, lead.slug);
  
  // Use Google Maps URL from lead if available, otherwise generate
  const hasGoogleMapsUrl = lead.google_maps_url;
  const mapsQuery = encodeURIComponent(`${displayName} ${lead.city}`);
  const mapsEmbedUrl = hasGoogleMapsUrl
    ? `https://www.google.com/maps?q=${encodeURIComponent(lead.google_maps_url)}&output=embed`
    : `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
  const mapsLink = hasGoogleMapsUrl || `https://www.google.com/maps/search/${mapsQuery}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mapsLink)}`;

  // Use custom services if provided
  const displayServices = lead.services_list && lead.services_list.length > 0
    ? lead.services_list.map((s: string) => ({ title: s, desc: `Serviço profissional de qualidade em ${lead.city}. Chame no WhatsApp para saber mais.` }))
    : content.services;

  // Dynamic niche color CSS variables
  const nicheStyle = {
    "--niche-primary": colors.primary,
    "--niche-primary-fg": colors.primaryForeground,
    "--niche-accent": colors.accent,
    "--niche-secondary": colors.secondary,
  } as React.CSSProperties;

  return (
    <div
      style={nicheStyle}
      className="[--primary:var(--niche-primary)] [--primary-foreground:var(--niche-primary-fg)] [--accent:var(--niche-accent)] [--gold:var(--niche-accent)] [--secondary:var(--niche-secondary)]"
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-5 py-3 max-w-5xl mx-auto">
          <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
            {displayName}
          </h1>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-colors"
            style={{ backgroundColor: `hsl(${colors.primary})`, color: `hsl(${colors.primaryForeground})` }}
          >
            <MessageCircle className="w-4 h-4" />
            {content.ctaText}
          </a>
        </div>
      </header>

      <main className="pt-[52px]">
        {/* Hero */}
        <section className="relative min-h-[80vh] flex items-end overflow-hidden">
          <img
            src={content.heroImage}
            alt={`${displayName} - ${lead.niche} em ${lead.city}`}
            className="absolute inset-0 w-full h-full object-cover z-0"
            width={1280}
            height={832}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          <div className="relative z-[2] px-5 pb-16 md:pb-24 max-w-5xl mx-auto w-full">
            <div className="w-16 h-0.5 mb-6" style={{ backgroundColor: `hsl(${colors.accent})` }} />
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-4 whitespace-pre-line" style={{ color: `hsl(${colors.primaryForeground})` }}>
              {content.heroTitle}
            </h2>
            <div className="flex items-center gap-2 mb-5">
              <MapPin className="w-4 h-4" style={{ color: `hsl(${colors.accent})` }} />
              <span className="text-white/80 text-sm font-medium">{lead.city}</span>
            </div>
            <p className="text-white/75 text-base md:text-lg max-w-md mb-6 font-body">
              {content.heroSubtitle}
            </p>
            {/* Urgency badge */}
            <div className="inline-block px-4 py-2 rounded-full mb-8 text-sm font-semibold animate-pulse" style={{ backgroundColor: `hsl(${colors.accent} / 0.2)`, color: `hsl(${colors.accent})` }}>
              {content.urgencyBadge}
            </div>
            <div>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded transition-all hover:brightness-110 shadow-lg"
                style={{ backgroundColor: "#25D366", color: "#fff" }}
              >
                <MessageCircle className="w-5 h-5" />
                {content.ctaText}
              </a>
            </div>
          </div>
        </section>

        {/* Social Proof - right after hero for max conversion */}
        <LeadSiteSocialProof reviews={generatedReviews} colors={colors} />

        {/* Benefits Strip */}
        <section className="py-10" style={{ backgroundColor: `hsl(${colors.primary})` }}>
          <div className="px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium" style={{ color: `hsl(${colors.primaryForeground})` }}>
                  <span style={{ color: `hsl(${colors.accent})` }}>✓</span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-20 px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <p className="uppercase text-xs tracking-[0.2em] font-medium mb-3" style={{ color: `hsl(${colors.accent})` }}>{content.aboutLabel}</p>
            <h2 className="salon-heading mb-5 whitespace-pre-line">{content.aboutHeading}</h2>
            <div className="w-16 h-0.5 mx-auto mb-8" style={{ backgroundColor: `hsl(${colors.accent})` }} />
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              {lead.description || content.aboutText}
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded transition-all hover:brightness-110 shadow-lg"
              style={{ backgroundColor: "#25D366", color: "#fff" }}
            >
              <MessageCircle className="w-5 h-5" />
              {content.ctaText}
            </a>
          </div>
        </section>

        {/* Gallery */}
        <LeadSiteGallery
          images={gallery}
          label={content.galleryLabel}
          heading={content.galleryHeading}
        />

        {/* Services */}
        <section className="py-20" style={{ backgroundColor: `hsl(${colors.secondary})` }}>
          <div className="px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="uppercase text-xs tracking-[0.2em] font-medium mb-3" style={{ color: `hsl(${colors.accent})` }}>{content.servicesLabel}</p>
              <h2 className="salon-heading mb-5">{content.servicesHeading}</h2>
              <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: `hsl(${colors.accent})` }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayServices.map((s: { title: string; desc: string }) => (
                <div key={s.title} className="bg-background rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-display text-xl font-semibold mb-3 text-foreground">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* Contact Form */}
        <section className="py-20" style={{ backgroundColor: `hsl(${colors.secondary})` }}>
          <div className="px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="uppercase text-xs tracking-[0.2em] font-medium mb-3" style={{ color: `hsl(${colors.accent})` }}>Contato</p>
              <h2 className="salon-heading mb-5">Fale conosco</h2>
              <div className="w-16 h-0.5 mx-auto mb-5" style={{ backgroundColor: `hsl(${colors.accent})` }} />
              <p className="text-muted-foreground text-sm">
                Preencha seus dados e envie direto pelo WhatsApp.
              </p>
            </div>
            <LeadSiteContactForm
              phone={lead.phone}
              companyName={displayName}
              services={lead.services_list || undefined}
              colors={colors}
            />
          </div>
        </section>

        {/* Google Maps */}
        <section className="py-20">
          <div className="px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="uppercase text-xs tracking-[0.2em] font-medium mb-3" style={{ color: `hsl(${colors.accent})` }}>Localização</p>
              <h2 className="salon-heading mb-5">Onde estamos</h2>
              <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: `hsl(${colors.accent})` }} />
            </div>
            <div className="rounded-lg overflow-hidden mb-8 shadow-md">
              <iframe
                title={`Localização de ${displayName}`}
                src={`https://maps.google.com/maps?q=${mapsQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onError={(e) => {
                  (e.currentTarget.closest('section') as HTMLElement)?.style.setProperty('display', 'none');
                }}
              />
            </div>
            <div className="text-center">
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors"
                style={{ backgroundColor: `hsl(${colors.primary})`, color: `hsl(${colors.primaryForeground})` }}
              >
                <ExternalLink className="w-4 h-4" />
                Ver no Google Maps
              </a>
            </div>
          </div>
        </section>

        {/* QR Code */}
        <section className="py-20 px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
          <div className="text-center max-w-md mx-auto">
            <p className="uppercase text-xs tracking-[0.2em] font-medium mb-3" style={{ color: `hsl(${colors.accent})` }}>Avalie-nos</p>
            <h2 className="salon-heading mb-5">Sua opinião importa</h2>
            <div className="w-16 h-0.5 mx-auto mb-8" style={{ backgroundColor: `hsl(${colors.accent})` }} />
            <p className="text-muted-foreground text-sm mb-8">
              Sua opinião é muito importante para nós.<br />
              Escaneie o QR Code e deixe sua avaliação no Google.
            </p>
            <div className="inline-block bg-white p-5 rounded-xl shadow-lg">
              <img
                src={qrCodeUrl}
                alt="QR Code para avaliar no Google"
                width={200}
                height={200}
                loading="lazy"
                className="block"
              />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20" style={{ backgroundColor: `hsl(${colors.primary})` }}>
          <div className="px-5 md:px-8 lg:px-16 max-w-5xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-5" style={{ color: `hsl(${colors.primaryForeground})` }}>
              Fale com {displayName}
            </h2>
            <p className="text-base md:text-lg max-w-md mx-auto mb-10 font-body" style={{ color: `hsl(${colors.primaryForeground} / 0.7)` }}>
              Não espere mais. Chame agora e seja atendido em {lead.city} e região.
              {lead.niche === "baterias" ? " Bateria na sua porta com instalação no local e garantia." : ` Cada minuto que você espera é um minuto perdido.`}
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-5 text-lg font-semibold rounded-lg transition-all hover:brightness-110 shadow-xl"
              style={{ backgroundColor: "#25D366", color: "#fff" }}
            >
              <MessageCircle className="w-6 h-6" />
              {content.ctaText}
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: `hsl(${colors.primary})` }}>
        <div className="px-5 md:px-8 lg:px-16 max-w-5xl mx-auto py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="font-display text-lg font-semibold mb-4" style={{ color: `hsl(${colors.primaryForeground})` }}>{displayName}</h3>
              <p className="text-sm leading-relaxed" style={{ color: `hsl(${colors.primaryForeground} / 0.7)` }}>{content.footerTagline}</p>
              {lead.instagram && (
                <a
                  href={`https://instagram.com/${lead.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: `hsl(${colors.accent})` }}
                >
                  <Instagram className="w-4 h-4" />
                  {lead.instagram}
                </a>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm" style={{ color: `hsl(${colors.primaryForeground} / 0.8)` }}>
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: `hsl(${colors.accent})` }} />
                <span>{lead.city}</span>
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: `hsl(${colors.primaryForeground} / 0.8)` }}>
                <Phone className="w-4 h-4 shrink-0" style={{ color: `hsl(${colors.accent})` }} />
                <span>{lead.phone}</span>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-3 text-sm" style={{ color: `hsl(${colors.primaryForeground} / 0.8)` }}>
                <Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: `hsl(${colors.accent})` }} />
                <div>
                  <p>Seg a Sex: 9h às 20h</p>
                  <p>Sáb: 9h às 18h</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 text-center" style={{ borderTop: `1px solid hsl(${colors.primaryForeground} / 0.1)` }}>
            <p className="text-xs" style={{ color: `hsl(${colors.primaryForeground} / 0.5)` }}>
              © {new Date().getFullYear()} {displayName}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chamar no WhatsApp agora"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg transition-transform hover:scale-105 text-white font-semibold text-sm"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline">Chamar no WhatsApp</span>
      </a>
    </div>
  );
};

export default LeadSite;
