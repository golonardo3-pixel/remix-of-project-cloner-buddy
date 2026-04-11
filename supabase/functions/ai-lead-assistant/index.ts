import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, lead, clientMessage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "generate_outreach") {
      systemPrompt = `Você é um especialista em vendas consultivas.
Com base nos dados deste lead (nome, segmento, cidade), gere UMA mensagem curta para WhatsApp oferecendo um site profissional por R$97.

Regras:
- Máximo 3 linhas
- Tom natural, sem parecer robô
- Mencione o segmento do negócio dele
- Termine com uma pergunta simples
- Sem emojis excessivos, no máximo 1
- Responda APENAS com a mensagem, sem explicações.`;

      const cityPart = lead.city && !["não informada", "não informado", "n/a", "sem dados"].includes(lead.city.toLowerCase())
        ? lead.city : "";

      userPrompt = `Dados do lead: ${lead.company_name}, ${lead.niche}${cityPart ? `, ${cityPart}` : ""}`;

    } else if (action === "analyze_lead") {
      systemPrompt = `Analise este lead e retorne um JSON com esta estrutura exata:
{
  "score": número de 0 a 100,
  "motivo": "frase curta explicando o score",
  "problems": [{"title": "título curto", "severity": "alta"|"media"|"baixa"}],
  "opportunity": "qual produto vender primeiro (site R$97 ou GMN R$350+)",
  "urgencia": "baixa"|"media"|"alta"
}

Critérios de score:
- Tem negócio local físico? +30 pontos
- Está no Instagram mas sem site? +25 pontos
- Segmento competitivo (clínica, salão, restaurante, loja)? +20 pontos
- Cidade grande ou média? +15 pontos
- Tem poucas avaliações no Google? +10 pontos

Responda APENAS com o JSON, sem markdown, sem explicações.`;

      const cityVal = lead.city && !["não informada", "não informado", "n/a", "sem dados"].includes(lead.city.toLowerCase())
        ? lead.city : "não especificada";

      userPrompt = `Dados: ${lead.company_name}, ${lead.niche}, ${cityVal}
Avaliação Google: ${lead.google_rating ?? "sem dados"}
Qtd avaliações: ${lead.google_reviews_count ?? 0}
Tem site: ${lead.site_status !== "nao_criado" ? "sim" : "não"}
Tem fotos: ${(lead.photos?.length ?? 0) > 0 ? "sim" : "não"}
Instagram: ${lead.instagram || "não tem"}`;

    } else if (action === "followup_day1") {
      systemPrompt = `Você é um vendedor consultivo e humano.
O lead recebeu uma mensagem ontem sobre um site por R$97 mas não respondeu.

Gere UMA mensagem curta de follow-up para WhatsApp que:
- Pareça natural, não robótica
- Não mencione que está fazendo follow-up
- Mostre um benefício novo (aparecer no Google quando cliente pesquisa)
- Termine com pergunta simples
- Máximo 3 linhas
- Responda APENAS com a mensagem, sem explicações.`;

      const city1 = lead.city && !["não informada", "não informado", "n/a", "sem dados"].includes(lead.city.toLowerCase())
        ? lead.city : "";
      userPrompt = `Dados do lead: ${lead.company_name}, ${lead.niche}${city1 ? `, ${city1}` : ""}`;

    } else if (action === "followup_day3") {
      systemPrompt = `Você é um vendedor consultivo e humano.
Este lead não respondeu em 3 dias.

Gere UMA mensagem para WhatsApp que:
- Crie urgência REAL sem pressão falsa
- Mencione que atende poucos clientes por semana em Campinas
- Ofereça mostrar exemplo de site do mesmo segmento dele
- Máximo 3 linhas
- Tom leve, sem desespero
- Responda APENAS com a mensagem, sem explicações.`;

      userPrompt = `Dados do lead: ${lead.company_name}, ${lead.niche}`;

    } else if (action === "followup_day7") {
      systemPrompt = `Você é um vendedor consultivo e humano.
Este lead ficou em silêncio por 7 dias.
É a última mensagem antes de arquivar.

Gere UMA mensagem que:
- Seja honesta: diga que é o último contato
- Deixe a porta aberta sem pressão
- Seja a mais curta das três (2 linhas max)
- Tom tranquilo, sem mágoa
- Pode mencionar que o valor de R$97 não vai durar sempre
- Responda APENAS com a mensagem, sem explicações.`;

      userPrompt = `Dados do lead: ${lead.company_name}, ${lead.niche}`;

    } else if (action === "generate_reply") {
      systemPrompt = `Você é um consultor de presença digital.
O cliente enviou uma mensagem. Gere uma resposta consultiva que:
- Valide a dúvida ou objeção dele
- Explique o valor (não o preço) do serviço
- Se for objeção de preço: mostre ROI simples
- Se for dúvida técnica: simplifique ao máximo
- Termine conduzindo para o fechamento
- Máximo 5 linhas, tom humano
- Responda APENAS com a mensagem, sem explicações.

Serviços disponíveis:
- Site simples com WhatsApp e Google Maps: R$97
- Gestão de mídias (GMN): a partir de R$350/mês`;

      userPrompt = `Contexto do lead:
Empresa: ${lead.company_name}
Nicho: ${lead.niche}

Mensagem do cliente:
"${clientMessage}"`;

    } else {
      return new Response(JSON.stringify({ error: "Ação inválida" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em alguns segundos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("Falha na IA");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ result: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-lead-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
