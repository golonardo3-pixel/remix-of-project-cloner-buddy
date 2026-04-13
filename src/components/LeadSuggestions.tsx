import { useState } from "react";
import { Copy, Zap, UserCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Lead } from "@/components/KanbanBoard";
import { resolveSpintax } from "@/lib/spintax";
import { calculateGmbScore } from "@/components/GmbAnalysis";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

function generateSuggestions(lead: Lead): { text: string; tag: string }[] {
  const suggestions: { text: string; tag: string }[] = [];
  const rating = lead.google_rating;
  const reviews = lead.google_reviews_count;
  const hasPhotos = lead.photos && lead.photos.length > 0;
  const hasSite = lead.site_status !== "nao_criado";
  const hasDescription = lead.description && lead.description.length > 20;

  if (!hasSite) {
    suggestions.push({
      tag: "🌐 Sem site",
      text: `{Oi|Olá}, tudo bem?\n\nEstava analisando alguns negócios aqui em ${lead.city} e encontrei a ${lead.company_name}.\n\n{Percebi|Notei} que vocês ainda não têm um site — e isso {pode estar fazendo diferença na hora de atrair clientes|faz muita diferença hoje em dia}.\n\n{Posso te mostrar uma ideia rápida?|Se quiser, te explico em 1 minuto como resolver isso.}`,
    });
  }

  if (reviews == null || reviews < 10) {
    suggestions.push({
      tag: "💬 Poucas avaliações",
      text: `{Oi|Olá}, tudo bem?\n\nDei uma olhada na ${lead.company_name} no Google e vi que {tem poucas avaliações|o perfil tem ${reviews ?? 0} avaliações}.\n\n{Sabia que isso impacta diretamente na decisão de novos clientes?|Muita gente olha as avaliações antes de escolher onde ir.}\n\n{Tenho umas dicas simples que podem ajudar|Posso te mostrar como melhorar isso de forma natural}.`,
    });
  }

  if (!hasPhotos) {
    suggestions.push({
      tag: "📸 Sem fotos",
      text: `{Oi|Olá}, tudo {bem|certo}?\n\nVi o perfil da ${lead.company_name} no Google e notei que {não tem fotos|faltam fotos do seu trabalho}.\n\n{Um perfil com boas fotos atrai muito mais atenção|Fotos fazem toda a diferença na hora de um cliente decidir}.\n\n{Se quiser, posso te dar umas dicas|Posso te mostrar como melhorar isso rapidinho}.`,
    });
  }

  if (rating != null && rating < 4.0) {
    suggestions.push({
      tag: "⭐ Nota baixa",
      text: `{Oi|Olá}, tudo bem?\n\nVi que a ${lead.company_name} tem nota ${rating.toFixed(1)} no Google. {Com algumas ações simples dá pra melhorar bastante|Existem formas práticas de subir essa nota}.\n\n{Clientes confiam muito na nota antes de escolher|Uma nota boa faz muita diferença}.\n\n{Quer que eu te mostre como?|Posso te explicar rapidinho.}`,
    });
  }

  if (!hasDescription) {
    suggestions.push({
      tag: "📝 Perfil incompleto",
      text: `{Oi|Olá}, tudo {bem|certo}?\n\nAnalisei o perfil da ${lead.company_name} no Google e percebi que {está incompleto|falta informação importante}.\n\n{Um perfil completo passa muito mais confiança|Isso ajuda bastante quem busca por ${lead.niche} na região}.\n\n{Posso te ajudar com isso|Se quiser, te dou umas dicas rápidas}.`,
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      tag: "✅ Perfil forte",
      text: `{Oi|Olá}, tudo {bem|certo}?\n\nDei uma olhada na ${lead.company_name} em ${lead.city} e {achei o trabalho de vocês muito bom|me chamou atenção}.\n\n{Tenho uma ideia que pode trazer ainda mais clientes|Vi uma oportunidade que pode fazer diferença pra vocês}.\n\n{Posso te mostrar?|Te explico em 1 minuto.}`,
    });
  }

  return suggestions.slice(0, 3);
}

function generateConsultiveApproach(lead: Lead): string {
  const score = calculateGmbScore(lead);
  const problemsList = score.problems.map(p => `• ${p.text}`).join("\n");

  return resolveSpintax(
    `{Oi|Olá}, tudo {bem|certo}?\n\n` +
    `{Fiz|Realizei} uma análise rápida da presença digital da ${lead.company_name} aqui em ${lead.city} e {encontrei alguns pontos importantes|identifiquei algumas oportunidades}.\n\n` +
    `📊 Score atual: ${score.total}/100 (${score.label})\n\n` +
    (score.problems.length > 0 ? `Pontos que {merecem atenção|podem ser melhorados}:\n${problemsList}\n\n` : "") +
    `{Isso impacta diretamente|Esses pontos afetam} a forma como novos clientes encontram e escolhem o seu negócio no Google.\n\n` +
    `{Preparei uma sugestão personalizada — posso te mostrar?|Se fizer sentido, te explico como resolver isso de forma simples.}`
  );
}

interface Props {
  lead: Lead;
}

export default function LeadSuggestions({ lead }: Props) {
  const suggestions = generateSuggestions(lead);
  const score = calculateGmbScore(lead);
  const [showConsultive, setShowConsultive] = useState(false);

  const handleCopy = (text: string) => {
    const resolved = resolveSpintax(text);
    navigator.clipboard.writeText(resolved);
    toast({ title: "Abordagem copiada!" });
  };

  const handleCopyConsultive = () => {
    const msg = generateConsultiveApproach(lead);
    navigator.clipboard.writeText(msg);
    toast({ title: "Abordagem consultiva copiada!" });
    setShowConsultive(true);
  };

  const handleSendConsultive = () => {
    const msg = generateConsultiveApproach(lead);
    window.open(buildWhatsAppUrl(lead.phone, msg), "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Quick suggestions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <h3 className="text-sm font-bold text-foreground">Abordagens Rápidas</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${score.bgColor} ${score.color}`}>
            {score.problems.length} {score.problems.length === 1 ? "problema" : "problemas"}
          </span>
        </div>
        <div className="space-y-2">
          {suggestions.map((s, i) => (
            <div key={i} className="bg-muted/50 border border-border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground bg-background px-2 py-0.5 rounded-full border">
                  {s.tag}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px] gap-1.5"
                  onClick={() => handleCopy(s.text)}
                >
                  <Copy className="w-3 h-3" />
                  Copiar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Consultive mode */}
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-foreground" />
          <h3 className="text-sm font-bold text-foreground">Modo Consultor</h3>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Gera uma mensagem profissional e consultiva com base no diagnóstico completo — sem parecer spam.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5 flex-1"
            onClick={handleCopyConsultive}
          >
            <Copy className="w-3.5 h-3.5" />
            Copiar abordagem consultiva
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs gap-1.5 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSendConsultive}
          >
            <Send className="w-3.5 h-3.5" />
            WhatsApp
          </Button>
        </div>
        {showConsultive && (
          <div className="bg-muted/50 rounded-lg p-3 border">
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {generateConsultiveApproach(lead)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
