export interface SiteServiceOverride {
  title: string;
  desc: string;
}

export interface SiteBenefitOverride {
  title: string;
  desc: string;
}

export interface SiteContentOverrides {
  heroTitle?: string;
  heroSubtitle?: string;
  urgencyBadge?: string;
  ctaText?: string;
  whatsappMessage?: string;
  servicesTitle?: string;
  servicesSubtitle?: string;
  services?: SiteServiceOverride[];
  reviewsTitle?: string;
  reviews?: { name: string; text: string; rating: number }[];
  contactTitle?: string;
  contactSubtitle?: string;
  finalCtaTitle?: string;
  finalCtaSubtitle?: string;
  workingHours?: string;
  benefits?: SiteBenefitOverride[];
  heroImage?: string;
  galleryImages?: string[];
}

export function applySiteOverrides(
  content: any,
  overrides: SiteContentOverrides | null | undefined,
  lead: any,
) {
  if (!overrides) return content;

  return {
    ...content,
    heroTitle: overrides.heroTitle || content.heroTitle,
    heroSubtitle: overrides.heroSubtitle || content.heroSubtitle,
    urgencyBadge: overrides.urgencyBadge || content.urgencyBadge,
    ctaText: overrides.ctaText || content.ctaText,
    whatsappMessage: overrides.whatsappMessage || content.whatsappMessage,
    servicesHeading: overrides.servicesTitle || content.servicesHeading,
    servicesLabel: overrides.servicesSubtitle || content.servicesLabel,
    contactTitle: overrides.contactTitle || content.contactTitle,
    contactSubtitle: overrides.contactSubtitle || content.contactSubtitle,
    finalCtaTitle: overrides.finalCtaTitle || content.finalCtaTitle,
    finalCtaSubtitle: overrides.finalCtaSubtitle || content.finalCtaSubtitle,
    workingHours: overrides.workingHours || content.workingHours,
    benefits: overrides.benefits && overrides.benefits.length > 0 ? overrides.benefits : content.benefits,
    services: overrides.services && overrides.services.length > 0 ? overrides.services : content.services,
    reviews: overrides.reviews && overrides.reviews.length > 0 ? overrides.reviews : content.reviews,
    heroImage: overrides.heroImage || content.heroImage,
    galleryImages:
      overrides.galleryImages && overrides.galleryImages.length > 0
        ? overrides.galleryImages
        : content.galleryImages,
    lead,
  };
}
