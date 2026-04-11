import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getNicheContent, professionalizeName } from "@/lib/niche-content";
import { getGalleryImages, getNicheColors, type GalleryImage } from "@/lib/gallery-images";
import { MessageCircle, MapPin, Phone, Clock, ExternalLink, Instagram } from "lucide-react";
import LeadSiteGallery from "@/components/LeadSiteGallery";
import LeadSiteContactForm from "@/components/LeadSiteContactForm";
import LeadSiteSocialProof from "@/components/LeadSiteSocialProof";
import { generateReviews } from "@/lib/review-generator";
import type { SiteContentOverrides, SiteServiceOverride } from "@/lib/site-content-types";

import ModernoLayout from "@/components/variations/ModernoLayout";
import PremiumLayout from "@/components/variations/PremiumLayout";
import SimplesLayout from "@/components/variations/SimplesLayout";
import PromocaoLayout from "@/components/variations/PromocaoLayout";
import VisualLayout from "@/components/variations/VisualLayout";

/** Helper: return value only if it's a non-empty, meaningful string */
const safe = (v: string | null | undefined): string | undefined => {
  if (!v) return undefined;
  const t = v.trim().replace(/\s+/g, " ");
  const normalized = t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  if (!t || ["nao informado", "sem dado", "sem dados", "n a", "null", "undefined", "nao disponivel"].includes(normalized)) return undefined;
  return t;
};

const uniqueImages = (images: GalleryImage[]) => {
  const seen = new Set<string>();
  return images.filter((image) => {
    const src = image?.src?.trim();
    if (!src || seen.has(src) || /placeholder|null|undefined/i.test(src)) return false;
    seen.add(src);
    return true;
  });
};

const LeadSite = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const variationId = searchParams.get("v");

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
  const city = safe(lead.city);
  const content = getNicheContent(lead.niche, city || "", displayName);
  let colors = getNicheColors(lead.niche);
  const sc: SiteContentOverrides | null = lead.site_content;

  let variation: any = null;
  let variationOverrides: Partial<SiteContentOverrides> = {};
  if (variationId && lead.site_variations) {
    const variations = lead.site_variations as any[];
    variation = variations.find((v: any) => v.id === variationId) || null;
    if (variation) {
      colors = variation.colors;
      variationOverrides = variation.contentOverrides || {};
    }
  }

  const heroTitle = safe(variationOverrides.heroTitle) || safe(sc?.heroTitle) || safe(content.heroTitle) || displayName;
  const heroSubtitle = safe(variationOverrides.heroSubtitle) || safe(sc?.heroSubtitle) || safe(content.heroSubtitle) || "";
  const ctaText = safe(variationOverrides.ctaText) || safe(sc?.ctaText) || safe(content.ctaText) || "Fale no WhatsApp";
  const whatsappMessage = safe(variationOverrides.whatsappMessage) || safe(sc?.whatsappMessage) || safe(content.whatsappMessage) || `Olá! Quero saber mais sobre ${displayName}.`;
  const galleryOverrides = sc?.galleryImages && sc.galleryImages.length > 0 ? sc.galleryImages : undefined;
  const generatedReviews = generateReviews(lead.niche, lead.slug);

  const mapsQuery = encodeURIComponent(`${displayName} ${city || ""}`);
  const mapsLink = lead.google_maps_url || `https://www.google.com/maps/search/${mapsQuery}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mapsLink)}`;

  const displayServices: SiteServiceOverride[] = variationOverrides.services && variationOverrides.services.length > 0
    ? variationOverrides.services
    : lead.services_list && lead.services_list.length > 0
      ? lead.services_list.map((s: string) => ({ title: s, desc: city ? `Atendimento profissional em ${city}. Chame no WhatsApp para saber mais.` : "Chame no WhatsApp para saber mais." }))
      : content.services;

  const benefits = variationOverrides.benefits && variationOverrides.benefits.length > 0
    ? variationOverrides.benefits
    : content.benefits;

  const galleryPool = uniqueImages(getGalleryImages(lead.niche, galleryOverrides || lead.photos || undefined, lead.slug));
  const customHeroImage = sc?.heroImage && !sc.heroImage.startsWith("/src/") ? safe(sc.heroImage) : undefined;
  const heroImage = customHeroImage || galleryPool[0]?.src || content.heroImage;
  const remainingImages = galleryPool.filter((image) => image.src !== heroImage);
  const reservedForServices = Math.min(displayServices.length, Math.max(0, galleryPool.length - 5));
  const serviceImages = remainingImages.slice(0, reservedForServices);
  const gallery = remainingImages.slice(reservedForServices, reservedForServices + 8);

  const instagram = safe(lead.instagram);
  const description = safe(lead.description);

  const safeNiche = safe(lead.niche);
  const whatsappLink = `https://wa.me/${lead.phone}?text=${encodeURIComponent(whatsappMessage)}`;

  const layoutProps = {
    lead: { ...lead, city: city || "", instagram, description, niche: safeNiche || "" },
    displayName,
    heroTitle,
    heroSubtitle,
    ctaText,
    whatsappLink,
    heroImage,
    gallery,
    serviceImages,
    reviews: generatedReviews,
    services: displayServices,
    benefits,
    colors,
    variationLabel: variation?.label,
    content,
    mapsLink,
    mapsQuery,
    qrCodeUrl,
  };

  // Render variation-specific layout
  if (variationId === "moderno") return <ModernoLayout {...layoutProps} />;
  if (variationId === "premium") return <PremiumLayout {...layoutProps} />;
  if (variationId === "simples") return <SimplesLayout {...layoutProps} />;
  if (variationId === "promocao") return <PromocaoLayout {...layoutProps} />;
  if (variationId === "visual") return <VisualLayout {...layoutProps} />;

  // Default layout
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
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 max-w-5xl mx-auto">
          <div className="min-w-0">
            <h1 className="font-display text-base sm:text-xl font-semibold tracking-tight text-foreground truncate">
              {displayName}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
            {city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" style={{ color: `hsl(${colors.accent})` }} />
                {city}
              </span>
            )}
            {instagram && (
              <a
                href={`https://instagram.com/${instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                style={{ color: `hsl(${colors.accent})` }}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{instagram}</span>
              </a>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden min-h-[55vh] sm:min-h-[70vh] md:min-h-[85vh] flex items-end">
          <img
            src={heroImage}
            alt={displayName}
            className="absolute inset-0 w-full h-full object-cover z-0"
            width={1280}
            height={832}
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          <div className="relative z-[2] px-4 sm:px-5 max-w-5xl mx-auto w-full pb-10 pt-20 sm:pb-14 md:pb-24">
            <div className="w-10 sm:w-12 md:w-16 h-0.5 mb-4 sm:mb-5 md:mb-6" style={{ backgroundColor: `hsl(${colors.accent})` }} />
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug sm:leading-tight font-semibold mb-3 sm:mb-4 text-white drop-shadow-lg">
              {heroTitle}
            </h2>
            <p className="text-white/85 font-body text-sm sm:text-base md:text-lg max-w-lg mb-3 sm:mb-4 leading-relaxed drop-shadow">
              {heroSubtitle}
            </p>
            {city && (
              <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm bg-white/10 text-white/90">
                  <MapPin className="w-3.5 h-3.5" style={{ color: `hsl(${colors.accent})` }} />
                  {city}
                </span>
              </div>
            )}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold rounded-lg transition-all hover:brightness-110 shadow-lg"
              style={{ backgroundColor: "#25D366", color: "#fff" }}
            >
              <MessageCircle className="w-5 h-5" />
              {ctaText}
            </a>
          </div>
        </section>

        {/* Benefits strip */}
        <section className="py-6 md:py-8" style={{ backgroundColor: `hsl(${colors.primary})` }}>
          <div className="px-4 sm:px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-xs sm:text-sm font-medium" style={{ color: `hsl(${colors.primaryForeground})` }}>
                  <span style={{ color: `hsl(${colors.accent})` }}>✓</span>
                  {typeof benefit === 'string' ? benefit : benefit.title}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <LeadSiteSocialProof reviews={generatedReviews} colors={colors} />

        {/* Gallery */}
        {gallery.length > 0 && (
          <LeadSiteGallery
            images={gallery}
            label={content.galleryLabel}
            heading="Galeria do negócio"
          />
        )}

        {/* Services */}
        <section className="py-12 md:py-20">
          <div className="px-4 sm:px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
            <div className="mb-14 text-center">
              <p className="uppercase text-xs tracking-[0.2em] font-medium mb-3" style={{ color: `hsl(${colors.accent})` }}>
                {content.servicesLabel}
              </p>
              <h2 className="salon-heading mb-5">{content.servicesHeading}</h2>
              <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: `hsl(${colors.accent})` }} />
            </div>
            <div id="servicos" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayServices.map((s, index) => (
                <div key={s.title} className="bg-background rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
                  {serviceImages[index] && (
                    <img
                      src={serviceImages[index].src}
                      alt={serviceImages[index].alt || s.title}
                      className="w-full h-48 object-cover rounded-lg mb-5"
                      loading="lazy"
                    />
                  )}
                  <h3 className="font-display text-xl font-semibold mb-3 text-foreground">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-12 md:py-20 px-4 sm:px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <p className="uppercase text-xs tracking-[0.2em] font-medium mb-3" style={{ color: `hsl(${colors.accent})` }}>{content.aboutLabel}</p>
            <h2 className="salon-heading mb-5 whitespace-pre-line">{content.aboutHeading}</h2>
            <div className="w-16 h-0.5 mb-8 mx-auto" style={{ backgroundColor: `hsl(${colors.accent})` }} />
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {description || content.aboutText}
            </p>
          </div>
        </section>

        {/* Contact form */}
        <section className="py-12 md:py-20" style={{ backgroundColor: `hsl(${colors.secondary})` }}>
          <div className="px-4 sm:px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="uppercase text-xs tracking-[0.2em] font-medium mb-3" style={{ color: `hsl(${colors.accent})` }}>Contato</p>
              <h2 className="salon-heading mb-5">Fale conosco</h2>
              <div className="w-16 h-0.5 mx-auto mb-5" style={{ backgroundColor: `hsl(${colors.accent})` }} />
              <p className="text-muted-foreground text-sm">Preencha seus dados e envie direto pelo WhatsApp.</p>
            </div>
            <LeadSiteContactForm
              phone={lead.phone}
              companyName={displayName}
              services={lead.services_list || undefined}
              colors={colors}
            />
          </div>
        </section>

        {/* Map — only if city exists */}
        {city && (
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
        )}

        {/* QR Code */}
        <section className="py-12 md:py-20 px-4 sm:px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
          <div className="text-center max-w-md mx-auto">
            <p className="uppercase text-xs tracking-[0.2em] font-medium mb-3" style={{ color: `hsl(${colors.accent})` }}>Avalie-nos</p>
            <h2 className="salon-heading mb-5">Sua opinião importa</h2>
            <div className="w-16 h-0.5 mx-auto mb-8" style={{ backgroundColor: `hsl(${colors.accent})` }} />
            <p className="text-muted-foreground text-sm mb-8">
              Escaneie o QR Code e deixe sua avaliação no Google.
            </p>
            <div className="inline-block bg-white p-5 rounded-xl shadow-lg">
              <img src={qrCodeUrl} alt="QR Code para avaliar no Google" width={200} height={200} loading="lazy" className="block" />
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
              {city ? `Atendimento profissional em ${city} e região.` : "Atendimento profissional."} Fale conosco pelo WhatsApp.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-lg transition-all hover:brightness-110 shadow-lg"
              style={{ backgroundColor: "#25D366", color: "#fff" }}
            >
              <MessageCircle className="w-5 h-5" />
              {ctaText}
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
              {instagram && (
                <a href={`https://instagram.com/${instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm hover:opacity-80 transition-opacity"
                  style={{ color: `hsl(${colors.accent})` }}>
                  <Instagram className="w-4 h-4" />
                  {instagram}
                </a>
              )}
            </div>
            <div className="space-y-4">
              {city && (
                <div className="flex items-start gap-3 text-sm" style={{ color: `hsl(${colors.primaryForeground} / 0.8)` }}>
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: `hsl(${colors.accent})` }} />
                  <span>{city}</span>
                </div>
              )}
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

      {/* Floating WhatsApp */}
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
