import { Star, Image, Globe, MessageSquare, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Lead } from "@/components/KanbanBoard";

interface GmbScore {
  total: number;
  level: "bom" | "medio" | "fraco";
  color: string;
  bgColor: string;
  label: string;
}

export function calculateGmbScore(lead: Lead): GmbScore {
  let score = 0;

  // Rating (0-30 points)
  const rating = (lead as any).google_rating as number | null;
  if (rating != null) {
    if (rating >= 4.5) score += 30;
    else if (rating >= 4.0) score += 20;
    else if (rating >= 3.0) score += 10;
  }

  // Reviews count (0-25 points)
  const reviews = (lead as any).google_reviews_count as number | null;
  if (reviews != null) {
    if (reviews >= 50) score += 25;
    else if (reviews >= 20) score += 18;
    else if (reviews >= 5) score += 10;
    else if (reviews >= 1) score += 5;
  }

  // Has photos (0-20 points)
  if (lead.photos && lead.photos.length > 0) {
    if (lead.photos.length >= 5) score += 20;
    else score += 10;
  }

  // Has site (0-15 points)
  if (lead.site_status !== "nao_criado") {
    score += 15;
  }

  // Has description (0-10 points)
  if (lead.description && lead.description.length > 20) {
    score += 10;
  }

  if (score >= 60) {
    return { total: score, level: "bom", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-950/40", label: "Bom" };
  } else if (score >= 30) {
    return { total: score, level: "medio", color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-950/40", label: "Médio" };
  }
  return { total: score, level: "fraco", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-950/40", label: "Fraco" };
}

interface Props {
  lead: Lead;
  compact?: boolean;
}

export default function GmbAnalysis({ lead, compact = false }: Props) {
  const score = calculateGmbScore(lead);
  const rating = (lead as any).google_rating as number | null;
  const reviews = (lead as any).google_reviews_count as number | null;
  const hasPhotos = lead.photos && lead.photos.length > 0;
  const hasSite = lead.site_status !== "nao_criado";

  if (compact) {
    return (
      <Badge className={`text-[10px] px-1.5 py-0 ${score.bgColor} ${score.color} border-0`}>
        {score.level === "bom" ? <TrendingUp className="w-3 h-3 mr-0.5" /> :
         score.level === "fraco" ? <TrendingDown className="w-3 h-3 mr-0.5" /> :
         <Minus className="w-3 h-3 mr-0.5" />}
        {score.total}pts
      </Badge>
    );
  }

  return (
    <div className={`rounded-lg border p-4 space-y-3 ${score.bgColor}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Análise Google Meu Negócio</h3>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold ${score.color} ${score.bgColor}`}>
          {score.level === "bom" ? <TrendingUp className="w-3.5 h-3.5" /> :
           score.level === "fraco" ? <TrendingDown className="w-3.5 h-3.5" /> :
           <Minus className="w-3.5 h-3.5" />}
          {score.label} ({score.total}/100)
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 bg-background/60 rounded-md p-2">
          <Star className="w-4 h-4 text-yellow-500 shrink-0" />
          <div>
            <p className="text-xs font-medium text-foreground">
              {rating != null ? `${rating.toFixed(1)} ⭐` : "Sem nota"}
            </p>
            <p className="text-[10px] text-muted-foreground">Nota média</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-background/60 rounded-md p-2">
          <MessageSquare className="w-4 h-4 text-blue-500 shrink-0" />
          <div>
            <p className="text-xs font-medium text-foreground">
              {reviews != null ? reviews : "—"}
            </p>
            <p className="text-[10px] text-muted-foreground">Avaliações</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-background/60 rounded-md p-2">
          <Globe className="w-4 h-4 shrink-0" style={{ color: hasSite ? "#16a34a" : "#dc2626" }} />
          <div>
            <p className="text-xs font-medium text-foreground">
              {hasSite ? "Sim ✓" : "Não ✗"}
            </p>
            <p className="text-[10px] text-muted-foreground">Tem site</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-background/60 rounded-md p-2">
          <Image className="w-4 h-4 shrink-0" style={{ color: hasPhotos ? "#16a34a" : "#dc2626" }} />
          <div>
            <p className="text-xs font-medium text-foreground">
              {hasPhotos ? `Sim (${lead.photos!.length})` : "Não ✗"}
            </p>
            <p className="text-[10px] text-muted-foreground">Tem fotos</p>
          </div>
        </div>
      </div>

      {score.level === "fraco" && (
        <p className="text-[11px] text-muted-foreground italic">
          💡 Oportunidade: esse lead tem presença digital fraca — ideal para oferecer seus serviços.
        </p>
      )}
    </div>
  );
}
