export interface SiteContentOverrides {
  heroTitle?: string;
  heroSubtitle?: string;
  urgencyBadge?: string;
  ctaText?: string;
  whatsappMessage?: string;
  servicesTitle?: string;
  servicesSubtitle?: string;
  services?: string[];
  reviewsTitle?: string;
  reviews?: { name: string; text: string; rating: number }[];
  contactTitle?: string;
  contactSubtitle?: string;
  finalCtaTitle?: string;
  finalCtaSubtitle?: string;
  workingHours?: string;
  benefits?: { title: string; desc: string }[];
  heroImage?: string;
  galleryImages?: string[];
}

export function applySiteOverrides(
  content: any,
  overrides: SiteContentOverrides | null | undefined,
  lead: any
) {
  if (!overrides) return content;

  return {
    ...content,
    heroTitle: overrides.heroTitle || content.heroTitle,
    heroSubtitle: overrides.heroSubtitle || content.heroSubtitle,
    urgencyBadge: overrides.urgencyBadge || content.urgencyBadge,
    ctaText: overrides.ctaText || content.ctaText,
    whatsappMessage: overrides.whatsappMessage || content.whatsappMessage,
    reviews: overrides.reviews && overrides.reviews.length > 0 ? overrides.reviews : content.reviews,
  };
}
