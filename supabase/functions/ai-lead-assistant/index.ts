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
      systemPrompt = `Você é um especialista em prospecção comercial para pequenos negócios no Brasil. 
Gere UMA mensagem curta para WhatsApp (máximo 3 linhas) para abordar o lead.
A mensagem deve ser natural, humana, consultiva — nunca parecer robô.
Use no máximo 1 emoji. Não inclua links. Não pressione o cliente.
Responda APENAS com a mensagem, sem explicações.`;

      const cityPart = lead.city && !["não informada", "não informado", "n/a", "sem dados"].includes(lead.city.toLowerCase())
        ? ` em ${lead.city}` : "";

      userPrompt = `Empresa: ${lead.company_name}
Nicho: ${lead.niche}
Cidade: ${lead.city || "não informada"}${cityPart ? "" : " (NÃO mencione cidade na mensagem)"}
Status: ${lead.lead_status}
Avaliação Google: ${lead.google_rating ?? "sem dados"}
Qtd avaliações: ${lead.google_reviews_count ?? "sem dados"}
Tem site: ${lead.site_status !== "nao_criado" ? "sim" : "não"}
Descrição: ${lead.description || "não disponível"}`;

    } else if (action === "analyze_lead") {
      systemPrompt = `Você é um consultor de marketing digital especializado em pequenos negócios brasileiros.
Analise o lead e retorne um JSON com esta estrutura exata:
{
  "score": número de 0 a 100,
  "problems": [{"title": "título curto", "severity": "alta"|"media"|"baixa"}],
  "opportunity": "texto curto de 1-2 linhas sobre oportunidade de venda"
}
Responda APENAS com o JSON, sem markdown, sem explicações.`;

      userPrompt = `Empresa: ${lead.company_name}
Nicho: ${lead.niche}
Cidade: ${lead.city}
Avaliação Google: ${lead.google_rating ?? "sem dados"}
Qtd avaliações: ${lead.google_reviews_count ?? 0}
Tem site: ${lead.site_status !== "nao_criado" ? "sim" : "não"}
Tem fotos: ${(lead.photos?.length ?? 0) > 0 ? "sim" : "não"}
Descrição: ${lead.description || "sem descrição"}
Instagram: ${lead.instagram || "não tem"}`;

    } else if (action === "generate_reply") {
      systemPrompt = `Você é um consultor de marketing digital que está respondendo a mensagem de um potencial cliente.
Gere uma resposta natural, consultiva, sem pressão. Máximo 4 linhas.
Sem emojis exagerados (máximo 1). Tom profissional mas humano.
Responda APENAS com a mensagem, sem explicações.`;

      userPrompt = `Contexto do lead:
Empresa: ${lead.company_name}
Nicho: ${lead.niche}
Cidade: ${lead.city}

Mensagem do cliente:
"${clientMessage}"

Gere uma resposta ideal para essa mensagem.`;

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
