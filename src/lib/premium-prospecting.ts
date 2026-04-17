/**
 * Sistema premium de prospecção:
 * - 6+ variações de abertura curtas, humanas, terminadas em pergunta
 * - Adaptação por nicho (salão, barbearia, estética, baterias, oficina, restaurante, etc.)
 * - 3 follow-ups leves para quem visualizou e não respondeu
 * - Evita palavras "proposta", "serviço", "oportunidade"
 * - Tom consultivo, curiosidade > venda
 */

export interface NicheTone {
  /** Como chamamos o tipo de negócio em linguagem natural */
  noun: string;
  /** Verbo/ação típica do cliente final */
  customerAction: string;
  /** Detalhe observado que gera curiosidade */
  hook: string;
}

const NICHE_TONES: Record<string, NicheTone> = {
  "salão de beleza": {
    noun: "salão",
    customerAction: "marcar horário",
    hook: "como vocês aparecem pra quem busca salão na região",
  },
  "barbearia": {
    noun: "barbearia",
    customerAction: "agendar corte",
    hook: "como a barbearia aparece pro pessoal da região no Google",
  },
  "estética": {
    noun: "espaço",
    customerAction: "fechar tratamento",
    hook: "como o espaço aparece pra quem busca estética por aí",
  },
  "clínica de estética": {
    noun: "clínica",
    customerAction: "marcar avaliação",
    hook: "como a clínica está aparecendo pra quem busca tratamento",
  },
  "manicure": {
    noun: "estúdio",
    customerAction: "marcar horário",
    hook: "como vocês aparecem pra quem procura unha na região",
  },
  "baterias": {
    noun: "loja",
    customerAction: "trocar bateria",
    hook: "como vocês aparecem pra quem busca bateria automotiva agora",
  },
  "auto center": {
    noun: "auto center",
    customerAction: "marcar revisão",
    hook: "como o auto center está sendo encontrado na região",
  },
  "oficina mecânica": {
    noun: "oficina",
    customerAction: "levar o carro",
    hook: "como a oficina aparece pra quem precisa de mecânico ali perto",
  },
  "restaurante": {
    noun: "restaurante",
    customerAction: "decidir onde almoçar",
    hook: "como o restaurante aparece pra quem busca onde comer por perto",
  },
  "pizzaria": {
    noun: "pizzaria",
    customerAction: "pedir uma pizza",
    hook: "como a pizzaria aparece pra quem busca pizza na região",
  },
  "lanchonete": {
    noun: "lanchonete",
    customerAction: "pedir um lanche",
    hook: "como a lanchonete está aparecendo pro pessoal da redondeza",
  },
  "padaria": {
    noun: "padaria",
    customerAction: "passar pra comprar",
    hook: "como a padaria aparece pra quem mora aí perto",
  },
  "petshop": {
    noun: "petshop",
    customerAction: "agendar banho",
    hook: "como o petshop aparece pra quem tem pet na região",
  },
  "academia": {
    noun: "academia",
    customerAction: "fazer matrícula",
    hook: "como a academia aparece pra quem busca treino por aí",
  },
  "advocacia": {
    noun: "escritório",
    customerAction: "buscar orientação",
    hook: "como o escritório aparece pra quem precisa de advogado",
  },
  "imobiliária": {
    noun: "imobiliária",
    customerAction: "procurar imóvel",
    hook: "como a imobiliária aparece pra quem busca imóvel na região",
  },
  "dentista": {
    noun: "consultório",
    customerAction: "marcar consulta",
    hook: "como o consultório aparece pra quem busca dentista por aí",
  },
};

const DEFAULT_TONE: NicheTone = {
  noun: "negócio",
  customerAction: "fechar com vocês",
  hook: "como vocês aparecem pra quem busca {nicho} na região",
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
 * 8 variações premium de abertura — estilo "vizinho que reparou em algo".
 * Máx 3 linhas. Cita cidade + traço específico do nicho. Termina em pergunta.
 * Gera curiosidade + leve sensação de perda. Conversa natural de WhatsApp.
 * Placeholders: {empresa}, {cidade}, {nicho_noun}, {nicho_trait}, {nicho_outcome}
 */
export const PREMIUM_OPENINGS: string[] = [
  // 1
  `{Oi|Olá|E aí}, tudo {bem|certo}?\nDei uma olhada {rápida|por cima} no perfil da {empresa} {agora pouco|hoje} e notei {uma coisa|um detalhe} que {tá segurando|pode estar atrapalhando} cliente novo.\n{Posso te mostrar em 1 minuto|Quer que eu te mande aqui}?`,
  // 2
  `{Oi|Olá}, {tudo bem|tudo certo}?\nVi a {nicho_noun} no Google {hoje cedo|hoje} e {percebi|notei} {uma coisa simples|um ajuste rápido} que {muda bastante|faz diferença} no {nicho_hook}.\n{Te mostro|Posso te mostrar}?`,
  // 3
  `{Fala|E aí}, tudo bem?\n{Tô|Estou} {analisando|olhando} algumas {nicho_noun}s {da região|de {cidade}} e {a sua|a de vocês} {me chamou atenção|chamou minha atenção} por {um motivo específico|uma coisa pontual}.\n{Quer saber qual|Posso te contar}?`,
  // 4
  `{Oi|Olá}!\nPassei pelo perfil da {empresa} {agora|hoje} e fiquei com {uma|aquela} dúvida: {vocês sabem|você sabe} {nicho_hook}?\n{Se quiser|Se topar} te mostro em 30 segundos.`,
  // 5
  `{Bom dia|Boa tarde|Oi}!\n{Tava|Estava} olhando {a {nicho_noun}|o perfil} {agora pouco|hoje} e {acho que|imagino que} dá pra {ganhar mais cliente|aparecer mais} sem mexer em quase nada.\n{Te explico|Posso te explicar} rapidinho?`,
  // 6
  `{Oi|E aí}, tudo bem?\n{Vi|Achei} a {empresa} {pesquisando|procurando} {nicho_noun} aqui {da região|em {cidade}} e {reparei|percebi} {algo|uma coisa} que {vale a pena ajustar|merece atenção}.\n{Posso te mandar|Quer ver}?

`.trim(),
  // 7
  `{Oi|Olá}, {posso|dá pra eu} te {chamar|incomodar} por 1 minuto?\nNotei {um detalhe|uma coisinha} no perfil da {empresa} que {provavelmente|talvez} esteja deixando cliente {ir embora|escolher concorrente}.\n{Te mostro|Quer ver}?`,
  // 8
  `{Fala|Oi}!\n{Pesquisei|Dei uma busca em} {nicho_noun} {em {cidade}|aqui da região} {hoje|agora pouco} e a sua {ficou em uma|caiu numa} posição {curiosa|interessante}.\n{Quer entender o motivo|Posso te explicar o que vi}?`,
];

/**
 * 3 follow-ups leves, educados, para quem visualizou e não respondeu.
 */
export const PREMIUM_FOLLOWUPS: string[] = [
  `{Oi|Olá}, {sem pressa|tranquilo}!\n{Só passei|Só queria passar} aqui pra ver se {você viu|chegou a ver} a mensagem sobre a {empresa}.\n{Posso te mandar|Quer que eu te mande} {o que percebi|o detalhe}?`,
  `{Oi|Olá}!\n{Imagino que|Sei que} a rotina tá {corrida|puxada}.\n{Se preferir|Se for melhor pra você}, me diz o melhor horário que {te chamo|volto a falar} sem incomodar.`,
  `{Oi|Olá}, tudo bem?\n{Sem cobrança|Sem problema nenhum} se não {fizer sentido|for o momento}.\n{Só queria saber|Só queria entender} se {posso te mostrar|faz sentido eu te mandar} aquilo da {empresa} ou {deixo pra outro momento|prefere depois}?`,
];

function applyTone(template: string, tone: NicheTone, niche: string): string {
  return template
    .replace(/\{nicho_noun\}/g, tone.noun)
    .replace(/\{nicho_action\}/g, tone.customerAction)
    .replace(/\{nicho_hook\}/g, tone.hook.replace(/\{nicho\}/g, niche || "negócios"));
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
  return applyTone(chosen, tone, niche);
}

export function pickFollowup(niche: string, index?: number): string {
  const tone = getNicheTone(niche);
  const t =
    typeof index === "number"
      ? PREMIUM_FOLLOWUPS[index % PREMIUM_FOLLOWUPS.length]
      : PREMIUM_FOLLOWUPS[Math.floor(Math.random() * PREMIUM_FOLLOWUPS.length)];
  return applyTone(t, tone, niche);
}
