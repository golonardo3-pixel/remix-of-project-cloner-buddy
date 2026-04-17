/**
 * Sistema premium de prospecção — alta conversão.
 * - 8 aberturas curtas (máx 3 linhas) que parecem escritas pra aquela empresa
 * - Citam cidade + traço específico do nicho ("atendem em Campinas e trabalham com bateria rápida")
 * - Geram curiosidade forte sem explicar tudo
 * - Leve sensação de vantagem/perda, sem cara de venda
 * - Terminam sempre em pergunta simples
 * - Linguagem natural de WhatsApp (sem "analisei", "oportunidades", "proposta")
 */

export interface NicheTone {
  /** Como chamamos o tipo de negócio */
  noun: string;
  /** Traço observado/diferencial típico ("atendimento rápido", "bateria entregue na hora") */
  trait: string;
  /** O que o cliente final faz quando decide ("chamar no WhatsApp", "fechar horário") */
  outcome: string;
}

const NICHE_TONES: Record<string, NicheTone> = {
  "salão de beleza": {
    noun: "salão",
    trait: "atendem com hora marcada",
    outcome: "marcar horário direto pelo WhatsApp",
  },
  "barbearia": {
    noun: "barbearia",
    trait: "trabalham com agendamento online",
    outcome: "agendar o corte sem ligar",
  },
  "estética": {
    noun: "espaço",
    trait: "fazem avaliação personalizada",
    outcome: "marcar avaliação direto no WhatsApp",
  },
  "clínica de estética": {
    noun: "clínica",
    trait: "trabalham com tratamentos personalizados",
    outcome: "fechar a primeira sessão",
  },
  "manicure": {
    noun: "estúdio",
    trait: "atendem com horário marcado",
    outcome: "marcar a unha sem precisar ligar",
  },
  "baterias": {
    noun: "loja",
    trait: "trabalham com bateria entregue rápido",
    outcome: "chamar direto no WhatsApp em vez do concorrente",
  },
  "auto center": {
    noun: "auto center",
    trait: "fazem revisão completa",
    outcome: "agendar a revisão pelo WhatsApp",
  },
  "oficina mecânica": {
    noun: "oficina",
    trait: "atendem com diagnóstico rápido",
    outcome: "levar o carro sem precisar ligar antes",
  },
  "restaurante": {
    noun: "restaurante",
    trait: "trabalham com almoço executivo",
    outcome: "decidir vir almoçar aí",
  },
  "pizzaria": {
    noun: "pizzaria",
    trait: "fazem entrega rápida",
    outcome: "pedir direto no WhatsApp",
  },
  "lanchonete": {
    noun: "lanchonete",
    trait: "trabalham com pedido por WhatsApp",
    outcome: "fechar o pedido sem ligar",
  },
  "padaria": {
    noun: "padaria",
    trait: "atendem o bairro inteiro",
    outcome: "passar aí em vez de ir mais longe",
  },
  "petshop": {
    noun: "petshop",
    trait: "fazem banho e tosa com hora marcada",
    outcome: "agendar banho pelo WhatsApp",
  },
  "academia": {
    noun: "academia",
    trait: "trabalham com aula experimental",
    outcome: "marcar a primeira aula",
  },
  "advocacia": {
    noun: "escritório",
    trait: "atendem casos específicos",
    outcome: "marcar uma conversa inicial",
  },
  "imobiliária": {
    noun: "imobiliária",
    trait: "trabalham com imóveis na região",
    outcome: "chamar pra ver o imóvel",
  },
  "dentista": {
    noun: "consultório",
    trait: "fazem avaliação inicial",
    outcome: "marcar a primeira consulta",
  },
};

const DEFAULT_TONE: NicheTone = {
  noun: "negócio",
  trait: "atendem o pessoal da região",
  outcome: "fechar com vocês direto pelo WhatsApp",
};

export function getNicheTone(niche: string): NicheTone {
  const key = (niche || "").toLowerCase().trim();
  if (NICHE_TONES[key]) return NICHE_TONES[key];
  for (const [k, v] of Object.entries(NICHE_TONES)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return DEFAULT_TONE;
}

/**
 * 8 aberturas premium — máx 3 linhas, estilo conversa de WhatsApp.
 * Placeholders: {empresa}, {cidade}, {nicho_noun}, {nicho_trait}, {nicho_outcome}
 * Removida cidade quando inválida (sanitização já existente trata).
 */
export const PREMIUM_OPENINGS: string[] = [
  // 1 — modelo do exemplo do usuário
  `{Oi|Olá}, tudo bem?\nVi que vocês atendem aqui em {cidade} e {nicho_trait}.\nTem um detalhe simples que pode fazer o cliente {nicho_outcome}… {posso te mostrar|quer ver}?`,

  // 2 — vantagem/perda leve
  `{Oi|Olá}, {tudo bem|tudo certo}?\nReparei que a {empresa} {nicho_trait} aí em {cidade} — gostei.\nTem uma coisinha que {tá fazendo o cliente escolher concorrente|pode estar passando batido}, {posso te mandar|quer ver}?`,

  // 3 — vizinho curioso
  `{Oi|E aí}!\nVi a {empresa} pesquisando {nicho_noun} em {cidade} e curti que vocês {nicho_trait}.\nFaltou {um detalhe simples|uma coisa boba} pro cliente {nicho_outcome}… {te conto|posso te mostrar}?`,

  // 4 — boas avaliações
  `{Oi|Olá}, tudo bem?\nVi suas avaliações no Google — {bem boas|bem positivas} — e que vocês {nicho_trait}.\nTem um motivo de quem busca em {cidade} ainda não estar te chamando, {posso te dizer|quer saber qual}?`,

  // 5 — direto, curto
  `{Oi|Fala}!\nVi que a {empresa} {nicho_trait} em {cidade}.\n{Posso te chamar|Posso te mandar} uma coisa que {provavelmente|talvez} esteja te custando cliente?`,

  // 6 — gancho de "quase fechou"
  `{Oi|Olá}, {tudo bem|tudo certo}?\nReparei que vocês {nicho_trait} aí em {cidade}.\nTem cliente chegando perto e {desistindo|saindo} antes de te chamar — {sabe por quê|quer saber por quê}?`,

  // 7 — específico + curiosidade
  `{Oi|E aí}, tudo bem?\nVi a {empresa} no Google e que vocês {nicho_trait} em {cidade}.\nUm detalhe pequeno tá segurando o cliente de {nicho_outcome}… {te mostro|quer ver qual}?`,

  // 8 — vantagem do bairro
  `{Oi|Olá}!\nVi que vocês são {referência|conhecidos} em {cidade} e {nicho_trait}.\nFalta {uma coisa simples|um ajuste mínimo} pra quem busca te chamar primeiro — {posso te mostrar|quer ver}?`,
];

/**
 * 3 follow-ups leves, educados, para quem visualizou e não respondeu.
 * Máx 3 linhas, sem cobrança.
 */
export const PREMIUM_FOLLOWUPS: string[] = [
  `{Oi|Olá}, {sem pressa|tranquilo}!\nSó passei pra ver se {você viu|chegou a ver} aquilo da {empresa}.\n{Posso te mandar|Quer que eu te mande} o detalhe?`,

  `{Oi|Olá}!\nImagino que a rotina tá {corrida|puxada}.\nMe diz o melhor horário que {te chamo|volto a falar} sem incomodar — pode ser?`,

  `{Oi|Olá}, tudo bem?\nSem cobrança nenhuma — só queria saber se {faz sentido|prefere} eu te mandar aquilo da {empresa} agora ou {depois|outro dia}?`,
];

function applyTone(template: string, tone: NicheTone): string {
  return template
    .replace(/\{nicho_noun\}/g, tone.noun)
    .replace(/\{nicho_trait\}/g, tone.trait)
    .replace(/\{nicho_outcome\}/g, tone.outcome);
}

/**
 * Pega uma abertura aleatória, adaptada ao nicho.
 * `recentTemplates` evita repetir as últimas escolhas (dedupe entre leads próximos).
 */
export function pickOpening(niche: string, recentTemplates: string[] = []): string {
  const tone = getNicheTone(niche);
  const available = PREMIUM_OPENINGS.filter((t) => !recentTemplates.includes(t));
  const pool = available.length > 0 ? available : PREMIUM_OPENINGS;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return applyTone(chosen, tone);
}

export function pickFollowup(niche: string, index?: number): string {
  const tone = getNicheTone(niche);
  const t =
    typeof index === "number"
      ? PREMIUM_FOLLOWUPS[index % PREMIUM_FOLLOWUPS.length]
      : PREMIUM_FOLLOWUPS[Math.floor(Math.random() * PREMIUM_FOLLOWUPS.length)];
  return applyTone(t, tone);
}
