// Generates unique, realistic Brazilian reviews per site using slug as seed
// EMERGENCY / URGENCY tone - reviews that show immediate resolution

const BRAZILIAN_NAMES = [
  "Ana Paula", "Camila R.", "Fernanda S.", "Juliana M.", "Patrícia L.",
  "Mariana C.", "Beatriz A.", "Larissa F.", "Tatiane O.", "Vanessa B.",
  "Ricardo L.", "Lucas M.", "André P.", "Carlos E.", "Felipe D.",
  "Marcos V.", "Rafael T.", "Bruno S.", "Eduardo N.", "Gustavo H.",
  "Priscila G.", "Amanda K.", "Renata W.", "Simone J.", "Débora I.",
  "Roberto A.", "Thiago C.", "Diego R.", "Fábio M.", "Leandro P.",
];

const NICHE_REVIEWS: Record<string, string[]> = {
  "salão de beleza": [
    "Liguei desesperada porque tinha evento no mesmo dia. Me encaixaram na hora e o resultado ficou perfeito!",
    "Meu cabelo estava destruído e em uma sessão resolveram tudo. Saí outra pessoa!",
    "Agendei pelo WhatsApp às 8h e às 9h já estava sendo atendida. Sem enrolação nenhuma.",
    "Estava quase desistindo de salão até vir aqui. Finalmente alguém que entende o que eu quero!",
    "Cheguei com o cabelo quebrado e saí com ele lindo. Equipe incrível, salvaram meu dia!",
    "Primeira vez que um salão cumpre o horário marcado. Atendimento rápido e resultado perfeito.",
    "Mandei mensagem no WhatsApp e em 5 minutos já tinham me respondido e agendado. Eficiência!",
    "Minha amiga recomendou e agora entendo por quê. Resultado muito acima do que eu esperava.",
    "Precisava ficar pronta pra uma entrevista de emprego e me atenderam com urgência. Resultado incrível!",
    "Nunca mais vou em outro salão. Aqui resolvem rápido e o resultado é sempre impecável.",
  ],
  "barbearia": [
    "Precisava cortar urgente pra uma reunião e me encaixaram em 20 minutos. Corte perfeito!",
    "Cheguei sem agendar e mesmo assim fui atendido rápido. Degradê impecável!",
    "Mandei mensagem no WhatsApp e em 10 minutos já estava na cadeira. Zero espera!",
    "Melhor corte que já fiz na vida. Rápido, sem frescura e resultado profissional.",
    "O barbeiro entendeu exatamente o que eu queria sem eu precisar explicar muito. Top!",
    "Estava precisando cortar pra uma festa e me atenderam no mesmo dia. Salvaram meu rolê!",
    "Corte + barba em menos de 40 minutos e resultado impecável. Virei cliente fiel.",
    "Agendei pelo WhatsApp às 7h da manhã e às 7:30 já estava sendo atendido. Eficiência pura!",
    "Trouxe meu filho e ele adorou. Atendimento paciente e corte perfeito. Recomendo demais!",
    "Já rodei várias barbearias e nenhuma chega perto dessa. Qualidade e rapidez imbatíveis.",
  ],
  "estética": [
    "Resultado visível já na primeira sessão! Saí de lá me sentindo outra pessoa.",
    "Estava insegura mas a profissional me explicou tudo e o resultado ficou super natural.",
    "Agendei avaliação grátis pelo WhatsApp e no mesmo dia já fiz o procedimento. Amei!",
    "Fiz harmonização e todo mundo pergunta o que eu fiz. Resultado natural e lindo!",
    "Minha autoestima mudou completamente. Devia ter vindo antes, não espere como eu esperei!",
    "Profissional super cuidadosa. Me senti segura do início ao fim. Recomendo sem medo!",
    "Resultado incrível, preço justo e atendimento humanizado. Tudo que eu buscava!",
    "Estava adiando há meses e me arrependo de não ter vindo antes. Resultado maravilhoso!",
    "A avaliação grátis já me convenceu. Profissional séria e resultado real.",
    "Indiquei pra 3 amigas e todas amaram. Essa clínica é referência de verdade!",
  ],
  "restaurante": [
    "Pedi pelo WhatsApp e em 25 minutos chegou quentinho. Comida com gosto de verdade!",
    "Melhor comida da região e não é exagero. Sabor caseiro que lembra comida de mãe.",
    "Porção enorme e sabor incrível. Pago feliz porque vale cada centavo!",
    "Peço todo dia pro escritório e nunca me decepciona. Sempre chega no horário certinho.",
    "Pedi pela primeira vez e já virei cliente. Arroz soltinho, feijão temperado, carne macia.",
    "Comida de verdade, não aquela comida sem gosto de delivery. Recomendo demais!",
    "Comi o filé e quase chorei de tão bom. Voltarei toda semana com certeza!",
    "Atendimento rápido, comida fresca e embalagem que mantém tudo quente. Nota 10!",
    "Já pedi em vários restaurantes e nenhum chega perto desse. Sabor é outro nível!",
    "Peço aqui quando não quero cozinhar e sempre acerto. Nunca me arrependendo.",
  ],
  "dentista": [
    "Estava com dor insuportável e me atenderam em menos de 1 hora. Resolveram na hora!",
    "Tinha pavor de dentista e aqui não senti absolutamente nada. Anestesia indolor de verdade!",
    "Dente quebrou no sábado e me atenderam de emergência. Salvaram meu final de semana!",
    "Fiz clareamento e em uma sessão meus dentes ficaram brancos de verdade. Incrível!",
    "Estava com abscesso e ligaram 'vem agora'. Em 30 minutos eu já estava sendo atendida.",
    "Toda minha família se trata aqui. Confiança total no profissional. Recomendo!",
    "Tinha vergonha de sorrir e depois do tratamento não paro de rir. Mudou minha vida!",
    "Fiz implante sem dor nenhuma. Equipe sensacional e acompanhamento pós-operatório perfeito.",
    "Liguei com dor de dente às 22h e me orientaram pelo WhatsApp na hora. Humanidade!",
    "Preço justo, parcela no cartão e resultado perfeito. Não precisa mais procurar.",
  ],
  "academia": [
    "Em 2 meses já vi resultado real. O professor acompanha de perto, não te abandona!",
    "Cheguei sedentário e hoje estou em forma. A aula grátis me convenceu de vez!",
    "Tentei academia 3 vezes e sempre desisti. Aqui é diferente, o acompanhamento faz diferença.",
    "Equipamentos novos, ambiente limpo e instrutores que realmente se importam. Top!",
    "Perdi 12kg em 4 meses! Os professores são incríveis e motivam a gente todo dia.",
    "Horários flexíveis que cabem na minha rotina maluca. Finalmente consegui manter!",
    "Comecei pela aula grátis sem esperança e hoje não vivo sem treinar aqui.",
    "Melhor custo-benefício da região. Estrutura de academia premium com preço acessível.",
    "O treino personalizado mudou meu corpo em semanas. Resultado que nunca tive antes!",
    "Já treinei em academia cara e aqui o resultado foi muito melhor. Recomendo!",
  ],
  "petshop": [
    "Levei meu cachorro de emergência e fui atendido na hora. Excelente atendimento!",
    "Meu pet voltou cheiroso e feliz! Equipe super carinhosa e cuidadosa.",
    "Veterinário salvou meu gato que estava muito doente. Gratidão eterna a essa equipe!",
    "Agendei banho pelo WhatsApp e foi super prático. Em 10 minutos já tinham confirmado.",
    "Minha cachorrinha é medrosa mas aqui ficou calminha. Equipe sabe lidar com animais nervosos.",
    "Trouxe meu pet passando mal às 20h e me atenderam. Salvaram a vida dele!",
    "Banho e tosa impecáveis! Meu cachorro voltou parecendo outro. Amei demais!",
    "Confiança total nessa equipe. Já são 3 anos trazendo meus pets aqui sem problema nenhum.",
    "Vacina atrasada? Resolveram na hora sem fila. Atendimento rápido e eficiente.",
    "Meu pet foi muito bem tratado. Dá pra ver que amam os animais de verdade.",
  ],
  "mecânica": [
    "Carro parou no meio da rua e em 1 hora já estava funcionando. Me salvaram!",
    "3 oficinas não acharam o problema e aqui descobriram em 15 minutos. Competência!",
    "Orçamento transparente, sem surpresa. Preço justo e serviço bem feito de verdade.",
    "Motor falhando há semanas e ninguém resolvia. Aqui resolveram no mesmo dia!",
    "Freio rangendo e eu adiando. Trouxe aqui e trocaram na hora. Rápido e seguro.",
    "Fiz revisão antes de viajar e o mecânico achou um problema que podia me deixar na estrada!",
    "Oficina honesta. Mostram o que precisa trocar e não empurram serviço desnecessário.",
    "Carro voltou como novo. Barulho sumiu completamente. Recomendo de olhos fechados!",
    "Mandei mensagem no WhatsApp e em 30 minutos já estava com meu carro na oficina.",
    "Toda minha família faz manutenção aqui. Confiança de anos sem nunca decepcionar.",
  ],
  "baterias": [
    "Carro parou na rua e em 30 minutos já tinham instalado bateria nova. Me salvaram!",
    "Chamei às 23h e vieram! Socorro 24h de verdade, não é propaganda. Incrível!",
    "Melhor preço da região e instalação no local. Não precisei ir a lugar nenhum.",
    "Testaram a bateria antiga e só trocaram porque realmente precisava. Honestidade!",
    "Estava na correria pro trabalho e resolveram em menos de 40 minutos. Eficiência!",
    "Bateria com garantia, preço justo e instalação grátis. O que mais posso pedir?",
    "De madrugada, fim de semana, feriado – eles vão até você. Serviço sério de verdade.",
    "Já comprei 3 baterias aqui. Sempre o melhor preço e atendimento mais rápido.",
    "Minha esposa ficou na mão e em 25 minutos já tinham resolvido. Obrigado!",
    "Chamei achando que era bateria mas era alternador. Foram honestos e indicaram mecânico.",
  ],
  "marmitaria": [
    "Peço todo dia e nunca me decepciona. Chega quente, na hora e com sabor de verdade!",
    "Porção enorme! Uma marmita alimenta eu e minha esposa tranquilamente. Preço justo!",
    "Comida caseira de verdade, não aquela comida sem alma. Tempero incrível!",
    "Peço pro escritório inteiro e todo mundo elogia. Virou a marmitaria oficial!",
    "Pedido pelo WhatsApp é super prático. Respondem rápido e entregam no horário certinho.",
    "A marmita fitness é saborosa de verdade, não sem gosto igual de outros lugares.",
    "Cardápio muda todo dia. Nunca enjoa! Sempre tem opção nova e gostosa.",
    "Entrega pontual no horário do almoço. Nunca passei fome esperando pedido daqui.",
    "Melhor custo-benefício da região. Porção generosa e sabor que vale cada centavo.",
    "Comi aqui uma vez e nunca mais cozinhei. Virei cliente fiel!",
  ],
  "imobiliária": [
    "Encontraram o apartamento perfeito pra mim em 4 dias! Achei que ia demorar meses.",
    "Atendimento rápido pelo WhatsApp com fotos e vídeos. Não perdi tempo visitando furada.",
    "Corretor entendeu exatamente o que eu queria e me mostrou opções certeiras.",
    "Fechei negócio em menos de 2 semanas. Processo sem burocracia desnecessária!",
    "Tinha opções que não estavam em nenhum portal. Imóveis exclusivos de verdade!",
    "Documentação resolvida rapidamente. Não precisei me preocupar com nada.",
    "Aluguei meu imóvel em 3 dias. Divulgação eficiente e atendimento profissional!",
    "Me ajudaram com financiamento e economizei muito. Equipe que realmente orienta.",
    "Já rodei 5 imobiliárias e nenhuma foi tão eficiente quanto essa. Recomendo!",
    "Negociação justa e transparente. Me senti seguro durante todo o processo.",
  ],
  "contabilidade": [
    "Abriram minha empresa em 3 dias! Achei que ia demorar semanas. Eficiência incrível!",
    "Estava pagando imposto a mais há 2 anos. Eles resolveram e economizei R$ 800/mês!",
    "Atendimento pelo WhatsApp rápido e prático. Tiro dúvida a qualquer hora do dia.",
    "Minha contabilidade era uma bagunça. Organizaram tudo em uma semana. Profissionais!",
    "Quase tomei multa da Receita e eles resolveram em cima da hora. Me salvaram!",
    "Declaração de imposto de renda feita em 1 dia. Sem erro, sem complicação.",
    "Troquei de contador e foi a melhor decisão. Aqui explicam tudo de forma simples.",
    "Planejamento tributário que realmente funciona. Economia real no meu bolso.",
    "Já sou cliente há 4 anos e nunca tive problema nenhum. Confiança total!",
    "Profissionais sérios, atualizados e acessíveis. Não trocaria por nada.",
  ],
  "fisioterapia": [
    "Travei de dor na sexta e na segunda já estava andando normal. Incrível!",
    "Primeira sessão e já senti alívio. Não imaginava que seria tão rápido!",
    "Adiava há meses achando que ia passar sozinha. Devia ter vindo antes!",
    "Fisioterapeuta excelente. Explica cada movimento e o resultado aparece rápido.",
    "Operei o joelho e a reabilitação aqui foi perfeita. Recuperei 100% do movimento.",
    "Dor crônica que eu achava que era normal. Em 6 sessões mudou minha vida!",
    "Agendei pelo WhatsApp e fui atendido no mesmo dia. Sem fila, sem espera.",
    "Minha mãe recuperou a mobilidade que achava que nunca mais ia ter. Gratidão!",
    "Técnicas modernas que resolvem de verdade, não aquela fisioterapia de ficar só fazendo bolsa quente.",
    "Melhor investimento que fiz na minha saúde. Cada sessão vale muito a pena.",
  ],
  "manicure": [
    "Minhas unhas nunca ficaram tão bonitas! Gel que dura semanas sem descascar.",
    "Agendei pelo WhatsApp e fui atendida no horário certinho. Super prática!",
    "Nail art incrível! Todo mundo elogia minhas unhas agora. Virei cliente fiel!",
    "Ambiente limpo e aconchegante. Dá pra ver que usam material de qualidade.",
    "Alongamento perfeito, formato natural. Parece unha de verdade!",
    "Atendimento carinhoso e resultado impecável. Não troco por nada!",
    "Fiz francesinha e ficou perfeita. Melhor nail designer da região!",
    "Unhas que duram 3 semanas fácil. Material de primeira mesmo.",
    "Pontualidade nota 10. Agenda cheia mas sempre encontra horário pra mim.",
    "Já passei por várias manicures e aqui é outro nível. Recomendo demais!",
  ],
  "advogado": [
    "Ganhei minha causa trabalhista graças a essa equipe. Competência total!",
    "Explicaram tudo de forma simples, sem juridiquês. Finalmente entendi meus direitos!",
    "Processo que arrastava há 2 anos, eles resolveram em meses. Eficiência!",
    "Me atenderam pelo WhatsApp rapidamente e já orientaram o próximo passo.",
    "Divórcio foi mais tranquilo do que eu imaginava. Equipe sensível e profissional.",
    "Consegui a guarda dos meus filhos. Advogado competente e humano.",
    "Empresa me devia e em 3 meses já tinha recebido. Resultado rápido!",
    "Consultoria preventiva que me economizou uma dor de cabeça enorme.",
    "Confiança total nessa equipe. Sempre disponíveis e transparentes.",
    "Melhor escritório da região. Atendimento personalizado e resultados reais.",
  ],
  "chaveiro": [
    "Fiquei trancado pra fora às 23h e em 20 minutos já tinham resolvido. Salvaram minha noite!",
    "Abriram a porta sem danificar nada. Profissional de verdade!",
    "Precisei de chave codificada do carro e fizeram na hora. Rápido e sem complicação.",
    "Troquei a fechadura da minha casa e ficou perfeito. Preço justo!",
    "Chamei de madrugada e vieram sem reclamar. Atendimento 24h de verdade!",
    "Perdi a chave do escritório e resolveram em 15 minutos. Eficiência!",
    "Fiz cópia de todas as chaves de casa e ficou tudo perfeito. Recomendo!",
    "Profissional educado, rápido e honesto. Virei cliente fiel.",
    "Minha fechadura travou e conseguiram abrir sem quebrar. Incrível!",
    "Melhor chaveiro da região. Preço justo e atendimento impecável.",
  ],
  "marido de aluguel": [
    "Instalou minha TV na parede em 30 minutos. Ficou perfeito e alinhado!",
    "Troquei todas as torneiras de casa e não pingou mais. Profissional de verdade!",
    "Porta que estava emperrando há meses, resolveu em 10 minutos. Top!",
    "Instalou cortineiro, prateleiras e suporte de TV no mesmo dia. Eficiente demais!",
    "Profissional pontual e organizado. Deixou tudo limpo depois do serviço.",
    "Fez o rejunte do banheiro e ficou como novo. Recomendo!",
    "Trocou a fechadura e ajustou a porta que estava batendo. Resolvido!",
    "Chamei pelo WhatsApp e no mesmo dia já estava fazendo o serviço. Prático!",
    "Consertou o interruptor e instalou o ventilador. Tudo funcionando perfeito!",
    "Melhor custo-benefício. Faz de tudo e faz bem feito. Super recomendo!",
  ],
  "nutricionista": [
    "Perdi 8kg em 2 meses sem passar fome. O plano alimentar é perfeito pra minha rotina!",
    "Finalmente entendi como me alimentar direito. Mudou minha vida!",
    "Consulta super detalhada e plano personalizado. Não é aquela dieta genérica.",
    "Ganhei massa muscular e energia. Nutricionista que entende de esporte!",
    "Meu colesterol baixou e me sinto muito melhor. Devia ter procurado antes!",
    "Atendimento online super prático. Recebi meu plano no mesmo dia!",
    "Minha filha melhorou muito a alimentação depois da consulta. Profissional incrível!",
    "Sem dieta restritiva, sem sofrimento. Resultado real e sustentável!",
    "Acompanhamento pelo WhatsApp é ótimo. Tiro dúvida a qualquer momento.",
    "Melhor investimento na minha saúde. Recomendo pra todo mundo!",
  ],
  "pintor": [
    "Pintaram minha casa inteira em 3 dias e ficou impecável. Acabamento perfeito!",
    "Preparação da parede feita direitinho. A tinta ficou lisa e uniforme.",
    "Orçamento justo e sem surpresa. Cumpriram o prazo combinado!",
    "Fizeram textura na sala e ficou lindo. Parece revista de decoração!",
    "Pintaram o portão com tinta anti-ferrugem e ficou como novo!",
    "Profissionais limpos e organizados. Não sujaram nada dentro de casa.",
    "Tintas de qualidade e mão de obra excelente. Resultado que dura!",
    "Renovaram a fachada da minha loja e os clientes elogiam. Valeu o investimento!",
    "Atenderam rápido pelo WhatsApp e no dia seguinte já estavam trabalhando.",
    "Melhor pintor da região. Preço justo e trabalho impecável!",
  ],
  "eletricista": [
    "Disjuntor vivia desarmando e resolveram em 1 hora. Problema era na fiação antiga!",
    "Instalaram meu chuveiro elétrico perfeitamente. Zero gambiarra!",
    "Estava com curto-circuito em casa e resolveram rápido. Me senti segura de novo!",
    "Trocaram toda a fiação do apartamento antigo. Trabalho limpo e seguro.",
    "Instalaram tomadas novas e interruptores. Ficou tudo organizado!",
    "Atenderam no mesmo dia que liguei. Urgência de verdade!",
    "Profissional sério e que explica o que está fazendo. Confiança total!",
    "Minha empresa estava com problema elétrico e resolveram sem parar nada.",
    "Orçamento transparente e preço justo. Sem surpresa na hora de pagar.",
    "Recomendo demais. Trabalho profissional e atendimento excelente!",
  ],
  "encanador": [
    "Vazamento que ninguém achava, eles encontraram em 15 minutos. Incrível!",
    "Trocaram o sifão da pia e o registro do chuveiro na mesma visita. Prático!",
    "Vaso sanitário entupido resolvido em 20 minutos. Rápido e limpo!",
    "Fizeram caça-vazamento sem quebrar nada. Tecnologia de verdade!",
    "Instalaram caixa d'água nova e ficou tudo funcionando perfeitamente.",
    "Chamei de emergência e vieram na hora. Não deixaram minha casa alagar!",
    "Profissional pontual, limpo e que resolve de primeira. Nota 10!",
    "Trocaram o encanamento velho da cozinha. Agora funciona perfeito!",
    "Preço justo e trabalho honesto. Sem empurrar serviço desnecessário.",
    "Melhor encanador que já contratei. Virei cliente fiel!",
  ],
  "auto elétrica": [
    "Carro não ligava e em 30 minutos já tinham trocado a bateria. Me salvaram!",
    "Alternador com defeito e resolveram no mesmo dia. Competência!",
    "Instalaram alarme e vidro elétrico. Tudo funcionando perfeitamente!",
    "Motor de arranque reparado na hora. Não precisei deixar o carro.",
    "Diagnóstico preciso e rápido. Não ficam enrolando nem empurrando serviço.",
    "Farol queimado e parte elétrica toda resolvida em uma visita.",
    "Atenderam no local quando meu carro parou. Socorro de verdade!",
    "Preço justo e serviço bem feito. Peças com garantia!",
    "Já tentei em outros lugares e ninguém achava o problema. Aqui resolveram!",
    "Equipe séria e profissional. Confiança total. Recomendo!",
  ],
  "massagista": [
    "Saí da sessão parecendo outra pessoa. Tensão nas costas sumiu completamente!",
    "Massagem terapêutica que realmente resolve. Não é só relaxamento.",
    "Ambiente tranquilo e profissional. Me senti acolhida do início ao fim.",
    "Dor no ombro que tinha há meses aliviou em uma sessão. Incrível!",
    "Agendei pelo WhatsApp e fui atendida no horário certinho. Super prática!",
    "Melhor massagem que já fiz. Técnica profissional de verdade!",
    "Faço sessão toda semana e minha qualidade de vida mudou completamente.",
    "Quick massage no intervalo do trabalho é a melhor coisa. Recomendo!",
    "Profissional atenciosa e que entende do corpo. Resultado real!",
    "Presente que dei pra minha mãe e ela amou. Voltou relaxadíssima!",
  ],
  "desentupidora": [
    "Esgoto transbordando e resolveram em 40 minutos. Me salvaram!",
    "Pia da cozinha entupida há dias. Vieram e resolveram na hora!",
    "Usaram hidrojateamento e ficou tudo limpo. Sem quebrar nada!",
    "Chamei às 22h e vieram. Atendimento de emergência de verdade!",
    "Vaso sanitário entupido resolvido rapidamente. Profissionais!",
    "Fizeram limpeza de fossa e o mau cheiro sumiu. Serviço completo!",
    "Preço justo e trabalho bem feito. Sem surpresa na hora de pagar.",
    "Ralo do banheiro entupido e resolveram sem quebrar o piso. Top!",
    "Atendimento rápido pelo WhatsApp. Mandei mensagem e em 30 min estavam aqui.",
    "Já chamei 3 vezes e sempre resolveram de primeira. Confiança total!",
  ],
  "guincho": [
    "Carro quebrou na estrada e em 40 minutos já estavam me socorrendo. Salvação!",
    "Guincho plataforma que não arranha o carro. Transporte seguro de verdade!",
    "Chamei às 3h da manhã e vieram. Atendimento 24h que funciona!",
    "Pneu furou na rodovia e vieram me socorrer rápido. Me senti seguro!",
    "Transportaram meu carro pra outra cidade com todo cuidado. Recomendo!",
    "Preço combinado antes e sem surpresa na hora. Profissionais honestos!",
    "Pane seca e resolveram no local. Nem precisou guinchar. Honestidade!",
    "Moto quebrou no meio da cidade e vieram buscar em 20 minutos. Eficientes!",
    "Já usei 2 vezes e nas duas foram impecáveis. Confiança total!",
    "Melhor guincho da região. Rápido, seguro e preço justo!",
  ],
  "funilaria": [
    "Bati a porta do carro e ficou como novo depois do reparo. Acabamento perfeito!",
    "Pintura com tinta original. Ninguém percebe que foi reparado!",
    "Orçamento grátis e preço justo. Cumpriram o prazo combinado!",
    "Martelinho de ouro resolveu o amassado sem precisar repintar. Economia!",
    "Polimento deixou meu carro brilhando. Parece que saiu da concessionária!",
    "Repararam o para-choque e ficou perfeito. Trabalho profissional!",
    "Fiz cristalização e o carro ficou com brilho de novo. Valeu cada centavo!",
    "Raspei o carro no muro e consertaram rapidinho. Ninguém nota!",
    "Equipe séria e trabalho de qualidade. Meu carro ficou impecável!",
    "Melhor funilaria da região. Indicaram prazo e cumpriram direitinho.",
  ],
};

const DEFAULT_REVIEWS = [
  "Precisava resolver urgente e me atenderam na hora. Salvaram meu dia!",
  "Mandei mensagem no WhatsApp e em 10 minutos já tinham respondido. Eficiência!",
  "Melhor atendimento da região. Rápido, profissional e resultado de verdade.",
  "Estava adiando e me arrependo de não ter vindo antes. Resolveram tudo rápido!",
  "Profissionais competentes e preço justo. Não precisa procurar mais nada.",
  "Atendimento humanizado e resultado que impressiona. Recomendo de olhos fechados!",
  "Já indiquei pra toda minha família e todos voltam satisfeitos.",
  "Cheguei preocupado e saí aliviado. Resolveram meu problema no mesmo dia!",
  "Equipe preparada e ambiente profissional. Confiança total!",
  "Preço honesto e trabalho sério. Melhor escolha que fiz na vida!",
];

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
