import { Star, Image, Globe, MessageSquare, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Lead } from "@/components/KanbanBoard";

interface GmbScore {
  total: number;
  level: "forte" | "medio" | "fraco";
  color: string;
  bgColor: string;
  label: string;
  emoji: string;
  opportunity: string;
  problems: string[];
}

export function calculateGmbScore(lead: Lead): GmbScore {
  let score = 100;
  const problems: string[] = [];

  const rating = lead.google_rating;
  const reviews = lead.google_reviews_count;
  const hasPhotos = lead.photos && lead.photos.length > 0;
  const hasSite = lead.site_status !== "nao_criado";
  const hasDescription = lead.description && lead.description.length > 20;

  // Sem site → -30
  if (!hasSite) {
    score -= 30;
    problems.push("Não possui site profissional");
  }

  // Menos de 10 avaliações → -20
  if (reviews == null || reviews < 10) {
    score -= 20;
    problems.push(`Poucas avaliações (${reviews ?? 0})`);
  }

  // Nota abaixo de 4.0 → -15
  if (rating == null || rating < 4.0) {
    score -= 15;
    problems.push(rating != null ? `Nota baixa (${rating.toFixed(1)})` : "Sem nota no Google");
  }

  // Sem fotos → -15
  if (!hasPhotos) {
    score -= 15;
    problems.push("Sem fotos no perfil");
  }

  // Perfil incompleto → -20
  if (!hasDescription) {
    score -= 20;
    problems.push("Perfil incompleto (sem descrição)");
  }

  if (score < 0) score = 0;

  const opportunities = [
    "Grande oportunidade de melhoria",
    "Pode estar perdendo clientes",
    "Perfil com potencial de crescimento",
  ];

  if (score <= 40) {
    return {
      total: score, level: "fraco",
      color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-950/40",
      label: "Fraco", emoji: "🔴",
      opportunity: "Grande oportunidade — presença digital muito fraca.",
      problems,
    };
  } else if (score <= 70) {
    return {
      total: score, level: "medio",
      color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-950/40",
      label: "Médio", emoji: "🟡",
      opportunity: "Pode estar perdendo clientes por falta de otimização.",
      problems,
    };
  }
  return {
    total: score, level: "forte",
    color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950/40",
    label: "Forte", emoji: "🟢",
    opportunity: "Perfil competitivo — foque em diferenciação.",
    problems,
  };
}

interface Props {
  lead: Lead;
  compact?: boolean;
}

export default function GmbAnalysis({ lead, compact = false }: Props) {
  const score = calculateGmbScore(lead);
  const rating = lead.google_rating;
  const reviews = lead.google_reviews_count;
  const hasPhotos = lead.photos && lead.photos.length > 0;
  const hasSite = lead.site_status !== "nao_criado";
  const hasDescription = lead.description && lead.description.length > 20;

  if (compact) {
    return (
      <Badge className={`text-[10px] px-1.5 py-0 ${score.bgColor} ${score.color} border-0 gap-0.5`}>
        {score.emoji} {score.total}pts
      </Badge>
    );
  }

  return (
    <div className={`rounded-xl border p-4 space-y-4 ${score.bgColor}`}>
      {/* Header with score */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">📊 Análise Google Meu Negócio</h3>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${score.color} bg-background/80 border`}>
          {score.emoji} {score.label} — {score.total}/100
        </div>
      </div>

      {/* Score bar */}
      <div className="w-full bg-background/60 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            score.level === "fraco" ? "bg-red-500" :
            score.level === "medio" ? "bg-yellow-500" : "bg-green-500"
          }`}
          style={{ width: `${score.total}%` }}
        />
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-2">
        <MetricBox
          icon={<Star className="w-4 h-4 text-yellow-500" />}
          value={rating != null ? `${rating.toFixed(1)} ⭐` : "Sem nota"}
          label="Nota média"
          ok={rating != null && rating >= 4.0}
        />
        <MetricBox
          icon={<MessageSquare className="w-4 h-4 text-blue-500" />}
          value={reviews != null ? `${reviews}` : "0"}
          label="Avaliações"
          ok={reviews != null && reviews >= 10}
        />
        <MetricBox
          icon={<Globe className="w-4 h-4" />}
          value={hasSite ? "Sim ✓" : "Não ✗"}
          label="Tem site"
          ok={hasSite}
        />
        <MetricBox
          icon={<Image className="w-4 h-4" />}
          value={hasPhotos ? `Sim (${lead.photos!.length})` : "Não ✗"}
          label="Tem fotos"
          ok={hasPhotos}
        />
        <MetricBox
          icon={<FileText className="w-4 h-4" />}
          value={hasDescription ? "Sim ✓" : "Não ✗"}
          label="Descrição"
          ok={!!hasDescription}
          className="col-span-2"
        />
      </div>

      {/* Problems list */}
      {score.problems.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-foreground flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
            Problemas detectados:
          </p>
          {score.problems.map((p, i) => (
            <p key={i} className="text-[11px] text-muted-foreground pl-5">• {p}</p>
          ))}
        </div>
      )}

      {/* Opportunity message */}
      <div className={`rounded-lg p-3 border ${
        score.level === "fraco" ? "bg-red-100/50 dark:bg-red-950/30 border-red-200 dark:border-red-900" :
        score.level === "medio" ? "bg-yellow-100/50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900" :
        "bg-green-100/50 dark:bg-green-950/30 border-green-200 dark:border-green-900"
      }`}>
        <p className="text-xs font-medium text-foreground">
          💡 {score.opportunity}
        </p>
      </div>
    </div>
  );
}

function MetricBox({ icon, value, label, ok, className = "" }: {
  icon: React.ReactNode; value: string; label: string; ok: boolean; className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 bg-background/70 rounded-lg p-2.5 border ${ok ? "border-green-200 dark:border-green-900" : "border-red-200 dark:border-red-900"} ${className}`}>
      <div className="shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
      {ok ? (
        <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
      ) : (
        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
      )}
    </div>
  );
}
