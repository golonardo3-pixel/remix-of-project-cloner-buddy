// Content templates per niche - EMERGENCY / HIGH URGENCY WhatsApp-focused copy
// All texts dynamically generated with city and company name
// Tone: pain → solution → urgency. Every line must drive WhatsApp action.
import heroSalon from "@/assets/hero-salon.jpg";
import heroBarbershop from "@/assets/hero-barbershop.jpg";
import heroDental from "@/assets/hero-dental.jpg";
import heroRestaurant from "@/assets/hero-restaurant.jpg";
import heroGym from "@/assets/hero-gym.jpg";
import heroDefault from "@/assets/hero-default.jpg";
import heroAesthetics from "@/assets/hero-aesthetics.jpg";
import heroPhysiotherapy from "@/assets/hero-physiotherapy.jpg";
import heroPetshop from "@/assets/hero-petshop.jpg";
import heroMechanic from "@/assets/hero-mechanic.jpg";
import heroBatteries from "@/assets/hero-batteries.jpg";
import heroMarmitaria from "@/assets/hero-marmitaria.jpg";
import heroRealestate from "@/assets/hero-realestate.jpg";
import heroAccounting from "@/assets/hero-accounting.jpg";
import heroManicure from "@/assets/hero-manicure.jpg";
import heroLawyer from "@/assets/hero-lawyer.jpg";

export interface NicheContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroVideo?: string;
  urgencyBadge: string;
  aboutLabel: string;
  aboutHeading: string;
  aboutText: string;
  benefits: string[];
  servicesLabel: string;
  servicesHeading: string;
  services: { title: string; desc: string }[];
  reviews: { name: string; text: string; rating: number }[];
  reviewCount: number;
  footerTagline: string;
  ctaText: string;
  whatsappMessage: string;
  nameSuffix?: string;
  galleryLabel: string;
  galleryHeading: string;
  // Sales pitch fields for conversion
  salesHeadline: string;
  salesSubheadline: string;
  salesStat: string;
  salesUrgency: string;
  salesBenefit: string;
}

interface NicheTemplate {
  heroTitle: (city: string) => string;
  heroSubtitle: (city: string, company: string) => string;
  heroImage: string;
  heroVideo?: string;
  urgencyBadge: (city: string) => string;
  aboutLabel: string;
  aboutHeading: string;
  aboutText: (city: string, company: string) => string;
  benefits: string[];
  servicesLabel: string;
  servicesHeading: string;
  services: { title: string; desc: string }[];
  reviews: { name: string; text: string; rating: number }[];
  reviewCount: number;
  footerTagline: (city: string) => string;
  ctaText: string;
  whatsappMessage: (company: string) => string;
  nameSuffix?: string;
  galleryLabel: string;
  galleryHeading: string;
  // Sales pitch (optional — defaults provided)
  salesHeadline?: string;
  salesSubheadline?: (city: string) => string;
  salesStat?: string;
  salesUrgency?: (city: string) => string;
  salesBenefit?: string;
}

const nicheTemplateMap: Record<string, NicheTemplate> = {
  "salão de beleza": {
    heroTitle: (city) => `Cabelo não saiu como você queria?`,
    heroSubtitle: (city, company) => `A ${company} resolve hoje em ${city} com corte, coloração e tratamento profissional.`,
    heroImage: heroSalon,
    heroVideo: "https://videos.pexels.com/video-files/3993557/3993557-hd_1920_1080_25fps.mp4",
    urgencyBadge: (city) => `⚡ Atendimento disponível agora em ${city}`,
    aboutLabel: "Por que estão nos escolhendo?",
    aboutHeading: "Resultado garantido\nou refazemos de graça",
    aboutText: (city, company) => `Você já saiu de um salão frustrada? Aqui isso não acontece. A ${company} atende com hora marcada, sem atraso, sem enrolação. Produtos de primeira linha, profissionais que entendem o que você quer. Mais de 100 clientes por mês confiam na gente em ${city}. Chame agora no WhatsApp.`,
    benefits: [
      "Atendimento imediato com hora marcada",
      "Profissionais experientes e atualizados",
      "Produtos importados de alta qualidade",
      "Resultado garantido ou refazemos",
    ],
    servicesLabel: "Resolva agora",
    servicesHeading: "Não espere mais",
    services: [
      { title: "Corte e Escova Urgente", desc: "Precisa ficar pronta hoje? Corte + escova sem espera. Chame no WhatsApp agora." },
      { title: "Coloração de Emergência", desc: "Raiz aparecendo? Resolvemos em uma sessão. Resultado imediato." },
      { title: "Tratamento Capilar", desc: "Cabelo quebradiço e sem vida? Hidratação profunda que recupera na hora." },
      { title: "Maquiagem e Penteado", desc: "Evento hoje? Produção completa com resultado profissional. Últimas vagas." },
    ],
    reviews: [],
    reviewCount: 127,
    footerTagline: (city) => `Não perca mais tempo. Chame a gente em ${city} agora!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, preciso de um horário urgente na ${company}. Tem vaga pra hoje?`,
    nameSuffix: "Hair Studio",
    galleryLabel: "Veja o que fazemos",
    galleryHeading: "Resultados reais de clientes",
  },
  "barbearia": {
    heroTitle: (city) => `Precisando cortar o cabelo\ncom urgência em ${city}?`,
    heroSubtitle: (city, company) => `Chega de esperar. A ${company} tem horário livre agora. Corte impecável em 30 minutos. Chame no WhatsApp e venha.`,
    heroImage: heroBarbershop,
    heroVideo: "https://videos.pexels.com/video-files/7697571/7697571-hd_1920_1080_25fps.mp4",
    urgencyBadge: (city) => `⚡ Atendimento disponível agora em ${city}`,
    aboutLabel: "Por que vir pra cá?",
    aboutHeading: "Sem espera, sem frescura\nresultado na hora",
    aboutText: (city, company) => `Você não tem tempo pra perder e a gente entende. A ${company} é corte rápido, barba alinhada e atendimento direto ao ponto. Mais de 80 cortes por semana. Se você precisa ficar pronto hoje, chame agora em ${city}.`,
    benefits: [
      "Corte pronto em 30 minutos",
      "Sem espera – hora marcada pelo WhatsApp",
      "Barbeiros experientes e atualizados",
      "Ambiente profissional e higiênico",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "Escolha e venha agora",
    services: [
      { title: "Corte Masculino", desc: "Degradê, americano ou social. Acabamento perfeito em 30 minutos. Venha agora." },
      { title: "Barba Completa", desc: "Barba alinhada, navalha e toalha quente. Saia pronto pra qualquer compromisso." },
      { title: "Corte + Barba Combo", desc: "O combo mais pedido. Desconto exclusivo pelo WhatsApp." },
      { title: "Pigmentação Capilar", desc: "Visual mais denso e jovem. Resultado imediato. Chame e agende." },
    ],
    reviews: [],
    reviewCount: 89,
    footerTagline: (city) => `Não fique esperando. Corte seu cabelo agora em ${city}!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, preciso cortar o cabelo hoje na ${company}. Tem horário?`,
    nameSuffix: "Barber Shop",
    galleryLabel: "Nossos cortes",
    galleryHeading: "Veja o resultado",
  },
  "estética": {
    heroTitle: (city) => `Insatisfeita com o que vê\nno espelho em ${city}?`,
    heroSubtitle: (city, company) => `Para de adiar. A ${company} tem avaliação gratuita hoje. Resultado visível na primeira sessão. Chame agora.`,
    heroImage: heroAesthetics,
    heroVideo: "https://videos.pexels.com/video-files/5765827/5765827-hd_1920_1080_25fps.mp4",
    urgencyBadge: (city) => `⚡ Avaliação gratuita disponível em ${city}`,
    aboutLabel: "Por que agora?",
    aboutHeading: "Cada dia que passa\né um dia a mais sem resultado",
    aboutText: (city, company) => `Você já pesquisou, já pensou, já adiou. Agora é hora de agir. A ${company} trabalha com profissionais certificados, equipamentos de última geração e protocolos que entregam resultado de verdade. Mais de 70 clientes por mês confiam na gente em ${city}. Chame no WhatsApp e faça sua avaliação gratuita.`,
    benefits: [
      "Resultado visível na primeira sessão",
      "Avaliação gratuita e sem compromisso",
      "Profissionais certificados e experientes",
      "Equipamentos de última geração",
    ],
    servicesLabel: "Procedimentos",
    servicesHeading: "Não espere mais",
    services: [
      { title: "Harmonização Facial", desc: "Preenchimento labial e mandibular. Resultado natural e imediato. Avaliação grátis hoje." },
      { title: "Botox", desc: "Rugas te incomodam? Suavização em 15 minutos, sem parar suas atividades." },
      { title: "Limpeza de Pele Profunda", desc: "Pele opaca e com cravos? Renove em uma sessão. Saia com a pele nova." },
      { title: "Microagulhamento", desc: "Manchas e cicatrizes? Tratamento que funciona de verdade. Protocolo personalizado." },
    ],
    reviews: [],
    reviewCount: 78,
    footerTagline: (city) => `Para de adiar. Cuide de você hoje em ${city}!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, quero agendar uma avaliação gratuita na ${company}. Tem vaga pra hoje?`,
    nameSuffix: "Estética Avançada",
    galleryLabel: "Resultados",
    galleryHeading: "Antes e depois reais",
  },
  "clínica odontológica": {
    heroTitle: (city) => `Dor de dente?\nAtendimento imediato em ${city}`,
    heroSubtitle: (city, company) => `Não aguente mais. A ${company} tem dentista disponível agora em ${city}. Tratamento sem dor e resultado no mesmo dia. Chame no WhatsApp.`,
    heroImage: heroDental,
    heroVideo: "https://videos.pexels.com/video-files/3209263/3209263-uhd_2560_1440_25fps.mp4",
    urgencyBadge: (city) => `⚡ Dentista disponível agora em ${city} – não espere piorar`,
    aboutLabel: "Por que não esperar?",
    aboutHeading: "Problema na boca\nsó piora com o tempo",
    aboutText: (city, company) => `Dor de dente, dente quebrado, gengiva inflamada – quanto mais você espera, pior fica e mais caro sai. A ${company} resolve no mesmo dia, com anestesia indolor e equipamentos modernos. Mais de 200 pacientes confiam na gente em ${city}. Chame agora.`,
    benefits: [
      "Atendimento de emergência no mesmo dia",
      "Tratamento sem dor com anestesia moderna",
      "Equipamentos de última geração",
      "Parcele em até 12x no cartão",
    ],
    servicesLabel: "Tratamentos",
    servicesHeading: "Resolva hoje, não amanhã",
    services: [
      { title: "Emergência Dental", desc: "Dor aguda, dente quebrado ou abscesso? Atendimento imediato. Chame agora." },
      { title: "Clareamento Express", desc: "Dentes amarelados te incomodam? Clareamento em uma sessão. Resultado na hora." },
      { title: "Implante Dentário", desc: "Perdeu um dente? Implante com planejamento digital. Parcele em até 12x." },
      { title: "Lentes de Contato Dental", desc: "Sorriso perfeito em poucas sessões. Transformação real. Avaliação grátis." },
    ],
    reviews: [],
    reviewCount: 203,
    footerTagline: (city) => `Não aguente dor. Resolva agora em ${city}!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, preciso de atendimento urgente na ${company}. Tem horário pra hoje?`,
    nameSuffix: "Odontologia",
    galleryLabel: "Nossa clínica",
    galleryHeading: "Estrutura moderna e segura",
  },
  "fisioterapia": {
    heroTitle: (city) => `Sentindo dor agora?\nAlívio imediato em ${city}`,
    heroSubtitle: (city, company) => `Dor nas costas, no joelho, no ombro? Não espere piorar. A ${company} tem vaga hoje em ${city}. Chame no WhatsApp e comece agora.`,
    heroImage: heroPhysiotherapy,
    heroVideo: "https://videos.pexels.com/video-files/5473298/5473298-hd_1920_1080_30fps.mp4",
    urgencyBadge: (city) => `⚡ Vaga disponível hoje em ${city} – dor não espera`,
    aboutLabel: "Por que agir agora?",
    aboutHeading: "Dor que você ignora\nhoje vira problema crônico amanhã",
    aboutText: (city, company) => `Cada dia que você sente dor e não trata, seu corpo compensa e cria novos problemas. A ${company} tem fisioterapeutas experientes que resolvem na primeira sessão. Sessões individuais, sem fila, com hora marcada em ${city}. Chame agora.`,
    benefits: [
      "Alívio da dor já na primeira sessão",
      "Sessões individuais e personalizadas",
      "Fisioterapeutas com anos de experiência",
      "Agendamento rápido pelo WhatsApp",
    ],
    servicesLabel: "Especialidades",
    servicesHeading: "Pare de sofrer – comece hoje",
    services: [
      { title: "Dor nas Costas e Coluna", desc: "Travou? Não consegue se mover? Alívio imediato com técnicas manuais." },
      { title: "Reabilitação Pós-Cirúrgica", desc: "Operou e precisa recuperar? Protocolo seguro e personalizado." },
      { title: "Pilates Clínico", desc: "Fortalecimento e correção postural. Turmas reduzidas, atenção total." },
      { title: "Dor no Joelho e Ombro", desc: "Dor ao subir escada ou levantar o braço? A gente resolve." },
    ],
    reviews: [],
    reviewCount: 64,
    footerTagline: (city) => `Dor não espera. Trate agora em ${city}!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, estou com dor e preciso de atendimento urgente na ${company}. Tem vaga pra hoje?`,
    nameSuffix: "Fisioterapia",
    galleryLabel: "Nossa clínica",
    galleryHeading: "Estrutura completa",
  },
  "pet shop": {
    heroTitle: (city) => `Seu pet precisa de atendimento agora?`,
    heroSubtitle: (city, company) => `Atendimento rápido em ${city} com equipe preparada. O ${company} cuida do seu pet com carinho e profissionalismo.`,
    heroImage: heroPetshop,
    heroVideo: "https://videos.pexels.com/video-files/4588455/4588455-hd_1920_1080_25fps.mp4",
    urgencyBadge: (city) => `⚡ Atendimento disponível agora em ${city}`,
    aboutLabel: "Por que confiar na gente?",
    aboutHeading: "Seu pet não pode esperar\ne você sabe disso",
    aboutText: (city, company) => `Quando seu pet está doente, cada minuto conta. O ${company} tem equipe preparada, veterinário disponível e atendimento rápido sem fila. Mais de 100 pets atendidos por mês em ${city}. Não espere piorar – chame agora no WhatsApp.`,
    benefits: [
      "Atendimento veterinário imediato",
      "Equipe carinhosa e preparada",
      "Produtos de qualidade e seguros",
      "Sem fila – agendamento pelo WhatsApp",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "Cuide do seu pet agora",
    services: [
      { title: "Emergência Veterinária", desc: "Seu pet está mal? Traga agora. Atendimento imediato sem espera." },
      { title: "Banho e Tosa", desc: "Seu pet precisa de banho? Agende pelo WhatsApp e traga hoje." },
      { title: "Vacinas e Exames", desc: "Vacina atrasada? Resolva hoje. Sem fila e sem espera." },
      { title: "Hotel Pet", desc: "Vai viajar e não tem com quem deixar? Vagas limitadas. Reserve agora." },
    ],
    reviews: [],
    reviewCount: 112,
    footerTagline: (city) => `Seu pet precisa de você agora. Chame a gente em ${city}!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, preciso de atendimento para meu pet agora no ${company}. Podem me ajudar?`,
    nameSuffix: "Pet Shop",
    galleryLabel: "Nosso espaço",
    galleryHeading: "Pets bem cuidados",
  },
  "oficina mecânica": {
    heroTitle: (city) => `Carro deu problema?\nA gente resolve hoje em ${city}`,
    heroSubtitle: (city, company) => `Motor falhando, freio rangendo, barulho estranho? Não espere quebrar de vez. A ${company} faz diagnóstico rápido e conserta hoje em ${city}.`,
    heroImage: heroMechanic,
    heroVideo: "https://videos.pexels.com/video-files/3173312/3173312-hd_1920_1080_30fps.mp4",
    urgencyBadge: (city) => `⚡ Diagnóstico gratuito hoje em ${city} – não espere quebrar`,
    aboutLabel: "Por que agir agora?",
    aboutHeading: "Barulho no carro\nsó piora (e fica mais caro)",
    aboutText: (city, company) => `Aquele barulhinho que você está ignorando? Ele vai virar um problema sério e caro. A ${company} faz diagnóstico preciso, orçamento transparente e resolve rápido. Mais de 70 veículos por mês em ${city}. Não fique na mão – chame agora.`,
    benefits: [
      "Diagnóstico gratuito na hora",
      "Orçamento transparente sem surpresas",
      "Peças de qualidade com garantia",
      "Serviço rápido – pega no mesmo dia",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "Não espere quebrar – traga hoje",
    services: [
      { title: "Diagnóstico Gratuito", desc: "Não sabe o que tem? Traga que a gente descobre em minutos. Sem custo." },
      { title: "Motor e Câmbio", desc: "Motor falhando ou câmbio pesado? Reparo rápido com peças originais." },
      { title: "Freios e Suspensão", desc: "Freio rangendo é sinal de perigo. Não arrisque sua vida. Troque hoje." },
      { title: "Revisão Preventiva", desc: "Vai viajar? Faça revisão completa antes. Preço fechado sem surpresa." },
    ],
    reviews: [],
    reviewCount: 76,
    footerTagline: (city) => `Carro com problema? Não espere. Traga agora em ${city}!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, meu carro está com problema e preciso de ajuda urgente na ${company}. Podem me atender hoje?`,
    nameSuffix: "Auto Center",
    galleryLabel: "Nossa oficina",
    galleryHeading: "Estrutura profissional",
  },
  "baterias": {
    heroTitle: (city) => `Carro não liga?`,
    heroSubtitle: (city, company) => `Entrega e instalação de bateria em ${city}, rápido e sem complicação. A ${company} vai até você.`,
    heroImage: heroBatteries,
    heroVideo: "https://videos.pexels.com/video-files/5377700/5377700-hd_1920_1080_25fps.mp4",
    urgencyBadge: (city) => `⚡ Atendimento disponível agora em ${city}`,
    aboutLabel: "Por que ligar pra gente?",
    aboutHeading: "Você está parado\ne cada minuto conta",
    aboutText: (city, company) => `Seu carro não liga, você está atrasado e precisa resolver agora. A ${company} entrega e instala a bateria no local – em casa, no trabalho ou na rua. Moura, Heliar, Zetta e ACDelco com garantia de fábrica. Em até 40 minutos na sua porta em ${city}. Chame agora.`,
    benefits: [
      "Entrega e instalação no local",
      "Atendimento 24 horas por dia",
      "Todas as marcas com garantia de fábrica",
      "Melhor preço da região",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "Resolva agora mesmo",
    services: [
      { title: "Baterias para carros com entrega e instalação no local", desc: "Todas as marcas e modelos. Instalação inclusa onde você estiver." },
      { title: "Baterias para motos com instalação rápida", desc: "Moto não liga? Resolvemos rápido com instalação inclusa." },
      { title: "Atendimento 24 horas, vamos até você", desc: "De madrugada, final de semana, feriado. Chame no WhatsApp e veja disponibilidade." },
      { title: "Teste de bateria grátis", desc: "Não sabe se precisa trocar? Testamos na hora sem custo." },
    ],
    reviews: [],
    reviewCount: 58,
    footerTagline: (city) => `Parado com carro sem bateria? Chame agora em ${city}!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, meu carro não liga e preciso de uma bateria urgente. Vocês entregam agora? Vi o site da ${company}.`,
    nameSuffix: "Baterias",
    galleryLabel: "Nossa loja",
    galleryHeading: "Estoque completo",
  },
  "restaurante": {
    heroTitle: (city) => `Com fome agora?\nPeça e receba rápido em ${city}`,
    heroSubtitle: (city, company) => `Sem tempo pra cozinhar? O ${company} entrega comida fresca e saborosa na sua porta em ${city}. Peça pelo WhatsApp agora.`,
    heroImage: heroRestaurant,
    heroVideo: "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
    urgencyBadge: (city) => `⚡ Entrega rápida disponível em ${city}`,
    aboutLabel: "Por que pedir aqui?",
    aboutHeading: "Comida de verdade,\nnão comida de delivery",
    aboutText: (city, company) => `Cansado de comida sem gosto e porção miserável? O ${company} faz comida fresca, com tempero de verdade e porção que alimenta. Peça agora pelo WhatsApp em ${city}.`,
    benefits: [
      "Comida fresca feita na hora",
      "Porções generosas de verdade",
      "Entrega rápida e pontual",
      "Tempero caseiro que faz diferença",
    ],
    servicesLabel: "Cardápio",
    servicesHeading: "Peça agora – não passe fome",
    services: [
      { title: "Pratos do Dia", desc: "Opções que mudam diariamente. Sempre fresco, sempre diferente. Peça agora." },
      { title: "Pratos Executivos", desc: "Almoço completo com preço fixo. Ideal pro dia a dia sem perder tempo." },
      { title: "Porções e Petiscos", desc: "Perfeitos pra dividir ou comer sozinho. Peça pelo WhatsApp." },
      { title: "Delivery Express", desc: "Chega quente na sua porta. Peça pelo WhatsApp." },
    ],
    reviews: [],
    reviewCount: 156,
    footerTagline: (city) => `Com fome? Peça agora e receba rápido em ${city}!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, quero fazer um pedido agora no ${company}. Qual o cardápio de hoje?`,
    galleryLabel: "Nossos pratos",
    galleryHeading: "Deu água na boca?",
  },
  "hamburgueria": {
    heroTitle: (city) => `Bateu aquela fome?\nO melhor hambúrguer de ${city}`,
    heroSubtitle: (city, company) => `Blend artesanal, pão fresquinho e entrega que chega quente. O ${company} entrega em ${city}. Peça agora pelo WhatsApp!`,
    heroImage: heroRestaurant,
    heroVideo: "https://videos.pexels.com/video-files/3298058/3298058-uhd_2560_1440_25fps.mp4",
    urgencyBadge: (city) => `⚡ Pedidos abertos agora em ${city}`,
    aboutLabel: "Por que somos os melhores?",
    aboutHeading: "Hambúrguer de verdade,\nnão massa congelada",
    aboutText: (city, company) => `Cansado de hambúrguer borrachudo e sem gosto? O ${company} usa blend fresco preparado diariamente, pão artesanal e ingredientes premium. Entrega que chega quente e crocante em ${city}. Peça pelo WhatsApp agora.`,
    benefits: [
      "Blend fresco preparado diariamente",
      "Pão artesanal feito na casa",
      "Entrega que chega quente de verdade",
      "Porções que satisfazem",
    ],
    servicesLabel: "Cardápio",
    servicesHeading: "Monte seu pedido agora",
    services: [
      { title: "Smash Burgers", desc: "Crosta crocante por fora, suculento por dentro. O mais pedido. Peça agora!" },
      { title: "Burgers Premium", desc: "Blend de costela e fraldinha com molhos artesanais. Experiência única." },
      { title: "Combos com Desconto", desc: "Hambúrguer + batata + bebida. Preço que cabe no bolso." },
      { title: "Delivery Express", desc: "Chega quente na sua porta. Peça pelo WhatsApp agora." },
    ],
    reviews: [],
    reviewCount: 134,
    footerTagline: (city) => `A fome não espera. Peça agora em ${city}!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, quero fazer um pedido agora no ${company}. Qual o cardápio?`,
    galleryLabel: "Nossos burgers",
    galleryHeading: "Deu fome?",
  },
  "marmitaria": {
    heroTitle: (city) => `Sem tempo pra cozinhar?\nMarmita na sua porta em ${city}`,
    heroSubtitle: (city, company) => `Comida caseira de verdade, com porção generosa e entrega rápida. O ${company} entrega em ${city}. Peça agora pelo WhatsApp.`,
    heroImage: heroMarmitaria,
    heroVideo: "https://videos.pexels.com/video-files/3298058/3298058-uhd_2560_1440_25fps.mp4",
    urgencyBadge: (city) => `⚡ Entregas disponíveis agora em ${city}`,
    aboutLabel: "Por que pedir aqui?",
    aboutHeading: "Comida caseira de verdade,\nnão comida industrial",
    aboutText: (city, company) => `Cansado de marmita sem gosto e porção pequena? O ${company} faz comida fresca todo dia, com tempero caseiro e porção que alimenta de verdade. Entrega pontual no horário do almoço em ${city}. Peça agora pelo WhatsApp.`,
    benefits: [
      "Comida feita no dia, nunca congelada",
      "Porções generosas de verdade",
      "Entrega pontual no horário do almoço",
      "Cardápio variado que não enjoa",
    ],
    servicesLabel: "Cardápio",
    servicesHeading: "Escolha e peça agora",
    services: [
      { title: "Marmita Tradicional", desc: "Arroz, feijão, salada e proteína. Porção generosa. A partir de R$ 15." },
      { title: "Marmita Fitness", desc: "Low carb, grelhados e salada. Sabor sem culpa. Peça agora." },
      { title: "Marmita Executiva", desc: "Duas proteínas, porção reforçada. Ideal pra quem tem fome de verdade." },
      { title: "Entrega no Trabalho", desc: "Chega quente e no horário. Peça pelo WhatsApp e não passe fome." },
    ],
    reviews: [],
    reviewCount: 87,
    footerTagline: (city) => `Com fome? Peça agora sua marmita em ${city}!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, quero pedir marmita agora no ${company}. Qual o cardápio de hoje?`,
    galleryLabel: "Nossos pratos",
    galleryHeading: "Feito na hora, todo dia",
  },
  "academia": {
    heroTitle: (city) => `Cansado de se sentir\nfora de forma em ${city}?`,
    heroSubtitle: (city, company) => `Chega de desculpas. A ${company} tem aula experimental grátis hoje em ${city}. Comece agora e veja resultado de verdade.`,
    heroImage: heroGym,
    heroVideo: "https://videos.pexels.com/video-files/4761434/4761434-uhd_2560_1440_25fps.mp4",
    urgencyBadge: (city) => `⚡ Aula experimental gratuita disponível em ${city}`,
    aboutLabel: "Por que começar hoje?",
    aboutHeading: "Cada dia que você adia\né um dia perdido",
    aboutText: (city, company) => `Você sabe que precisa treinar. Sabe que vai se sentir melhor. Então por que está esperando? A ${company} tem equipamentos modernos, professores que te acompanham e resultado comprovado. Primeira aula grátis em ${city}. Chame agora.`,
    benefits: [
      "Primeira aula experimental grátis",
      "Professores que acompanham você de perto",
      "Equipamentos modernos e bem mantidos",
      "Horários flexíveis que cabem na sua rotina",
    ],
    servicesLabel: "Modalidades",
    servicesHeading: "Comece hoje – pare de adiar",
    services: [
      { title: "Musculação", desc: "Equipamentos de ponta e acompanhamento personalizado. Resultado real." },
      { title: "Funcional", desc: "Queime gordura e tonifique em aulas dinâmicas. Turmas reduzidas." },
      { title: "Spinning", desc: "Aulas que queimam até 800 calorias. Energia e resultado." },
      { title: "Aula Grátis", desc: "Sem desculpas. Venha experimentar sem compromisso. Chame no WhatsApp." },
    ],
    reviews: [],
    reviewCount: 94,
    footerTagline: (city) => `Pare de adiar. Comece a treinar hoje em ${city}!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, quero agendar uma aula experimental grátis na ${company}. Tem vaga pra hoje?`,
    galleryLabel: "Nossa estrutura",
    galleryHeading: "Equipamentos modernos",
  },
  "imobiliária": {
    heroTitle: (city) => `Cansado de procurar\nimóvel em ${city}?`,
    heroSubtitle: (city, company) => `Para de perder tempo em portal. A ${company} tem opções exclusivas que você não encontra em outro lugar. Chame no WhatsApp e receba ofertas agora.`,
    heroImage: heroRealestate,
    heroVideo: "https://videos.pexels.com/video-files/7578554/7578554-hd_1920_1080_30fps.mp4",
    urgencyBadge: (city) => `⚡ Imóveis exclusivos disponíveis em ${city}`,
    aboutLabel: "Por que falar com a gente?",
    aboutHeading: "Enquanto você pesquisa,\nalguém está fechando negócio",
    aboutText: (city, company) => `Aquele imóvel que você gostou? Outro alguém também gostou. A ${company} conhece cada bairro de ${city} e tem opções que não estão nos portais. Atendimento rápido pelo WhatsApp com fotos e informações completas. Mais de 140 negócios fechados em ${city}.`,
    benefits: [
      "Imóveis exclusivos fora dos portais",
      "Atendimento rápido com fotos pelo WhatsApp",
      "Conhecimento profundo de cada bairro",
      "Processo sem burocracia desnecessária",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "Não perca a oportunidade",
    services: [
      { title: "Compra e Venda", desc: "Imóveis exclusivos com assessoria completa. Sem burocracia." },
      { title: "Locação Rápida", desc: "Alugue com contrato seguro e suporte do início ao fim." },
      { title: "Avaliação Gratuita", desc: "Quer vender? Avaliamos seu imóvel gratuitamente hoje." },
      { title: "Financiamento", desc: "Simulamos o financiamento ideal pra você. Sem compromisso." },
    ],
    reviews: [],
    reviewCount: 145,
    footerTagline: (city) => `Para de procurar sozinho. Fale com a gente em ${city}!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, estou procurando imóvel em ${company} e quero ver opções exclusivas. Pode me ajudar?`,
    nameSuffix: "Imóveis",
    galleryLabel: "Imóveis disponíveis",
    galleryHeading: "Veja antes que acabe",
  },
  "contabilidade": {
    heroTitle: (city) => `Problemas com impostos?\nResolva hoje em ${city}`,
    heroSubtitle: (city, company) => `CNPJ, imposto, nota fiscal – se está complicado, a ${company} simplifica. Atendimento direto pelo WhatsApp em ${city}. Chame agora.`,
    heroImage: heroAccounting,
    heroVideo: "https://videos.pexels.com/video-files/7947465/7947465-hd_1920_1080_25fps.mp4",
    urgencyBadge: (city) => `⚡ Prazo de imposto chegando – não pague multa em ${city}`,
    aboutLabel: "Por que resolver agora?",
    aboutHeading: "Cada dia de atraso\né multa no seu bolso",
    aboutText: (city, company) => `Imposto atrasado gera multa. CNPJ irregular trava seu negócio. A ${company} resolve tudo rápido: abertura de empresa, declarações, folha de pagamento e planejamento que economiza dinheiro de verdade. Mais de 90 empresas confiam na gente em ${city}. Chame agora.`,
    benefits: [
      "Abertura de empresa em poucos dias",
      "Economia real com planejamento tributário",
      "Atendimento direto pelo WhatsApp",
      "Sem burocracia desnecessária",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "Resolva antes que piore",
    services: [
      { title: "Abertura de Empresa", desc: "MEI, ME ou LTDA. CNPJ pronto em poucos dias. Sem complicação." },
      { title: "Regularização Fiscal", desc: "Imposto atrasado? Pendências? A gente resolve antes da multa." },
      { title: "Folha de Pagamento", desc: "Admissão, folha, férias e rescisão. Tudo certo, sem dor de cabeça." },
      { title: "Planejamento Tributário", desc: "Pague menos impostos legalmente. Economia real no seu bolso." },
    ],
    reviews: [],
    reviewCount: 92,
    footerTagline: (city) => `Não espere a multa chegar. Resolva agora em ${city}!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, preciso de ajuda urgente com contabilidade na ${company}. Podem me atender hoje?`,
    nameSuffix: "Contabilidade",
    galleryLabel: "Nosso escritório",
    galleryHeading: "Ambiente profissional",
  },
  "manicure": {
    heroTitle: (city) => `Suas unhas merecem mais do que o básico`,
    heroSubtitle: (city, company) => `A ${company} faz unhas que duram e impressionam. Gel, alongamento e esmaltação profissional em ${city}. Agende pelo WhatsApp.`,
    heroImage: heroManicure,
    urgencyBadge: (city) => `⚡ Horários disponíveis hoje em ${city}`,
    aboutLabel: "Por que escolher a gente?",
    aboutHeading: "Unhas perfeitas\nsem sair de casa",
    aboutText: (city, company) => `Cansada de unha que descasca em dois dias? A ${company} usa materiais de primeira linha e técnicas atualizadas. Resultado que dura semanas. Mais de 80 clientes confiam na gente em ${city}. Chame no WhatsApp e agende.`,
    benefits: [
      "Materiais de alta qualidade e durabilidade",
      "Técnicas atualizadas e certificadas",
      "Ambiente higienizado e confortável",
      "Agendamento fácil pelo WhatsApp",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "Escolha o seu",
    services: [
      { title: "Unhas em Gel", desc: "Unhas resistentes e com brilho duradouro. Resultado natural e elegante." },
      { title: "Alongamento de Unhas", desc: "Alongamento com fibra ou molde. Formato perfeito e resistente." },
      { title: "Esmaltação Profissional", desc: "Esmaltação comum ou em gel com acabamento impecável." },
      { title: "Nail Art e Decoração", desc: "Desenhos, pedrarias e francesinha. Unhas que são sua marca." },
    ],
    reviews: [],
    reviewCount: 84,
    footerTagline: (city) => `Agende suas unhas agora em ${city}!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, quero agendar um horário na ${company}. Tem vaga disponível?`,
    nameSuffix: "Nail Designer",
    galleryLabel: "Nossos trabalhos",
    galleryHeading: "Resultados reais",
  },
  "advogado": {
    heroTitle: (city) => `Problema jurídico?\nResolva antes que piore`,
    heroSubtitle: (city, company) => `A ${company} oferece orientação jurídica rápida e objetiva em ${city}. Trabalhista, família ou cível. Chame no WhatsApp.`,
    heroImage: heroLawyer,
    urgencyBadge: (city) => `⚡ Consulta disponível agora em ${city}`,
    aboutLabel: "Por que agir agora?",
    aboutHeading: "Cada dia sem ação\npode custar seus direitos",
    aboutText: (city, company) => `Processo tem prazo. Quanto mais você espera, mais difícil fica. A ${company} atende com agilidade e linguagem clara em ${city}. Sem juridiquês, sem enrolação. Chame agora.`,
    benefits: [
      "Primeira orientação rápida e objetiva",
      "Atendimento direto pelo WhatsApp",
      "Linguagem clara, sem juridiquês",
      "Experiência comprovada na área",
    ],
    servicesLabel: "Áreas de atuação",
    servicesHeading: "Como podemos ajudar",
    services: [
      { title: "Direito Trabalhista", desc: "Demissão injusta, horas extras, assédio. Seus direitos protegidos." },
      { title: "Direito de Família", desc: "Divórcio, pensão, guarda. Resolução rápida e menos desgaste." },
      { title: "Direito Civil", desc: "Contratos, cobranças, indenizações. Defesa dos seus interesses." },
      { title: "Consultoria Preventiva", desc: "Evite problemas futuros. Orientação antes de assinar ou decidir." },
    ],
    reviews: [],
    reviewCount: 65,
    footerTagline: (city) => `Não perca seus prazos. Fale com um advogado em ${city} agora!`,
    ctaText: "Falar com atendimento agora no WhatsApp",
    whatsappMessage: (company) => `Olá, preciso de orientação jurídica na ${company}. Podem me atender?`,
    nameSuffix: "Advocacia",
    galleryLabel: "Nosso escritório",
    galleryHeading: "Estrutura profissional",
  },
  "chaveiro": {
    heroTitle: (city) => `Trancado pra fora?\nChaveiro rápido em ${city}`,
    heroSubtitle: (city, company) => `A ${company} resolve na hora: abertura de portas, cópia de chaves e chave codificada em ${city}. Atendimento rápido pelo WhatsApp.`,
    heroImage: heroDefault,
    urgencyBadge: (city) => `⚡ Chaveiro disponível agora em ${city}`,
    aboutLabel: "Por que nos chamar?",
    aboutHeading: "Atendimento rápido\nonde você estiver",
    aboutText: (city, company) => `Ficou trancado pra fora? Perdeu a chave? A ${company} chega rápido em qualquer ponto de ${city} com equipamento profissional. Abertura sem danificar, chave codificada e cópia na hora.`,
    benefits: [
      "Atendimento de emergência 24h",
      "Abertura sem danificar a fechadura",
      "Chave codificada na hora",
      "Atendimento rápido em toda a região",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "Como podemos ajudar",
    services: [
      { title: "Abertura de Portas", desc: "Ficou trancado? Abrimos sem danificar. Residencial, automotivo e comercial." },
      { title: "Cópia de Chaves", desc: "Cópia comum, tetra ou codificada. Feita na hora com precisão." },
      { title: "Chave Codificada", desc: "Chave de carro com chip. Programação profissional no local." },
      { title: "Troca de Fechaduras", desc: "Fechadura danificada ou insegura? Trocamos na hora com garantia." },
    ],
    reviews: [],
    reviewCount: 0,
    footerTagline: (city) => `Trancado? Chame agora em ${city}!`,
    ctaText: "Chamar chaveiro agora no WhatsApp",
    whatsappMessage: (company) => `Olá, preciso de um chaveiro urgente. Podem me atender agora? Vi o site da ${company}.`,
    nameSuffix: "Chaveiro",
    galleryLabel: "Nosso trabalho",
    galleryHeading: "Atendimento profissional",
  },
  "marido de aluguel": {
    heroTitle: (city) => `Precisa de um reparo\nem casa em ${city}?`,
    heroSubtitle: (city, company) => `A ${company} resolve pequenos reparos, instalações e manutenção residencial em ${city}. Rápido, prático e sem complicação.`,
    heroImage: heroDefault,
    urgencyBadge: (city) => `⚡ Profissional disponível agora em ${city}`,
    aboutLabel: "Por que nos chamar?",
    aboutHeading: "Reparos rápidos\nsem dor de cabeça",
    aboutText: (city, company) => `Torneira pingando, prateleira caindo, tomada com defeito? A ${company} resolve tudo em ${city}. Profissional pontual, organizado e que deixa tudo limpo depois.`,
    benefits: [
      "Reparos rápidos e sem bagunça",
      "Profissional pontual e organizado",
      "Orçamento transparente antes de começar",
      "Atendimento em toda a região",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "O que resolvemos",
    services: [
      { title: "Instalações em Geral", desc: "Prateleiras, suportes de TV, cortinas, luminárias. Instalação profissional." },
      { title: "Reparos Hidráulicos", desc: "Torneira pingando, vazamento, troca de sifão. Resolvemos na hora." },
      { title: "Reparos Elétricos", desc: "Tomada, interruptor, ventilador. Pequenos reparos elétricos com segurança." },
      { title: "Manutenção Geral", desc: "Porta emperrada, fechadura, rejunte. Tudo o que sua casa precisa." },
    ],
    reviews: [],
    reviewCount: 0,
    footerTagline: (city) => `Precisa de um reparo? Chame agora em ${city}!`,
    ctaText: "Pedir orçamento no WhatsApp",
    whatsappMessage: (company) => `Olá, preciso de um reparo em casa. Podem me atender? Vi o site da ${company}.`,
    nameSuffix: "Reparos",
    galleryLabel: "Nosso trabalho",
    galleryHeading: "Serviços realizados",
  },
  "nutricionista": {
    heroTitle: (city) => `Quer cuidar da sua\nalimentação em ${city}?`,
    heroSubtitle: (city, company) => `A ${company} oferece acompanhamento nutricional personalizado em ${city}. Consulta individual com plano alimentar sob medida.`,
    heroImage: heroDefault,
    urgencyBadge: (city) => `⚡ Consulta disponível em ${city}`,
    aboutLabel: "Por que começar agora?",
    aboutHeading: "Alimentação certa\nmuda tudo na sua vida",
    aboutText: (city, company) => `Emagrecer, ganhar massa, controlar diabetes ou simplesmente comer melhor. A ${company} em ${city} cria um plano alimentar personalizado que cabe na sua rotina e no seu bolso.`,
    benefits: [
      "Plano alimentar personalizado",
      "Acompanhamento individual",
      "Consulta presencial ou online",
      "Resultados reais e sustentáveis",
    ],
    servicesLabel: "Especialidades",
    servicesHeading: "Como podemos ajudar",
    services: [
      { title: "Emagrecimento Saudável", desc: "Plano personalizado sem dietas restritivas. Resultado sustentável." },
      { title: "Nutrição Esportiva", desc: "Ganho de massa, performance e recuperação. Para quem treina sério." },
      { title: "Reeducação Alimentar", desc: "Aprenda a comer bem sem sofrimento. Mude seus hábitos de verdade." },
      { title: "Acompanhamento Online", desc: "Consulta por vídeo com plano completo. Praticidade sem perder qualidade." },
    ],
    reviews: [],
    reviewCount: 0,
    footerTagline: (city) => `Cuide da sua alimentação. Agende em ${city} agora!`,
    ctaText: "Agendar consulta no WhatsApp",
    whatsappMessage: (company) => `Olá, gostaria de agendar uma consulta na ${company}. Podem me ajudar?`,
    nameSuffix: "Nutrição",
    galleryLabel: "Nosso consultório",
    galleryHeading: "Espaço profissional",
  },
  "pintor": {
    heroTitle: (city) => `Precisa pintar sua casa\nou empresa em ${city}?`,
    heroSubtitle: (city, company) => `A ${company} faz pintura residencial e comercial em ${city} com acabamento profissional e orçamento sem surpresa.`,
    heroImage: heroDefault,
    urgencyBadge: (city) => `⚡ Orçamento grátis em ${city}`,
    aboutLabel: "Por que nos escolher?",
    aboutHeading: "Acabamento impecável\ne preço justo",
    aboutText: (city, company) => `Pintura mal feita é dinheiro jogado fora. A ${company} trabalha com tintas de qualidade, preparação correta da superfície e acabamento que faz diferença. Orçamento grátis e sem compromisso em ${city}.`,
    benefits: [
      "Orçamento grátis e sem compromisso",
      "Tintas de qualidade e alta durabilidade",
      "Acabamento limpo e profissional",
      "Cumprimos prazo combinado",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "O que fazemos",
    services: [
      { title: "Pintura Residencial", desc: "Interna e externa. Preparação completa e acabamento perfeito." },
      { title: "Pintura Comercial", desc: "Lojas, escritórios e galpões. Pintura profissional com agilidade." },
      { title: "Textura e Grafiato", desc: "Efeitos decorativos que valorizam seu ambiente." },
      { title: "Pintura de Portões e Grades", desc: "Tratamento anticorrosivo e pintura com esmalte de qualidade." },
    ],
    reviews: [],
    reviewCount: 0,
    footerTagline: (city) => `Quer renovar sua pintura? Peça orçamento em ${city}!`,
    ctaText: "Pedir orçamento no WhatsApp",
    whatsappMessage: (company) => `Olá, preciso de um orçamento de pintura. Podem me ajudar? Vi o site da ${company}.`,
    nameSuffix: "Pinturas",
    galleryLabel: "Nossos trabalhos",
    galleryHeading: "Antes e depois",
  },
  "eletricista": {
    heroTitle: (city) => `Problema elétrico?\nEletricista rápido em ${city}`,
    heroSubtitle: (city, company) => `A ${company} resolve problemas elétricos em ${city} com segurança e rapidez. Residencial e comercial. Chame no WhatsApp.`,
    heroImage: heroDefault,
    urgencyBadge: (city) => `⚡ Eletricista disponível agora em ${city}`,
    aboutLabel: "Por que nos chamar?",
    aboutHeading: "Problema elétrico\nnão pode esperar",
    aboutText: (city, company) => `Curto-circuito, tomada queimada, disjuntor desarmando? Problema elétrico é perigoso e precisa de profissional. A ${company} atende com rapidez e segurança em ${city}.`,
    benefits: [
      "Atendimento rápido e seguro",
      "Profissional qualificado e experiente",
      "Residencial e comercial",
      "Orçamento antes de começar",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "O que resolvemos",
    services: [
      { title: "Instalação Elétrica", desc: "Tomadas, interruptores, quadro de distribuição. Instalação segura." },
      { title: "Reparo de Curto-Circuito", desc: "Identificação e reparo rápido. Não fique no escuro." },
      { title: "Troca de Fiação", desc: "Fiação antiga é risco de incêndio. Troque com segurança." },
      { title: "Instalação de Chuveiro", desc: "Chuveiro elétrico instalado corretamente. Sem risco, sem gambiarra." },
    ],
    reviews: [],
    reviewCount: 0,
    footerTagline: (city) => `Problema elétrico? Chame agora em ${city}!`,
    ctaText: "Chamar eletricista no WhatsApp",
    whatsappMessage: (company) => `Olá, preciso de um eletricista urgente. Podem me atender? Vi o site da ${company}.`,
    nameSuffix: "Elétrica",
    galleryLabel: "Nosso trabalho",
    galleryHeading: "Serviços realizados",
  },
  "encanador": {
    heroTitle: (city) => `Vazamento em casa?\nEncanador rápido em ${city}`,
    heroSubtitle: (city, company) => `A ${company} resolve vazamentos, entupimentos e instalações hidráulicas em ${city}. Atendimento rápido pelo WhatsApp.`,
    heroImage: heroDefault,
    urgencyBadge: (city) => `⚡ Encanador disponível agora em ${city}`,
    aboutLabel: "Por que nos chamar?",
    aboutHeading: "Vazamento não espera\ne só piora com o tempo",
    aboutText: (city, company) => `Vazamento causa dano no piso, na parede e aumenta a conta de água. A ${company} identifica e resolve rápido em ${city}. Sem quebra-quebra desnecessário.`,
    benefits: [
      "Atendimento rápido de emergência",
      "Caça-vazamento sem quebrar",
      "Profissional experiente e pontual",
      "Orçamento transparente",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "O que resolvemos",
    services: [
      { title: "Reparo de Vazamentos", desc: "Identificação precisa e reparo rápido. Sem quebra-quebra." },
      { title: "Desentupimento", desc: "Pia, ralo, vaso sanitário. Desentupimento rápido e limpo." },
      { title: "Instalação Hidráulica", desc: "Torneira, sifão, registro, caixa d'água. Instalação correta." },
      { title: "Troca de Encanamento", desc: "Cano furado ou velho? Troca rápida com material de qualidade." },
    ],
    reviews: [],
    reviewCount: 0,
    footerTagline: (city) => `Vazamento? Chame agora em ${city}!`,
    ctaText: "Chamar encanador no WhatsApp",
    whatsappMessage: (company) => `Olá, preciso de um encanador urgente. Podem me atender? Vi o site da ${company}.`,
    nameSuffix: "Hidráulica",
    galleryLabel: "Nosso trabalho",
    galleryHeading: "Serviços realizados",
  },
  "auto elétrica": {
    heroTitle: (city) => `Carro com problema elétrico?\nResolva hoje em ${city}`,
    heroSubtitle: (city, company) => `Bateria descarregada, alternador com defeito, carro não liga? A ${company} resolve na hora em ${city}. Atendimento no local.`,
    heroImage: heroBatteries,
    urgencyBadge: (city) => `⚡ Atendimento disponível agora em ${city}`,
    aboutLabel: "Por que nos chamar?",
    aboutHeading: "Problema elétrico no carro\nnão se resolve sozinho",
    aboutText: (city, company) => `Luz do painel acendeu? Motor de arranque não funciona? A ${company} faz diagnóstico e reparo elétrico automotivo em ${city}. Profissionais experientes e peças com garantia.`,
    benefits: [
      "Diagnóstico na hora",
      "Atendimento no local ou na oficina",
      "Peças com garantia",
      "Profissionais especializados",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "O que resolvemos",
    services: [
      { title: "Troca de Bateria", desc: "Entrega e instalação no local. Todas as marcas com garantia." },
      { title: "Reparo de Alternador", desc: "Alternador com defeito? Reparamos ou trocamos na hora." },
      { title: "Motor de Arranque", desc: "Carro não liga? Diagnóstico e reparo do motor de arranque." },
      { title: "Parte Elétrica Geral", desc: "Faróis, vidros elétricos, travas, alarme. Reparo completo." },
    ],
    reviews: [],
    reviewCount: 0,
    footerTagline: (city) => `Problema elétrico no carro? Chame agora em ${city}!`,
    ctaText: "Falar com atendimento no WhatsApp",
    whatsappMessage: (company) => `Olá, meu carro está com problema elétrico. Podem me atender? Vi o site da ${company}.`,
    nameSuffix: "Auto Elétrica",
    galleryLabel: "Nossa oficina",
    galleryHeading: "Estrutura profissional",
  },
  "massagista": {
    heroTitle: (city) => `Precisando relaxar\ne aliviar a tensão em ${city}?`,
    heroSubtitle: (city, company) => `A ${company} oferece massagem terapêutica e relaxante em ${city}. Agende pelo WhatsApp e cuide do seu corpo.`,
    heroImage: heroPhysiotherapy,
    urgencyBadge: (city) => `⚡ Horário disponível hoje em ${city}`,
    aboutLabel: "Por que agendar agora?",
    aboutHeading: "Seu corpo pede\num descanso de verdade",
    aboutText: (city, company) => `Tensão muscular, dor nas costas, estresse acumulado. A ${company} em ${city} trabalha com técnicas profissionais que aliviam de verdade. Sessão individual com hora marcada.`,
    benefits: [
      "Alívio imediato de tensão e dor",
      "Sessões individuais e personalizadas",
      "Ambiente tranquilo e profissional",
      "Agendamento fácil pelo WhatsApp",
    ],
    servicesLabel: "Tipos de massagem",
    servicesHeading: "Escolha a sua",
    services: [
      { title: "Massagem Relaxante", desc: "Alívio de estresse e tensão. Sessão completa com óleos essenciais." },
      { title: "Massagem Terapêutica", desc: "Para dores musculares crônicas. Técnicas profundas e eficazes." },
      { title: "Massagem Desportiva", desc: "Para atletas e praticantes de atividade física. Recuperação muscular." },
      { title: "Quick Massage", desc: "Sessão rápida para aliviar tensão no dia a dia. Ideal para o intervalo." },
    ],
    reviews: [],
    reviewCount: 0,
    footerTagline: (city) => `Precisa relaxar? Agende em ${city} agora!`,
    ctaText: "Agendar massagem no WhatsApp",
    whatsappMessage: (company) => `Olá, gostaria de agendar uma massagem na ${company}. Tem horário disponível?`,
    nameSuffix: "Massoterapia",
    galleryLabel: "Nosso espaço",
    galleryHeading: "Ambiente profissional",
  },
  "desentupidora": {
    heroTitle: (city) => `Entupiu?\nDesentupidora rápida em ${city}`,
    heroSubtitle: (city, company) => `A ${company} resolve entupimentos em ${city} com rapidez e sem quebrar. Atendimento de emergência pelo WhatsApp.`,
    heroImage: heroDefault,
    urgencyBadge: (city) => `⚡ Atendimento de emergência em ${city}`,
    aboutLabel: "Por que nos chamar?",
    aboutHeading: "Entupimento é urgência\ne a gente resolve rápido",
    aboutText: (city, company) => `Pia entupida, esgoto transbordando, vaso sanitário entupido. A ${company} resolve em ${city} com equipamento profissional, sem quebrar parede e sem sujeira.`,
    benefits: [
      "Atendimento de emergência rápido",
      "Sem quebrar parede ou piso",
      "Equipamento profissional de alta pressão",
      "Orçamento grátis pelo WhatsApp",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "O que resolvemos",
    services: [
      { title: "Desentupimento de Esgoto", desc: "Esgoto transbordando? Resolvemos com hidrojateamento profissional." },
      { title: "Desentupimento de Pia", desc: "Pia da cozinha ou banheiro entupida? Limpeza rápida e eficiente." },
      { title: "Desentupimento de Vaso", desc: "Vaso sanitário entupido? Resolvemos sem quebrar nada." },
      { title: "Limpeza de Fossa", desc: "Fossa cheia ou com mau cheiro? Limpeza completa com caminhão." },
    ],
    reviews: [],
    reviewCount: 0,
    footerTagline: (city) => `Entupiu? Chame agora em ${city}!`,
    ctaText: "Chamar desentupidora no WhatsApp",
    whatsappMessage: (company) => `Olá, preciso de desentupimento urgente. Podem vir agora? Vi o site da ${company}.`,
    nameSuffix: "Desentupidora",
    galleryLabel: "Nosso trabalho",
    galleryHeading: "Serviços realizados",
  },
  "guincho": {
    heroTitle: (city) => `Carro quebrou na rua?\nGuincho rápido em ${city}`,
    heroSubtitle: (city, company) => `A ${company} faz remoção e socorro em ${city} e região. Atendimento 24h pelo WhatsApp. Chame agora.`,
    heroImage: heroMechanic,
    urgencyBadge: (city) => `⚡ Guincho disponível agora em ${city}`,
    aboutLabel: "Por que nos chamar?",
    aboutHeading: "Parado na rua?\nA gente chega rápido",
    aboutText: (city, company) => `Carro quebrou, pneu furou, ficou na mão? A ${company} atende em ${city} e região com rapidez. Guincho plataforma para veículos leves e pesados. Atendimento 24 horas.`,
    benefits: [
      "Atendimento 24 horas por dia",
      "Guincho plataforma seguro",
      "Cobertura em toda a região",
      "Preço justo e sem surpresa",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "Como podemos ajudar",
    services: [
      { title: "Remoção de Veículos", desc: "Guincho plataforma para carros, motos e utilitários. Transporte seguro." },
      { title: "Socorro Mecânico", desc: "Pane seca, pneu furado, bateria. Socorro rápido no local." },
      { title: "Transporte de Longa Distância", desc: "Precisa levar o carro pra outra cidade? Transporte seguro." },
      { title: "Atendimento 24h", desc: "De madrugada, fim de semana ou feriado. Estamos disponíveis." },
    ],
    reviews: [],
    reviewCount: 0,
    footerTagline: (city) => `Parado na rua? Chame guincho agora em ${city}!`,
    ctaText: "Chamar guincho no WhatsApp",
    whatsappMessage: (company) => `Olá, preciso de guincho urgente. Podem vir agora? Vi o site da ${company}.`,
    nameSuffix: "Guincho",
    galleryLabel: "Nosso trabalho",
    galleryHeading: "Atendimentos realizados",
  },
  "funilaria": {
    heroTitle: (city) => `Carro batido ou amassado?\nFunilaria em ${city}`,
    heroSubtitle: (city, company) => `A ${company} faz funilaria e pintura automotiva em ${city}. Reparo profissional com acabamento de fábrica. Peça orçamento.`,
    heroImage: heroMechanic,
    urgencyBadge: (city) => `⚡ Orçamento grátis em ${city}`,
    aboutLabel: "Por que nos escolher?",
    aboutHeading: "Acabamento de fábrica\ncom preço justo",
    aboutText: (city, company) => `Bateu o carro? Amassou a porta? A ${company} faz o reparo completo em ${city} com tinta original e acabamento que parece de fábrica. Orçamento grátis e sem compromisso.`,
    benefits: [
      "Acabamento com padrão de fábrica",
      "Orçamento grátis e sem compromisso",
      "Tinta original do veículo",
      "Prazo cumprido e combinado",
    ],
    servicesLabel: "Serviços",
    servicesHeading: "O que fazemos",
    services: [
      { title: "Funilaria Completa", desc: "Reparos de colisão, amassados e deformações. Resultado perfeito." },
      { title: "Pintura Automotiva", desc: "Pintura parcial ou total com tinta original. Acabamento de fábrica." },
      { title: "Polimento e Cristalização", desc: "Recupere o brilho original do seu carro. Resultado imediato." },
      { title: "Martelinho de Ouro", desc: "Pequenos amassados sem repintura. Reparo rápido e econômico." },
    ],
    reviews: [],
    reviewCount: 0,
    footerTagline: (city) => `Carro amassado? Peça orçamento em ${city}!`,
    ctaText: "Pedir orçamento no WhatsApp",
    whatsappMessage: (company) => `Olá, preciso de um orçamento de funilaria. Podem me ajudar? Vi o site da ${company}.`,
    nameSuffix: "Funilaria",
    galleryLabel: "Nossos reparos",
    galleryHeading: "Antes e depois",
  },
};

// Default fallback template - EMERGENCY tone
const defaultTemplate: NicheTemplate = {
  heroTitle: (city) => `Precisa de ajuda agora\nem ${city}?`,
  heroSubtitle: (city, company) => `Não espere mais. A ${company} resolve rápido e sem complicação em ${city}. Chame no WhatsApp e seja atendido agora.`,
  heroImage: heroDefault,
  heroVideo: undefined,
  urgencyBadge: (city) => `⚡ Atendimento disponível agora em ${city}`,
  aboutLabel: "Por que agir agora?",
  aboutHeading: "Quanto mais você espera,\nmais difícil fica",
  aboutText: (city, company) => `A ${company} é referência em ${city}. Atendimento rápido, profissionais preparados e resultado comprovado. Chame agora no WhatsApp e resolva hoje.`,
  benefits: [
    "Atendimento imediato sem espera",
    "Equipe preparada e experiente",
    "Estrutura profissional completa",
    "Cuidado de verdade com cada cliente",
  ],
  servicesLabel: "Serviços",
  servicesHeading: "Resolva hoje mesmo",
  services: [
    { title: "Atendimento Imediato", desc: "Sem espera. Chame no WhatsApp e seja atendido em minutos." },
    { title: "Preço Justo e Transparente", desc: "Orçamento sem surpresas. Melhor custo-benefício da região." },
    { title: "Profissionais Experientes", desc: "Equipe qualificada que resolve de verdade." },
    { title: "Garantia de Satisfação", desc: "Seu problema resolvido. Sem enrolação, sem desculpa." },
  ],
  reviews: [],
  reviewCount: 0,
  footerTagline: (city) => `Não espere mais. Chame agora em ${city}!`,
  ctaText: "Falar com atendimento agora no WhatsApp",
  whatsappMessage: (company) => `Olá, preciso de atendimento agora na ${company}. Podem me ajudar?`,
  galleryLabel: "Nosso espaço",
  galleryHeading: "Conheça nossa estrutura",
};

function findTemplate(niche: string): NicheTemplate {
  const key = niche.toLowerCase().trim();
  if (nicheTemplateMap[key]) return nicheTemplateMap[key];
  for (const [k, v] of Object.entries(nicheTemplateMap)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return defaultTemplate;
}

export function getNicheContent(niche: string, city: string = "", companyName: string = ""): NicheContent {
  const template = findTemplate(niche);
  const cityName = city || "sua cidade";
  const company = companyName || "nosso estabelecimento";

  return {
    heroTitle: template.heroTitle(cityName),
    heroSubtitle: template.heroSubtitle(cityName, company),
    heroImage: template.heroImage,
    heroVideo: template.heroVideo,
    urgencyBadge: template.urgencyBadge(cityName),
    aboutLabel: template.aboutLabel,
    aboutHeading: template.aboutHeading,
    aboutText: template.aboutText(cityName, company),
    benefits: template.benefits,
    servicesLabel: template.servicesLabel,
    servicesHeading: template.servicesHeading,
    services: template.services,
    reviews: template.reviews,
    reviewCount: template.reviewCount,
    footerTagline: template.footerTagline(cityName),
    ctaText: template.ctaText,
    whatsappMessage: template.whatsappMessage(company),
    nameSuffix: template.nameSuffix,
    galleryLabel: template.galleryLabel,
    galleryHeading: template.galleryHeading,
    salesHeadline: template.salesHeadline || `${company} – Qualidade e confiança em ${cityName}`,
    salesSubheadline: template.salesSubheadline?.(cityName) || `Atendimento profissional em ${cityName} com qualidade e atenção em cada detalhe`,
    salesStat: template.salesStat || `Atendimento profissional em ${cityName}`,
    salesUrgency: template.salesUrgency?.(cityName) || `Serviço de confiança em ${cityName}`,
    salesBenefit: template.salesBenefit || "Atendimento no local com garantia de serviço",
  };
}

// Professional name transformation
const nicheNamePatterns: Record<string, (name: string) => string> = {
  "salão de beleza": (name) => `${name} Hair Studio`,
  "barbearia": (name) => `${name} Barber Shop`,
  "estética": (name) => `${name} Estética`,
  "clínica odontológica": (name) => `${name} Odontologia`,
  "fisioterapia": (name) => `${name} Fisioterapia`,
  "pet shop": (name) => `${name} Pet Shop`,
  "oficina mecânica": (name) => `${name} Auto Center`,
  "baterias": (name) => `${name} Baterias`,
  "imobiliária": (name) => `${name} Imóveis`,
  "contabilidade": (name) => `${name} Contabilidade`,
  "manicure": (name) => `${name} Nail Designer`,
  "advogado": (name) => `${name} Advocacia`,
};

const professionalSuffixes = [
  "hair", "studio", "barber", "shop", "center", "auto", "pet",
  "clínica", "odonto", "estética", "fisio", "imóveis", "contabil",
  "baterias", "marmit", "burger", "grill", "fitness", "gym",
  "nail", "designer", "advocacia", "advogado",
];

export function professionalizeName(rawName: string, niche: string): string {
  const name = rawName.trim();
  const lower = name.toLowerCase();

  if (professionalSuffixes.some((s) => lower.includes(s))) {
    return name;
  }

  const nicheKey = niche.toLowerCase().trim();

  for (const [k, transform] of Object.entries(nicheNamePatterns)) {
    if (nicheKey.includes(k) || k.includes(nicheKey)) {
      return transform(name);
    }
  }

  return name;
}

export const availableNiches = Object.keys(nicheTemplateMap);
