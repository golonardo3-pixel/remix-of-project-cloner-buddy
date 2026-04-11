import type { SiteContentOverrides } from "./site-content-types";

export interface SiteVariation {
  id: string;
  name: string;
  label: string;
  colors: {
    primary: string;
    primaryForeground: string;
    accent: string;
    secondary: string;
  };
  contentOverrides: Partial<SiteContentOverrides>;
}

const VARIATION_PRESETS: Omit<SiteVariation, "contentOverrides">[] = [
  {
    id: "moderno",
    name: "moderno",
    label: "Moderno",
    colors: {
      primary: "220 20% 15%",
      primaryForeground: "0 0% 98%",
      accent: "210 100% 55%",
      secondary: "220 15% 96%",
    },
  },
  {
    id: "premium",
    name: "premium",
    label: "Premium",
    colors: {
      primary: "30 10% 12%",
      primaryForeground: "40 60% 90%",
      accent: "40 80% 55%",
      secondary: "30 15% 95%",
    },
  },
  {
    id: "simples",
    name: "simples",
    label: "Simples",
    colors: {
      primary: "0 0% 15%",
      primaryForeground: "0 0% 95%",
      accent: "160 60% 45%",
      secondary: "0 0% 97%",
    },
  },
  {
    id: "promocao",
    name: "promocao",
    label: "Promoção",
    colors: {
      primary: "350 80% 40%",
      primaryForeground: "0 0% 100%",
      accent: "45 100% 55%",
      secondary: "350 30% 96%",
    },
  },
  {
    id: "visual",
    name: "visual",
    label: "Visual",
    colors: {
      primary: "270 40% 20%",
      primaryForeground: "270 20% 95%",
      accent: "300 60% 60%",
      secondary: "270 20% 96%",
    },
  },
];

function generateVariationContent(
  variationId: string,
  companyName: string,
  city: string,
  niche: string
): Partial<SiteContentOverrides> {
  switch (variationId) {
    case "moderno":
      return {
        heroTitle: `${companyName} — Referência em ${city}`,
        heroSubtitle: `Tecnologia e inovação a serviço do seu negócio. Conheça nosso trabalho.`,
        ctaText: "Falar com a gente",
        urgencyBadge: `Atendimento digital em ${city}`,
      };
    case "premium":
      return {
        heroTitle: `${companyName}`,
        heroSubtitle: `Experiência exclusiva e atendimento personalizado em ${city}. Qualidade que você merece.`,
        ctaText: "Agendar atendimento",
        urgencyBadge: `Atendimento premium`,
      };
    case "simples":
      return {
        heroTitle: `${companyName} em ${city}`,
        heroSubtitle: `Atendimento profissional, rápido e de confiança. Chame no WhatsApp.`,
        ctaText: "Chamar no WhatsApp",
        urgencyBadge: `Disponível agora`,
      };
    case "promocao":
      return {
        heroTitle: `${companyName} — Condição Especial`,
        heroSubtitle: `Aproveite condições exclusivas para novos clientes em ${city}.`,
        ctaText: "Quero aproveitar",
        urgencyBadge: `Oferta por tempo limitado`,
      };
    case "visual":
      return {
        heroTitle: `Conheça o ${companyName}`,
        heroSubtitle: `Veja nosso trabalho e descubra por que somos referência em ${niche} na região de ${city}.`,
        ctaText: "Ver mais e conversar",
        urgencyBadge: `Galeria de trabalhos`,
      };
    default:
      return {};
  }
}

export function generateAllVariations(
  companyName: string,
  city: string,
  niche: string
): SiteVariation[] {
  return VARIATION_PRESETS.map((preset) => ({
    ...preset,
    contentOverrides: generateVariationContent(preset.id, companyName, city, niche),
  }));
}

export function getVariationById(
  variations: SiteVariation[],
  id: string
): SiteVariation | undefined {
  return variations.find((v) => v.id === id);
}
