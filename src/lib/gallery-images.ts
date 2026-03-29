// Gallery images per niche - each niche uses ONLY its own images
import salon1 from "@/assets/gallery/salon-1.jpg";
import salon2 from "@/assets/gallery/salon-2.jpg";
import salon3 from "@/assets/gallery/salon-3.jpg";
import salon4 from "@/assets/gallery/salon-4.jpg";
import salon5 from "@/assets/gallery/salon-5.jpg";
import salon6 from "@/assets/gallery/salon-6.jpg";
import salon7 from "@/assets/gallery/salon-7.jpg";
import salon8 from "@/assets/gallery/salon-8.jpg";
import salon9 from "@/assets/gallery/salon-9.jpg";
import salon10 from "@/assets/gallery/salon-10.jpg";

import barber1 from "@/assets/gallery/barber-1.jpg";
import barber2 from "@/assets/gallery/barber-2.jpg";
import barber3 from "@/assets/gallery/barber-3.jpg";
import barber4 from "@/assets/gallery/barber-4.jpg";
import barber5 from "@/assets/gallery/barber-5.jpg";
import barber6 from "@/assets/gallery/barber-6.jpg";

import dental1 from "@/assets/gallery/dental-1.jpg";
import dental2 from "@/assets/gallery/dental-2.jpg";
import dental3 from "@/assets/gallery/dental-3.jpg";
import dental4 from "@/assets/gallery/dental-4.jpg";
import dental5 from "@/assets/gallery/dental-5.jpg";
import dental7 from "@/assets/gallery/dental-7.jpg";

import burger1 from "@/assets/gallery/burger-1.jpg";
import burger2 from "@/assets/gallery/burger-2.jpg";
import burger3 from "@/assets/gallery/burger-3.jpg";
import burger4 from "@/assets/gallery/burger-4.jpg";
import burger5 from "@/assets/gallery/burger-5.jpg";
import burger6 from "@/assets/gallery/burger-6.jpg";
import burger7 from "@/assets/gallery/burger-7.jpg";

import gym1 from "@/assets/gallery/gym-1.jpg";
import gym2 from "@/assets/gallery/gym-2.jpg";
import gym3 from "@/assets/gallery/gym-3.jpg";
import gym4 from "@/assets/gallery/gym-4.jpg";
import gym5 from "@/assets/gallery/gym-5.jpg";
import gym6 from "@/assets/gallery/gym-6.jpg";

import mechanic1 from "@/assets/gallery/mechanic-1.jpg";
import mechanic2 from "@/assets/gallery/mechanic-2.jpg";
import mechanic3 from "@/assets/gallery/mechanic-3.jpg";
import mechanic4 from "@/assets/gallery/mechanic-4.jpg";
import mechanic5 from "@/assets/gallery/mechanic-5.jpg";
import mechanic6 from "@/assets/gallery/mechanic-6.jpg";

import petshop1 from "@/assets/gallery/petshop-1.jpg";
import petshop2 from "@/assets/gallery/petshop-2.jpg";
import petshop3 from "@/assets/gallery/petshop-3.jpg";
import petshop4 from "@/assets/gallery/petshop-4.jpg";
import petshop5 from "@/assets/gallery/petshop-5.jpg";
import petshop6 from "@/assets/gallery/petshop-6.jpg";

import aesthetics1 from "@/assets/gallery/aesthetics-1.jpg";
import aesthetics2 from "@/assets/gallery/aesthetics-2.jpg";
import aesthetics3 from "@/assets/gallery/aesthetics-3.jpg";
import aesthetics5 from "@/assets/gallery/aesthetics-5.jpg";
import aesthetics6 from "@/assets/gallery/aesthetics-6.jpg";

import restaurant1 from "@/assets/gallery/restaurant-1.jpg";
import restaurant2 from "@/assets/gallery/restaurant-2.jpg";
import restaurant3 from "@/assets/gallery/restaurant-3.jpg";
import restaurant4 from "@/assets/gallery/restaurant-4.jpg";
import restaurant5 from "@/assets/gallery/restaurant-5.jpg";
import restaurant6 from "@/assets/gallery/restaurant-6.jpg";

import batteries1 from "@/assets/gallery/batteries-1.jpg";
import batteries2 from "@/assets/gallery/batteries-2.jpg";
import batteries3 from "@/assets/gallery/batteries-3.jpg";
import batteries4 from "@/assets/gallery/batteries-4.jpg";
import batteries5 from "@/assets/gallery/batteries-5.jpg";
import batteries6 from "@/assets/gallery/batteries-6.jpg";

import marmitaria1 from "@/assets/gallery/marmitaria-1.jpg";
import marmitaria2 from "@/assets/gallery/marmitaria-2.jpg";
import marmitaria3 from "@/assets/gallery/marmitaria-3.jpg";
import marmitaria4 from "@/assets/gallery/marmitaria-4.jpg";
import marmitaria5 from "@/assets/gallery/marmitaria-5.jpg";

import realestate1 from "@/assets/gallery/realestate-1.jpg";
import realestate2 from "@/assets/gallery/realestate-2.jpg";
import realestate3 from "@/assets/gallery/realestate-3.jpg";
import realestate4 from "@/assets/gallery/realestate-4.jpg";
import realestate5 from "@/assets/gallery/realestate-5.jpg";
import realestate6 from "@/assets/gallery/realestate-6.jpg";

import accounting1 from "@/assets/gallery/accounting-1.jpg";
import accounting2 from "@/assets/gallery/accounting-2.jpg";
import accounting3 from "@/assets/gallery/accounting-3.jpg";
import accounting4 from "@/assets/gallery/accounting-4.jpg";
import accounting5 from "@/assets/gallery/accounting-5.jpg";

import physio1 from "@/assets/gallery/physio-1.jpg";
import physio2 from "@/assets/gallery/physio-2.jpg";
import physio3 from "@/assets/gallery/physio-3.jpg";
import physio4 from "@/assets/gallery/physio-4.jpg";

// Hero images
import heroSalon from "@/assets/hero-salon.jpg";
import heroBarbershop from "@/assets/hero-barbershop.jpg";
import heroDental from "@/assets/hero-dental.jpg";
import heroRestaurant from "@/assets/hero-restaurant.jpg";
import heroGym from "@/assets/hero-gym.jpg";
import heroAesthetics from "@/assets/hero-aesthetics.jpg";
import heroPetshop from "@/assets/hero-petshop.jpg";
import heroMechanic from "@/assets/hero-mechanic.jpg";
import heroBatteries from "@/assets/hero-batteries.jpg";
import heroMarmitaria from "@/assets/hero-marmitaria.jpg";
import heroRealestate from "@/assets/hero-realestate.jpg";
import heroAccounting from "@/assets/hero-accounting.jpg";
import heroPhysiotherapy from "@/assets/hero-physiotherapy.jpg";
import heroDefault from "@/assets/hero-default.jpg";

export interface GalleryImage {
  src: string;
  alt: string;
}

// RULE: Each niche uses ONLY its own images. NO cross-niche sharing. Min 8 per niche.
const galleryMap: Record<string, GalleryImage[]> = {
  "salão de beleza": [
    { src: heroSalon, alt: "Interior do salão de beleza" },
    { src: salon1, alt: "Cadeiras e espelhos do salão" },
    { src: salon2, alt: "Coloração profissional de cabelo" },
    { src: salon3, alt: "Lavagem e tratamento capilar" },
    { src: salon4, alt: "Manicure profissional" },
    { src: salon5, alt: "Fachada elegante do salão" },
    { src: salon6, alt: "Produtos de beleza premium" },
    { src: salon7, alt: "Linha de produtos capilares" },
    { src: salon8, alt: "Alisamento com chapinha profissional" },
    { src: salon9, alt: "Recepção e área de espera" },
    { src: salon10, alt: "Resultado de coloração" },
  ],
  "barbearia": [
    { src: heroBarbershop, alt: "Ambiente da barbearia" },
    { src: barber1, alt: "Interior da barbearia com cadeiras" },
    { src: barber2, alt: "Corte degradê preciso" },
    { src: barber3, alt: "Tratamento de barba com toalha" },
    { src: barber4, alt: "Ferramentas profissionais de barbeiro" },
    { src: barber5, alt: "Cliente satisfeito com o corte" },
    { src: barber6, alt: "Corte fade perfeito" },
  ],
  "estética": [
    { src: heroAesthetics, alt: "Clínica de estética moderna" },
    { src: aesthetics1, alt: "Sala de tratamento estético" },
    { src: aesthetics2, alt: "Procedimento facial profissional" },
    { src: aesthetics3, alt: "Produtos dermatológicos premium" },
    { src: aesthetics5, alt: "Sala de procedimentos moderna" },
    { src: aesthetics6, alt: "Linha de produtos de skincare" },
  ],
  "clínica odontológica": [
    { src: heroDental, alt: "Consultório odontológico moderno" },
    { src: dental1, alt: "Equipamentos de odontologia" },
    { src: dental2, alt: "Recepção da clínica odontológica" },
    { src: dental3, alt: "Sala de espera da clínica" },
    { src: dental4, alt: "Procedimento de clareamento dental" },
    { src: dental5, alt: "Instrumentos odontológicos esterilizados" },
    { src: dental7, alt: "Radiografia panorâmica digital" },
  ],
  "fisioterapia": [
    { src: heroPhysiotherapy, alt: "Sessão de fisioterapia" },
    { src: physio1, alt: "Reabilitação de joelho" },
    { src: physio2, alt: "Sala de pilates clínico" },
    { src: physio3, alt: "Sessão de alongamento com fisioterapeuta" },
    { src: physio4, alt: "Sala de exercícios com bolas e faixas" },
  ],
  "pet shop": [
    { src: heroPetshop, alt: "Pet shop acolhedor" },
    { src: petshop1, alt: "Tosa profissional de cachorro" },
    { src: petshop2, alt: "Cachorro no banho" },
    { src: petshop3, alt: "Produtos e acessórios para pets" },
    { src: petshop4, alt: "Filhotes no banho e tosa" },
    { src: petshop5, alt: "Prateleira de rações e produtos" },
    { src: petshop6, alt: "Veterinária examinando gato" },
  ],
  "oficina mecânica": [
    { src: heroMechanic, alt: "Oficina mecânica equipada" },
    { src: mechanic1, alt: "Mecânico trabalhando no motor" },
    { src: mechanic2, alt: "Carro no elevador da oficina" },
    { src: mechanic3, alt: "Diagnóstico automotivo digital" },
    { src: mechanic4, alt: "Mecânico inspecionando motor" },
    { src: mechanic5, alt: "Troca de pneus profissional" },
    { src: mechanic6, alt: "Reparo de freio a disco" },
  ],
  "baterias": [
    { src: heroBatteries, alt: "Loja de baterias automotivas" },
    { src: batteries1, alt: "Baterias automotivas em estoque" },
    { src: batteries2, alt: "Prateleira de baterias Moura e Heliar" },
    { src: batteries3, alt: "Instalação de bateria no veículo" },
    { src: batteries4, alt: "Mecânico instalando bateria nova" },
    { src: batteries5, alt: "Van de socorro de baterias" },
    { src: batteries6, alt: "Teste de bateria com multímetro" },
  ],
  "restaurante": [
    { src: heroRestaurant, alt: "Ambiente gastronômico" },
    { src: restaurant1, alt: "Salão do restaurante" },
    { src: restaurant2, alt: "Mesas preparadas para jantar" },
    { src: restaurant3, alt: "Prato gourmet do chef" },
    { src: restaurant4, alt: "Salão de jantar elegante" },
    { src: restaurant5, alt: "Chef preparando prato" },
    { src: restaurant6, alt: "Embalagens para delivery" },
  ],
  "hamburgueria": [
    { src: burger1, alt: "Hambúrguer artesanal" },
    { src: burger2, alt: "Smash burger com queijo" },
    { src: burger3, alt: "Interior da hamburgueria" },
    { src: burger4, alt: "Montagem do hambúrguer gourmet" },
    { src: burger5, alt: "Batata frita crocante" },
    { src: burger6, alt: "Balcão da hamburgueria" },
    { src: burger7, alt: "Combo hambúrguer com batata e milk" },
  ],
  "marmitaria": [
    { src: heroMarmitaria, alt: "Marmitas frescas e saborosas" },
    { src: marmitaria1, alt: "Marmitas preparadas com arroz e feijão" },
    { src: marmitaria2, alt: "Chef preparando refeições" },
    { src: marmitaria3, alt: "Marmita completa com divisórias" },
    { src: marmitaria4, alt: "Cozinha industrial com marmitas" },
    { src: marmitaria5, alt: "Entrega de marmitas por motoboy" },
  ],
  "academia": [
    { src: heroGym, alt: "Academia moderna equipada" },
    { src: gym1, alt: "Área de musculação" },
    { src: gym2, alt: "Rack de halteres e pesos" },
    { src: gym3, alt: "Área de cardio com esteiras" },
    { src: gym4, alt: "Sala de cardio com equipamentos" },
    { src: gym5, alt: "Aula de grupo fitness" },
    { src: gym6, alt: "Personal trainer com aluna" },
  ],
  "imobiliária": [
    { src: heroRealestate, alt: "Imóvel de alto padrão" },
    { src: realestate1, alt: "Edifício residencial moderno" },
    { src: realestate2, alt: "Sala de estar ampla e decorada" },
    { src: realestate3, alt: "Fachada de condomínio" },
    { src: realestate4, alt: "Corretor mostrando imóvel" },
    { src: realestate5, alt: "Cozinha moderna planejada" },
    { src: realestate6, alt: "Área de lazer com piscina" },
  ],
  "contabilidade": [
    { src: heroAccounting, alt: "Escritório contábil profissional" },
    { src: accounting1, alt: "Estação de trabalho organizada" },
    { src: accounting2, alt: "Reunião com contador" },
    { src: accounting3, alt: "Consulta com cliente" },
    { src: accounting4, alt: "Documentos e calculadora" },
    { src: accounting5, alt: "Sala de reuniões corporativa" },
  ],
};

const defaultGallery: GalleryImage[] = [
  { src: heroDefault, alt: "Nosso espaço profissional" },
];

// Simple hash from string to get a deterministic seed for shuffling
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Deterministic shuffle using slug as seed (so each lead gets a unique order)
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getGalleryImages(niche: string, uploadedPhotos?: string[], slug?: string): GalleryImage[] {
  // If there are uploaded photos, prioritize them
  const uploaded: GalleryImage[] = (uploadedPhotos || []).map((url, i) => ({
    src: url,
    alt: `Foto do estabelecimento ${i + 1}`,
  }));

  const key = niche.toLowerCase().trim();
  let nicheImages: GalleryImage[] = [];
  if (galleryMap[key]) {
    nicheImages = [...galleryMap[key]];
  } else {
    for (const [k, v] of Object.entries(galleryMap)) {
      if (key.includes(k) || k.includes(key)) {
        nicheImages = [...v];
        break;
      }
    }
  }

  // Shuffle stock images by slug so different leads show different order
  if (slug && nicheImages.length > 1) {
    nicheImages = seededShuffle(nicheImages, hashCode(slug));
  }

  if (uploaded.length > 0) {
    // Uploaded photos first, then fill with niche stock to reach 8+
    const needed = Math.max(0, 8 - uploaded.length);
    return [...uploaded, ...nicheImages.slice(0, needed)];
  }

  return nicheImages.length > 0 ? nicheImages : defaultGallery;
}

// Niche-specific color schemes (HSL values)
export interface NicheColors {
  primary: string;
  primaryForeground: string;
  accent: string;
  secondary: string;
}

const nicheColorMap: Record<string, NicheColors> = {
  "salão de beleza": { primary: "280 20% 18%", primaryForeground: "280 15% 97%", accent: "38 60% 55%", secondary: "280 12% 94%" },
  "barbearia": { primary: "25 15% 15%", primaryForeground: "35 30% 95%", accent: "30 50% 45%", secondary: "25 10% 92%" },
  "estética": { primary: "320 18% 18%", primaryForeground: "320 15% 97%", accent: "340 45% 60%", secondary: "320 12% 95%" },
  "clínica odontológica": { primary: "200 30% 20%", primaryForeground: "200 20% 97%", accent: "200 60% 50%", secondary: "200 20% 95%" },
  "fisioterapia": { primary: "170 25% 20%", primaryForeground: "170 20% 97%", accent: "170 50% 45%", secondary: "170 15% 95%" },
  "pet shop": { primary: "145 25% 18%", primaryForeground: "145 15% 97%", accent: "145 50% 45%", secondary: "145 15% 94%" },
  "oficina mecânica": { primary: "220 20% 18%", primaryForeground: "220 15% 97%", accent: "40 80% 50%", secondary: "220 10% 93%" },
  "baterias": { primary: "0 60% 25%", primaryForeground: "45 90% 97%", accent: "45 90% 50%", secondary: "0 15% 93%" },
  "restaurante": { primary: "0 50% 22%", primaryForeground: "0 15% 97%", accent: "20 70% 50%", secondary: "15 15% 94%" },
  "hamburgueria": { primary: "0 40% 18%", primaryForeground: "40 30% 97%", accent: "30 75% 50%", secondary: "0 10% 94%" },
  "marmitaria": { primary: "15 50% 20%", primaryForeground: "15 15% 97%", accent: "25 65% 50%", secondary: "15 12% 95%" },
  "academia": { primary: "0 0% 10%", primaryForeground: "0 0% 98%", accent: "0 75% 50%", secondary: "0 0% 94%" },
  "imobiliária": { primary: "215 30% 18%", primaryForeground: "215 20% 97%", accent: "38 55% 50%", secondary: "215 15% 95%" },
  "contabilidade": { primary: "210 20% 18%", primaryForeground: "210 15% 97%", accent: "210 50% 50%", secondary: "210 10% 95%" },
};

const defaultColors: NicheColors = {
  primary: "30 10% 12%",
  primaryForeground: "40 30% 95%",
  accent: "38 60% 55%",
  secondary: "30 15% 94%",
};

export function getNicheColors(niche: string): NicheColors {
  const key = niche.toLowerCase().trim();
  if (nicheColorMap[key]) return nicheColorMap[key];
  for (const [k, v] of Object.entries(nicheColorMap)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return defaultColors;
}
