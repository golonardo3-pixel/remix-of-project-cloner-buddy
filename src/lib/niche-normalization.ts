const normalizeText = (value: string | null | undefined) =>
  (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const NICHE_KEYWORDS: Array<[string, string[]]> = [
  ["pet shop", ["pet shop", "pet store", "pet supply", "pet groomer", "pet grooming", "pet boarding", "dog day care", "animal hospital", "animal feed", "veterinarian", "veterinary", "reptile store", "banho e tosa", "clinica veterinaria"]],
  ["salão de beleza", ["salao de beleza", "beauty salon", "hair salon", "cabeleireiro", "hairdresser"]],
  ["barbearia", ["barbearia", "barber shop", "barber"]],
  ["estética", ["estetica", "esthetic", "aesthetic", "spa", "skincare", "depilacao", "depilation", "limpeza de pele"]],
  ["clínica odontológica", ["clinica odontologica", "odontologia", "odontologica", "dental", "dentist", "orthodont", "ortodont"]],
  ["fisioterapia", ["fisioterapia", "physiotherapy", "physical therapy", "physical therapist", "fisioterapeuta", "rehabilitation"]],
  ["oficina mecânica", ["oficina mecanica", "mechanic", "auto repair", "car repair", "mechanical workshop", "mecanica", "mecanico"]],
  ["baterias", ["baterias", "battery", "bateria automotiva"]],
  ["restaurante", ["restaurante", "restaurant", "bakery", "padaria", "bistro"]],
  ["hamburgueria", ["hamburgueria", "hamburger", "burger", "smash burger", "lanchonete"]],
  ["marmitaria", ["marmitaria", "meal delivery", "quentinha", "marmita", "comida caseira"]],
  ["academia", ["academia", "gym", "fitness", "crossfit", "musculacao"]],
  ["imobiliária", ["imobiliaria", "real estate", "real estate agency", "realtor", "property"]],
  ["contabilidade", ["contabilidade", "accounting", "accountant", "bookkeeping", "tax"]],
  ["manicure", ["manicure", "nail salon", "nail designer"]],
  ["advogado", ["advogado", "lawyer", "attorney", "legal"]],
  ["chaveiro", ["chaveiro", "locksmith"]],
  ["marido de aluguel", ["marido de aluguel", "handyman"]],
  ["nutricionista", ["nutricionista", "nutritionist", "nutrition"]],
  ["pintor", ["pintor", "painting", "painter"]],
  ["eletricista", ["eletricista", "electrician", "electrical"]],
  ["encanador", ["encanador", "plumber", "plumbing"]],
  ["auto elétrica", ["auto eletrica", "auto electrical"]],
  ["massagista", ["massagista", "massage", "massoterapeuta", "massage therapist"]],
  ["desentupidora", ["desentupidora", "drain cleaning", "sewer", "unclog"]],
  ["guincho", ["guincho", "tow", "towing", "reboque"]],
  ["funilaria", ["funilaria", "body shop", "collision repair", "lataria"]],
];

export function canonicalizeBusinessNiche(rawNiche: string | null | undefined): string {
  const normalized = normalizeText(rawNiche);
  if (!normalized) return "";

  for (const [canonical, keywords] of NICHE_KEYWORDS) {
    if (normalized === normalizeText(canonical)) return canonical;
    if (keywords.some((keyword) => normalized.includes(normalizeText(keyword)))) return canonical;
  }

  return rawNiche?.trim() || "";
}
