import { Copy, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Lead } from "@/components/KanbanBoard";
import { resolveSpintax } from "@/lib/spintax";

function generateSuggestions(lead: Lead): string[] {
  const suggestions: string[] = [];
  const rating = (lead as any).google_rating as number | null;
  const reviews = (lead as any).google_reviews_count as number | null;
  const hasPhotos = lead.photos && lead.photos.length > 0;
  const hasSite = lead.site_status !== "nao_criado";
  const hasDescription = lead.description && lead.description.length > 20;

  if (!hasSite) {
    suggestions.push(
      `{Oi|Olá}, vi a ${lead.company_name} em ${lead.city} e percebi que vocês não têm um site. {Muitos clientes procuram no Google antes de ligar|Você pode estar perdendo clientes que buscam no Google}.`
    );
  }

  if (reviews == null || reviews < 5) {
    suggestions.push(
      `{Oi|Olá}, achei a ${lead.company_name} no Google e vi que {tem poucas avaliações|dá pra melhorar a presença no Google}. {Isso faz muita diferença pra atrair clientes novos|Um perfil completo atrai muito mais gente}.`
    );
  }

  if (!hasPhotos) {
    suggestions.push(
      `{Oi|Olá}, vi o perfil da ${lead.company_name} e notei que {não tem fotos|faltam fotos do seu trabalho}. {Fotos boas aumentam muito o interesse dos clientes|Um perfil com fotos atrai bem mais contatos}.`
    );
  }

  if (rating != null && rating < 4.0) {
    suggestions.push(
      `{Oi|Olá}, vi que a ${lead.company_name} tem nota ${rating.toFixed(1)} no Google. {Com algumas melhorias simples dá pra subir bastante|Posso te mostrar como melhorar isso rápido}.`
    );
  }

  if (!hasDescription) {
    suggestions.push(
      `{Oi|Olá}, vi a ${lead.company_name} e percebi que {o perfil está incompleto|falta uma descrição boa do negócio}. {Isso ajuda muito quem busca no Google|Um perfil completo passa mais confiança}.`
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      `{Oi|Olá}, dei uma olhada na ${lead.company_name} em ${lead.city} e {achei o trabalho de vocês muito bom|me chamou atenção}. {Tenho uma ideia que pode trazer mais clientes|Posso te mostrar algo rápido?}`
    );
  }

  return suggestions;
}

interface Props {
  lead: Lead;
}

export default function LeadSuggestions({ lead }: Props) {
  const suggestions = generateSuggestions(lead);

  const handleCopy = (text: string) => {
    const resolved = resolveSpintax(text);
    navigator.clipboard.writeText(resolved);
    toast({ title: "Abordagem copiada!" });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-yellow-500" />
        <h3 className="text-sm font-semibold text-foreground">Sugestões de abordagem</h3>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="bg-muted/50 border border-border rounded-lg p-3 space-y-2"
          >
            <p className="text-xs text-muted-foreground leading-relaxed">{s}</p>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] gap-1.5"
              onClick={() => handleCopy(s)}
            >
              <Copy className="w-3 h-3" />
              Copiar abordagem
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
