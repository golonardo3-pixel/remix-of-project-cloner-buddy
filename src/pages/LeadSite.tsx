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
import type { SiteContentOverrides } from "@/lib/site-content-types";

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
  const sc: SiteContentOverrides | null = lead.site_content;

  const galleryOverrides = sc?.galleryImages && sc.galleryImages.length > 0 ? sc.galleryImages : undefined;
  const gallery = getGalleryImages(lead.niche, galleryOverrides || lead.photos || undefined, lead.slug);
  
  const whatsappLink = `https://wa.me/${lead.phone}?text=${encodeURIComponent(content.whatsappMessage)}`;
  const generatedReviews = generateReviews(lead.niche, lead.slug);
  
  const hasGoogleMapsUrl = lead.google_maps_url;
  const mapsQuery = encodeURIComponent(`${displayName} ${lead.city}`);
  const mapsEmbedUrl = hasGoogleMapsUrl
    ? `https://www.google.com/maps?q=${encodeURIComponent(lead.google_maps_url)}&output=embed`
    : `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
  const mapsLink = hasGoogleMapsUrl || `https://www.google.com/maps/search/${mapsQuery}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mapsLink)}`;

  const displayServices = lead.services_list && lead.services_list.length > 0
    ? lead.services_list.map((s: string) => ({ title: s, desc: `Serviço profissional de qualidade em ${lead.city}. Chame no WhatsApp para saber mais.` }))
    : content.services;

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

      {/* Header — clean, name only */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 max-w-5xl mx-auto">
          <h1 className="font-display text-base sm:text-xl font-semibold tracking-tight text-foreground">
            {displayName}
          </h1>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" style={{ color: `hsl(${colors.accent})` }} />
              {lead.city}
            </span>
            {lead.instagram && (
              <a
                href={`https://instagram.com/${lead.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                style={{ color: `hsl(${colors.accent})` }}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lead.instagram}</span>
              </a>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero — single primary CTA */}
        <section className="relative min-h-[55vh] sm:min-h-[70vh] md:min-h-[85vh] flex items-end overflow-hidden">
          <img
            src={sc?.heroImage && !sc.heroImage.startsWith("/src/") ? sc.heroImage : content.heroImage}
            alt={`${displayName} - ${lead.niche} em ${lead.city}`}
            className="absolute inset-0 w-full h-full object-cover z-0"
            width={1280}
            height={832}
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          <div className="relative z-[2] px-4 sm:px-5 pb-10 pt-20 sm:pb-14 md:pb-24 max-w-5xl mx-auto w-full">
            <div className="w-10 sm:w-12 md:w-16 h-0.5 mb-4 sm:mb-5 md:mb-6" style={{ backgroundColor: `hsl(${colors.accent})` }} />
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug sm:leading-tight mb-3 sm:mb-4 text-white drop-shadow-lg">
              {content.heroTitle}
            </h2>
            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-lg mb-3 sm:mb-4 font-body leading-relaxed drop-shadow">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm bg-white/10 text-white/90">
                <MapPin className="w-3.5 h-3.5" style={{ color: `hsl(${colors.accent})` }} />
                {lead.city}
              </span>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold rounded-lg transition-all hover:brightness-110 shadow-lg"
              style={{ backgroundColor: "#25D366", color: "#fff" }}
            >
              <MessageCircle className="w-5 h-5" />
              {content.ctaText}
            </a>
          </div>
        </section>

        {/* Benefits Strip */}
        <section className="py-6 md:py-8" style={{ backgroundColor: `hsl(${colors.primary})` }}>
          <div className="px-4 sm:px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {content.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-xs sm:text-sm font-medium" style={{ color: `hsl(${colors.primaryForeground})` }}>
                  <span style={{ color: `hsl(${colors.accent})` }}>✓</span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <LeadSiteSocialProof reviews={generatedReviews} colors={colors} />

        {/* About */}
        <section className="py-12 md:py-20 px-4 sm:px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <p className="uppercase text-xs tracking-[0.2em] font-medium mb-3" style={{ color: `hsl(${colors.accent})` }}>{content.aboutLabel}</p>
            <h2 className="salon-heading mb-5 whitespace-pre-line">{content.aboutHeading}</h2>
            <div className="w-16 h-0.5 mx-auto mb-8" style={{ backgroundColor: `hsl(${colors.accent})` }} />
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {lead.description || content.aboutText}
            </p>
          </div>
        </section>

        {/* Gallery */}
        <LeadSiteGallery
          images={gallery}
          label={content.galleryLabel}
          heading={content.galleryHeading}
        />

        {/* Services */}
        <section className="py-12 md:py-20" style={{ backgroundColor: `hsl(${colors.secondary})` }}>
          <div className="px-4 sm:px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
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
        <section className="py-12 md:py-20" style={{ backgroundColor: `hsl(${colors.secondary})` }}>
          <div className="px-4 sm:px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
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
        <section className="py-12 md:py-20">
          <div className="px-4 sm:px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
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
        <section className="py-12 md:py-20 px-4 sm:px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
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
        <section className="py-14 md:py-20" style={{ backgroundColor: `hsl(${colors.primary})` }}>
          <div className="px-4 sm:px-5 md:px-8 lg:px-16 max-w-5xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold mb-4" style={{ color: `hsl(${colors.primaryForeground})` }}>
              Entre em contato
            </h2>
            <p className="text-sm md:text-base max-w-md mx-auto mb-8 font-body" style={{ color: `hsl(${colors.primaryForeground} / 0.7)` }}>
              Atendimento profissional em {lead.city} e região. Fale conosco pelo WhatsApp.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-lg transition-all hover:brightness-110 shadow-lg"
              style={{ backgroundColor: "#25D366", color: "#fff" }}
            >
              <MessageCircle className="w-5 h-5" />
              {content.ctaText}
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: `hsl(${colors.primary})` }}>
        <div className="px-4 sm:px-5 md:px-8 lg:px-16 max-w-5xl mx-auto py-10 md:py-14">
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

      {/* WhatsApp Float — only floating button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chamar no WhatsApp agora"
        className="fixed bottom-5 right-5 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-105 text-white"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
};

export default LeadSite;
