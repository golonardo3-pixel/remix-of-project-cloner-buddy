// Shared types and helpers for all variation layouts
import type { SiteServiceOverride, SiteContentOverrides } from "@/lib/site-content-types";

export interface VariationLayoutProps {
  lead: any;
  displayName: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  whatsappLink: string;
  heroImage: string;
  gallery: string[];
  reviews: { name: string; text: string; rating: number }[];
  services: SiteServiceOverride[];
  benefits: (string | { title: string; desc: string })[];
  colors: { primary: string; primaryForeground: string; accent: string; secondary: string };
  variationLabel?: string;
  content: any;
  mapsLink: string;
  mapsQuery: string;
  qrCodeUrl: string;
}
