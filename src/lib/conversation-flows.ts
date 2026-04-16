/**
 * Multi-stage conversation flow templates with advanced spintax.
 * Each stage produces a different tone/length to simulate real human messaging.
 */

export interface ConversationStage {
  id: string;
  label: string;
  description: string;
  templates: string[];
}

export const CONVERSATION_STAGES: ConversationStage[] = [
  {
    id: "abertura",
    label: "1. Abertura",
    description: "Mensagem leve, natural e curta",
    templates: [
      `{Oi|Olá|Fala|E aí|Tudo bem|Bom dia|Boa tarde}, tudo {bem|certo|tranquilo}?\n\n{Vi|Dei uma olhada em|Analisei rapidamente|Passei pelo} {seu perfil|seu negócio|sua empresa} no Google {hoje|agora pouco|esses dias|recentemente} e {me chamou atenção|achei interessante|curti|notei algumas coisas}.`,
      `{Oi|Olá|E aí}, tudo {bem|certo}?\n\n{Encontrei|Vi} a {empresa} {hoje|agora pouco} no Google e {achei interessante|me chamou atenção}.`,
      `{Fala|Oi|Olá}, {tudo bem|tudo certo|como vai}?\n\n{Passei pelo perfil|Vi o perfil} da {empresa} {esses dias|recentemente} e {curti bastante|achei bem legal}.`,
    ],
  },
  {
    id: "contexto",
    label: "2. Contexto",
    description: "Explica o motivo do contato sem parecer venda",
    templates: [
      `{Trabalho|Atuo} com {presença digital|marketing local|visibilidade online} pra negócios {da região|aqui em {cidade}|como o seu} e {estava analisando alguns perfis|fiz uma análise rápida de negócios aqui}.`,
      `{Sou especialista em|Trabalho com} {ajudar negócios|empresas locais} a {aparecer mais no Google|atrair mais clientes pelo Google} e {vim dar uma olhada na região|estava pesquisando negócios em {cidade}}.`,
      `{Faço um trabalho|Tenho um projeto} de {ajudar negócios locais|melhorar a presença} no Google e {notei|vi} {o perfil de vocês|a {empresa}} enquanto {analisava a região|fazia umas pesquisas}.`,
    ],
  },
  {
    id: "gancho",
    label: "3. Gancho",
    description: "Gera curiosidade",
    templates: [
      `{Acho que dá pra melhorar algumas coisas|Percebi algumas oportunidades simples|Notei alguns pontos que podem melhorar} {no perfil de vocês|por aí}.\n\n{Posso te mostrar rapidinho?|Quer que eu te explique?|Te mostro em 1 minuto?}`,
      `{Encontrei|Vi} {uns pontos interessantes|umas coisas} que {podem fazer diferença|fariam diferença} {pra atrair mais cliente|na hora de alguém te encontrar}.\n\n{Quer ver?|Te explico rápido?|Posso te mostrar?}`,
      `{Tem umas coisas simples|Vi alguns ajustes fáceis} que {vocês podem fazer|dá pra resolver rápido} e que {fazem muita diferença|mudam bastante o resultado}.\n\n{Posso te mostrar?|Quer saber mais?|Te conto em 1 minuto?}`,
    ],
  },
  {
    id: "resposta",
    label: "4. Resposta",
    description: "Responde dúvidas simples",
    templates: [
      `{Boa pergunta|Que bom que perguntou}! {Basicamente|Resumindo}, {ajudo negócios como o seu a|o que faço é ajudar} {aparecer melhor no Google|ter mais visibilidade online} {sem precisar de nada complicado|de um jeito simples e prático}.`,
      `{Claro|Com certeza}! {No caso|Pra você ter uma ideia}, {é bem simples|funciona assim}: {faço uns ajustes no perfil|melhoro a presença online} {que atraem mais gente|que fazem mais clientes te encontrarem}. {Sem complicação|Nada técnico}.`,
      `{Entendo a dúvida|Normal ter essa dúvida}. {Na prática|Resumindo}: {são melhorias simples|ajustes práticos} que {fazem seu negócio aparecer mais|trazem mais clientes} {pelo Google|quando alguém busca na região}. {Bem tranquilo|Sem burocracia}.`,
    ],
  },
  {
    id: "qualificacao",
    label: "5. Qualificação",
    description: "Entende se o lead tem interesse",
    templates: [
      `{Só pra entender melhor|Me conta uma coisa}: {como tá o movimento|como andam as coisas} {por aí|no negócio}? {A maioria dos clientes vem|Os clientes chegam} {por indicação|pelo Google|pelo Instagram} ou {de outro jeito|como}?`,
      `{Pergunta rápida|Uma curiosidade}: {vocês já tentaram|já fizeram algo pra} {melhorar a presença no Google|atrair mais clientes online}? {Quero entender|Pra eu saber} {como te ajudar melhor|se faz sentido o que pensei}.`,
      `{Me fala uma coisa|Só uma pergunta}: {hoje em dia|atualmente}, {de onde vem|como chegam} {a maioria dos clientes novos|os clientes de vocês}? {Indicação|Google|Redes sociais}?`,
    ],
  },
  {
    id: "fechamento",
    label: "6. Fechamento leve",
    description: "Convida para ver melhoria sem pressão",
    templates: [
      `{Olha|Vou te falar}, {preparei|fiz} {uma sugestão|uma análise rápida} {personalizada|especial} {pro seu negócio|pra {empresa}}.\n\n{Sem compromisso nenhum|Só pra você ver} — {se curtir a gente conversa|se fizer sentido a gente segue}. {Posso te mandar?|Quer dar uma olhada?}`,
      `{Então|Bom}, {com base no que vi|pelo que analisei}, {montei uma ideia|tenho uma sugestão} que {pode trazer resultado rápido|faz diferença rápido} {pro seu negócio|pra {empresa}}.\n\n{Quer ver sem compromisso?|Te mostro rapidinho?|Posso compartilhar?}`,
      `{Que tal|E se} {eu te mostrar|a gente ver junto} {o que dá pra melhorar|as oportunidades que encontrei}? {É rápido|Leva 2 minutos}, {sem compromisso|zero pressão}.\n\n{Quando seria bom pra você?|Posso te mostrar agora?}`,
    ],
  },
];

/**
 * Returns a random template from a stage, resolved with spintax.
 */
export function getRandomTemplate(stageId: string): string {
  const stage = CONVERSATION_STAGES.find((s) => s.id === stageId);
  if (!stage) return "";
  return stage.templates[Math.floor(Math.random() * stage.templates.length)];
}

/**
 * Build a full-flow message combining selected stages.
 */
export function buildFullFlowMessage(stageIds: string[]): string {
  return stageIds
    .map((id) => getRandomTemplate(id))
    .filter(Boolean)
    .join("\n\n");
}
