import { Copy, Lightbulb, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Lead } from "@/components/KanbanBoard";
import { resolveSpintax } from "@/lib/spintax";
import { calculateGmbScore } from "@/components/GmbAnalysis";

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
      text: `{Oi|Olá}, vi a ${lead.company_name} em ${lead.city} e percebi que vocês {ainda não têm|não possuem} um site profissional. {Muitos clientes procuram no Google antes de ligar|Você pode estar perdendo clientes que buscam no Google}. {Posso te mostrar uma solução rápida?|Quer ver como resolver isso?}`,
    });
  }

  if (reviews == null || reviews < 10) {
    suggestions.push({
      tag: "💬 Poucas avaliações",
      text: `{Notei|Percebi} que o perfil da ${lead.company_name} tem {poucas avaliações|apenas ${reviews ?? 0} avaliações} no Google. {Isso impacta diretamente novos clientes|Sabia que isso afasta clientes novos?}. {Tenho umas dicas que podem ajudar|Posso te mostrar como melhorar isso}.`,
    });
  }

  if (!hasPhotos) {
    suggestions.push({
      tag: "📸 Sem fotos",
      text: `{Oi|Olá}, vi o perfil da ${lead.company_name} e notei que {não tem fotos|faltam fotos do seu trabalho}. {Fotos boas aumentam muito o interesse dos clientes|Um perfil com fotos atrai bem mais contatos}. {Isso pode estar te fazendo perder clientes|Essa é uma melhoria rápida e que faz diferença}.`,
    });
  }

  if (rating != null && rating < 4.0) {
    suggestions.push({
      tag: "⭐ Nota baixa",
      text: `{Oi|Olá}, vi que a ${lead.company_name} tem nota ${rating.toFixed(1)} no Google. {Com algumas melhorias simples dá pra subir bastante|Posso te mostrar como melhorar isso rápido}. {Nota boa faz muita diferença pra atrair cliente novo|Clientes confiam muito na nota do Google}.`,
    });
  }

  if (!hasDescription) {
    suggestions.push({
      tag: "📝 Perfil incompleto",
      text: `{Oi|Olá}, vi a ${lead.company_name} e percebi que {o perfil está incompleto|falta uma descrição boa do negócio}. {Isso ajuda muito quem busca no Google|Um perfil completo passa mais confiança}. {Posso te ajudar com isso|Quer uma dica rápida?}`,
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      tag: "✅ Perfil forte",
      text: `{Oi|Olá}, dei uma olhada na ${lead.company_name} em ${lead.city} e {achei o trabalho de vocês muito bom|me chamou atenção}. {Tenho uma ideia que pode trazer ainda mais clientes|Posso te mostrar algo rápido que pode fazer diferença?}`,
    });
  }

  return suggestions.slice(0, 3);
}

interface Props {
  lead: Lead;
}

export default function LeadSuggestions({ lead }: Props) {
  const suggestions = generateSuggestions(lead);
  const score = calculateGmbScore(lead);

  const handleCopy = (text: string) => {
    const resolved = resolveSpintax(text);
    navigator.clipboard.writeText(resolved);
    toast({ title: "Abordagem copiada!" });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-500" />
        <h3 className="text-sm font-bold text-foreground">Sugestões de Abordagem</h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${score.bgColor} ${score.color}`}>
          Baseado no score
        </span>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="bg-muted/50 border border-border rounded-lg p-3 space-y-2"
          >
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
                Copiar abordagem
              </Button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
