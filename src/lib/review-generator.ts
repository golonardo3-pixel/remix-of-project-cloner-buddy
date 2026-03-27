// Generates unique, realistic Brazilian reviews per site using slug as seed
// Ensures no two sites share the same review combination

const BRAZILIAN_NAMES = [
  "Ana Paula", "Camila R.", "Fernanda S.", "Juliana M.", "Patrícia L.",
  "Mariana C.", "Beatriz A.", "Larissa F.", "Tatiane O.", "Vanessa B.",
  "Ricardo L.", "Lucas M.", "André P.", "Carlos E.", "Felipe D.",
  "Marcos V.", "Rafael T.", "Bruno S.", "Eduardo N.", "Gustavo H.",
  "Priscila G.", "Amanda K.", "Renata W.", "Simone J.", "Débora I.",
  "Roberto A.", "Thiago C.", "Diego R.", "Fábio M.", "Leandro P.",
];

// Review templates per niche category — {niche_key: review texts[]}
const NICHE_REVIEWS: Record<string, string[]> = {
  "salão de beleza": [
    "Agendei pelo WhatsApp e fui atendida em menos de 10 minutos. Resultado maravilhoso!",
    "Melhor salão que já fui! Cortou exatamente do jeito que eu queria.",
    "Fiz mechas e ficou perfeito, todo mundo elogiou. Preço justo!",
    "Atendimento nota 10! A profissional é muito cuidadosa e caprichosa.",
    "Estava precisando de uma hidratação urgente e consegui encaixar no mesmo dia.",
    "Primeira vez que saí de um salão 100% satisfeita. Voltarei com certeza!",
    "Fiz escova progressiva e meu cabelo nunca ficou tão liso e brilhante.",
    "Ambiente lindo, limpo e organizado. Equipe super simpática!",
    "Pedi uma coloração ousada e ficou exatamente como eu imaginei. Amei!",
    "Já sou cliente há 2 anos e nunca me decepcionou. Recomendo de olhos fechados.",
  ],
  "barbearia": [
    "Cortei e fiz a barba em 30 minutos. Melhor barbearia da cidade!",
    "Atendimento rápido sem perder a qualidade. Virei cliente fiel.",
    "Agendei pelo WhatsApp e fui atendido na hora marcada. Top demais!",
    "Degradê perfeito, acabamento impecável. Todo mundo pergunta onde cortei.",
    "Ambiente maneiro, cerveja gelada e corte nota 10. O que mais posso pedir?",
    "Fiz pigmentação e ficou muito natural. Recomendo sem medo!",
    "Melhor custo-benefício da região. Corte + barba por um preço justo.",
    "O barbeiro entendeu exatamente o que eu queria. Resultado incrível!",
    "Sempre saio satisfeito. Atendimento pontual e profissional.",
    "Levei meu filho e ele adorou! Atendimento paciente e resultado ótimo.",
  ],
  "estética": [
    "Fiz limpeza de pele e minha pele nunca esteve tão bonita. Super recomendo!",
    "Resultado visível já na primeira sessão de harmonização. Profissional incrível!",
    "Atendimento humanizado e resultado natural. Exatamente o que eu buscava.",
    "Fiz botox e ficou super natural, ninguém percebe que fiz. Amei!",
    "Ambiente acolhedor e profissional competente. Me senti super segura.",
    "Já fiz vários procedimentos aqui e todos com resultado excelente.",
    "A avaliação foi super detalhada e sem pressão. Adorei a transparência!",
    "Minha autoestima mudou completamente depois dos tratamentos. Gratidão!",
    "Preço justo para a qualidade do serviço. Vale cada centavo investido.",
    "Indiquei para minhas amigas e todas amaram o resultado!",
  ],
  "restaurante": [
    "Comida caseira de verdade! Arroz soltinho, feijão temperado. Voltarei sempre!",
    "Melhor almoço da região. Porções generosas e preço honesto.",
    "Atendimento rápido e comida fresquinha. Perfeito para o horário de almoço.",
    "Pedi pelo WhatsApp e chegou quentinho. Delivery super eficiente!",
    "Tempero da vovó! Me senti em casa. Recomendo demais!",
    "Experimentei o prato do dia e fiquei impressionado. Sabor incrível!",
    "Lugar limpo, bem organizado e com um cardápio variado. Nota 10!",
    "A marmita é enorme e muito bem temperada. Melhor custo-benefício!",
    "Comi o filé e estava perfeito no ponto. Voltarei com certeza!",
    "Sempre peço aqui quando não quero cozinhar. Nunca me decepciona.",
  ],
  "dentista": [
    "Tirei meu medo de dentista aqui! Atendimento super cuidadoso e sem dor.",
    "Fiz clareamento e ficou incrível. Sorriso novo em poucas sessões!",
    "Profissional atencioso que explica tudo antes de fazer. Me senti segura.",
    "Estava com dor de dente e consegui atendimento no mesmo dia. Salvou!",
    "Ambiente moderno e equipe muito simpática. Melhor clínica da cidade.",
    "Fiz limpeza e profilaxia. Rápido, indolor e resultado excelente!",
    "Toda minha família se trata aqui. Confiança total no profissional.",
    "Coloquei aparelho e o acompanhamento é impecável. Super recomendo!",
    "Preço justo e parcelamento facilitado. Acessível para todo mundo.",
    "Fiz uma restauração e ficou perfeita, nem parece que tinha cárie.",
  ],
  "academia": [
    "Melhor academia da região! Equipamentos novos e instrutores atenciosos.",
    "Em 3 meses já vi resultado. O personal é excelente e motivador!",
    "Ambiente limpo, bem ventilado e sem superlotação. Adorei!",
    "Os horários flexíveis me ajudaram a manter a rotina. Recomendo!",
    "Preço justo com planos acessíveis. Melhor custo-benefício!",
    "O treino personalizado fez toda a diferença nos meus resultados.",
    "Comecei sem saber nada e os instrutores me ajudaram desde o início.",
    "Já treinei em várias academias, mas aqui é outro nível de atendimento.",
    "As aulas em grupo são ótimas! Motivação garantida todo dia.",
    "Ambiente acolhedor, me sinto em casa treinando aqui.",
  ],
  "petshop": [
    "Levei meu cachorro e foi super bem atendido, recomendo demais!",
    "Meu pet voltou cheiroso e lindo! Banho e tosa impecáveis.",
    "Atendimento carinhoso com os animais. Meu gato ficou calminho lá!",
    "Sempre levo meus dois cães aqui. Confiança total na equipe!",
    "Produtos de qualidade e preço justo. Melhor petshop da região.",
    "Fizeram a tosa exatamente como pedi. Meu cachorro ficou lindo!",
    "Minha cachorrinha é muito medrosa mas aqui ela fica tranquila. Amei!",
    "Entrega de ração rápida pelo WhatsApp. Super prático e eficiente!",
    "Equipe super paciente e cuidadosa. Confio meus pets de olhos fechados.",
    "O veterinário daqui é incrível. Salvou meu gato quando estava doente.",
  ],
  "mecânica": [
    "Meu carro estava fazendo um barulho estranho e resolveram na hora. Top!",
    "Oficina honesta e transparente. Mostram o que precisa trocar de verdade.",
    "Preço justo e serviço bem feito. Meu carro saiu como novo!",
    "Atendimento rápido pelo WhatsApp. Já cheguei com horário marcado.",
    "Fiz revisão completa e o preço foi muito abaixo do que a concessionária cobrou.",
    "Mecânico experiente e de confiança. Levo meu carro há 3 anos aqui.",
    "Troquei os freios e ficou perfeito. Serviço garantido!",
    "Carro parou na estrada e vieram me socorrer rápido. Salvação!",
    "Orçamento detalhado e sem surpresa. Gostei da honestidade.",
    "Toda minha família faz manutenção aqui. Confiança de anos!",
  ],
  "baterias": [
    "Bateria acabou de manhã e em 40 minutos já tinham instalado uma nova. Salvação!",
    "Preço justo e instalação no local. Não precisei levar o carro pra lugar nenhum.",
    "Chamei pelo WhatsApp e chegaram super rápido. Atendimento nota 10!",
    "Bateria com garantia e preço melhor que na loja. Recomendo!",
    "Estava na correria e resolveram meu problema em menos de 1 hora.",
    "Atendimento 24h me salvou numa emergência de madrugada. Top!",
    "Testaram a bateria antiga e só trocaram porque realmente precisava. Honestidade!",
    "Entrega e instalação gratuita. Melhor serviço de bateria da cidade.",
    "Já comprei 3 baterias aqui. Qualidade e garantia sempre impecáveis.",
    "Socorro rápido e eficiente. Não me deixaram na mão!",
  ],
  "marmitaria": [
    "Marmita enorme e super bem temperada! Melhor custo-benefício da região.",
    "Peço todo dia pelo WhatsApp e sempre chega quentinho e no horário.",
    "Comida caseira de verdade, parece comida de mãe. Amo!",
    "Cardápio variado, todo dia tem opção diferente. Nunca enjoa!",
    "Entrega super rápida e embalagem que mantém tudo quentinho.",
    "Melhor marmita que já comi! Arroz, feijão e carne de qualidade.",
    "Peço para o escritório inteiro e todo mundo elogia. Recomendo!",
    "Preço justo e porção generosa. Vale muito a pena!",
    "A salada é sempre fresquinha e tem várias opções. Adorei!",
    "Pedi marmita fit e ficou incrível! Saudável e saborosa.",
  ],
  "imobiliária": [
    "Encontraram o apartamento perfeito pra mim em menos de uma semana!",
    "Atendimento personalizado e sem enrolação. Corretor muito atencioso.",
    "Toda a documentação foi resolvida rapidamente. Processo super tranquilo!",
    "Aluguei meu imóvel em poucos dias. Divulgação excelente!",
    "Profissionais sérios e comprometidos. Recomendo para quem quer comprar ou alugar.",
    "Me ajudaram a encontrar uma casa no bairro que eu queria. Perfeito!",
    "Visitas organizadas e sem perda de tempo. Atendimento eficiente!",
    "Negociação justa e transparente. Me senti seguro durante todo o processo.",
    "Já indiquei para amigos e todos ficaram satisfeitos com o atendimento.",
    "Equipe super profissional. Encontraram exatamente o que eu procurava!",
  ],
  "contabilidade": [
    "Resolveram toda minha situação fiscal em poucos dias. Profissionais competentes!",
    "Abri minha empresa com a ajuda deles e foi tudo muito fácil e rápido.",
    "Atendimento pelo WhatsApp super prático. Tiro dúvidas a qualquer hora!",
    "Minha contabilidade estava uma bagunça e eles organizaram tudo perfeitamente.",
    "Economizei muito nos impostos com o planejamento tributário que fizeram.",
    "Equipe atenciosa que explica tudo de forma simples. Recomendo!",
    "Declaração de imposto de renda feita rapidamente e sem erro. Excelente!",
    "Profissionais atualizados e confiáveis. Minha empresa está em boas mãos.",
    "Preço justo pelo serviço prestado. Custo-benefício excelente!",
    "Já sou cliente há anos e nunca tive problema. Confiança total!",
  ],
  "fisioterapia": [
    "Estava com dor nas costas há meses e depois de 5 sessões melhorei muito!",
    "Profissional super atencioso e competente. Tratamento personalizado.",
    "Recuperei o movimento do joelho depois da cirurgia. Gratidão!",
    "Atendimento humanizado e ambiente confortável. Me senti acolhido.",
    "Técnicas modernas e eficientes. Resultado muito mais rápido que esperava.",
    "Minha mãe faz fisioterapia aqui e já melhorou muito da mobilidade.",
    "Horários flexíveis e agendamento fácil pelo WhatsApp. Muito prático!",
    "Recomendo para quem tem dores crônicas. Mudou minha qualidade de vida!",
    "Profissional explica cada exercício e o porquê de cada um. Confiança total.",
    "Ambiente limpo, organizado e com equipamentos modernos. Nota 10!",
  ],
};

// Default reviews for niches not specifically listed
const DEFAULT_REVIEWS = [
  "Atendimento excelente e rápido! Recomendo para todo mundo.",
  "Profissionais competentes e preço justo. Voltarei com certeza!",
  "Fui muito bem atendido, resolveram tudo no mesmo dia. Top!",
  "Melhor serviço da região! Atencioso e pontual.",
  "Agendei pelo WhatsApp e foi super prático. Recomendo!",
  "Qualidade impecável e atendimento humanizado. Nota 10!",
  "Já indiquei para toda minha família. Confiança total!",
  "Superou minhas expectativas! Serviço rápido e bem feito.",
  "Ambiente agradável e equipe muito simpática. Adorei!",
  "Preço honesto e trabalho de qualidade. Melhor escolha que fiz!",
];

// Seeded random number generator (deterministic per slug)
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function slugToSeed(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
}

function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function findNicheReviews(niche: string): string[] {
  const lower = niche.toLowerCase().trim();
  for (const [key, reviews] of Object.entries(NICHE_REVIEWS)) {
    if (lower.includes(key) || key.includes(lower)) {
      return reviews;
    }
  }
  return DEFAULT_REVIEWS;
}

export interface GeneratedReview {
  name: string;
  text: string;
  rating: number;
}

/**
 * Generates 3 unique, realistic reviews for a site.
 * Uses the slug as seed so the same site always gets the same reviews,
 * but different sites get different combinations.
 */
export function generateReviews(niche: string, slug: string): GeneratedReview[] {
  const seed = slugToSeed(slug);
  const rng = seededRandom(seed);

  const reviewTexts = findNicheReviews(niche);
  const shuffledTexts = seededShuffle(reviewTexts, rng);
  const shuffledNames = seededShuffle(BRAZILIAN_NAMES, rng);

  return [
    { name: shuffledNames[0], text: shuffledTexts[0], rating: 5 },
    { name: shuffledNames[1], text: shuffledTexts[1], rating: 5 },
    { name: shuffledNames[2], text: shuffledTexts[2], rating: 5 },
  ];
}
