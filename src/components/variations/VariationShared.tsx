// Shared types and helpers for all variation layouts
import type { SiteServiceOverride, SiteContentOverrides } from "@/lib/site-content-types";
import type { GalleryImage } from "@/lib/gallery-images";
import type { GeneratedReview } from "@/lib/review-generator";

export interface VariationLayoutProps {
  lead: any;
  displayName: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  whatsappLink: string;
  heroImage: string;
  gallery: GalleryImage[];
  serviceImages: GalleryImage[];
  reviews: GeneratedReview[];
  services: SiteServiceOverride[];
  benefits: (string | { title: string; desc: string })[];
  colors: { primary: string; primaryForeground: string; accent: string; secondary: string };
  variationLabel?: string;
  content: any;
  mapsLink: string;
  mapsQuery: string;
  qrCodeUrl: string;
}
