import { Star, Image, Globe, MessageSquare, AlertTriangle, CheckCircle, FileText, Users, TrendingUp, BarChart3, Target, Shield } from "lucide-react";
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
  impactPhrase: string;
  problems: { text: string; impact: "alto" | "medio" }[];
  competition: "alta" | "media" | "baixa";
  growthPotential: number;
}

function estimateCompetition(lead: Lead): "alta" | "media" | "baixa" {
  const niche = lead.niche.toLowerCase();
  const highComp = ["restaurante", "pizzaria", "hamburgueria", "lanchonete", "barbearia", "salão", "dentista", "advogado", "academia", "pet shop", "clínica", "consultório", "padaria", "farmácia", "imobiliária"];
  const medComp = ["mecânica", "oficina", "borracharia", "elétrica", "chaveiro", "vidraçaria", "marmoraria", "lava jato", "desentupidora", "serralheria"];
  if (highComp.some(n => niche.includes(n))) return "alta";
  if (medComp.some(n => niche.includes(n))) return "media";
  return "baixa";
}

const IMPACT_PHRASES = [
  "Você pode estar perdendo clientes todos os dias sem perceber.",
  "Seu perfil não está aproveitando todo o potencial do Google.",
  "Existe uma oportunidade clara de crescimento na sua região.",
  "Clientes estão procurando por você — mas encontrando a concorrência.",
  "Cada dia sem otimizar é um dia que a concorrência sai na frente.",
];

export function calculateGmbScore(lead: Lead): GmbScore {
  let score = 100;
  const problems: { text: string; impact: "alto" | "medio" }[] = [];

  const rating = lead.google_rating;
  const reviews = lead.google_reviews_count;
  const hasPhotos = lead.photos && lead.photos.length > 0;
  const photoCount = lead.photos?.length ?? 0;
  const hasSite = lead.site_status !== "nao_criado";
  const hasDescription = lead.description && lead.description.length > 20;
  const competition = estimateCompetition(lead);

  // Sem site → impacto alto (-30)
  if (!hasSite) {
    score -= 30;
    problems.push({ text: "Não possui site profissional — clientes não encontram informações online", impact: "alto" });
  }

  // Perfil incompleto → impacto alto (-20)
  if (!hasDescription) {
    score -= 20;
    problems.push({ text: "Perfil incompleto — passa menos confiança para novos clientes", impact: "alto" });
  }

  // Poucas avaliações → impacto médio (-20)
  if (reviews == null || reviews < 10) {
    score -= 20;
    problems.push({ text: `Apenas ${reviews ?? 0} avaliações — dificulta a decisão de novos clientes`, impact: "medio" });
  }

  // Sem fotos → impacto médio (-15)
  if (!hasPhotos) {
    score -= 15;
    problems.push({ text: "Sem fotos no perfil — reduz significativamente o engajamento", impact: "medio" });
  } else if (photoCount < 5) {
    score -= 5;
    problems.push({ text: `Apenas ${photoCount} foto(s) — o ideal são pelo menos 5`, impact: "medio" });
  }

  // Nota baixa → (-15)
  if (rating == null || rating < 4.0) {
    score -= 15;
    problems.push({
      text: rating != null ? `Nota ${rating.toFixed(1)} — abaixo do recomendado (4.0+)` : "Sem nota no Google — perfil sem credibilidade visível",
      impact: rating != null && rating < 3.0 ? "alto" : "medio",
    });
  }

  if (score < 0) score = 0;

  // Growth potential = inverse of score
  const growthPotential = Math.min(100, Math.max(0, 100 - score + (competition === "alta" ? 15 : competition === "media" ? 5 : 0)));

  // Pick impact phrase deterministically based on score
  const phraseIdx = Math.floor((100 - score) / 20) % IMPACT_PHRASES.length;

  if (score <= 40) {
    return {
      total: score, level: "fraco",
      color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-950/40",
      label: "Fraco", emoji: "🔴",
      opportunity: `Esse negócio está abaixo da média da região e pode estar perdendo clientes diariamente.`,
      impactPhrase: IMPACT_PHRASES[phraseIdx],
      problems, competition, growthPotential,
    };
  } else if (score <= 70) {
    return {
      total: score, level: "medio",
      color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-950/40",
      label: "Médio", emoji: "🟡",
      opportunity: `Perfil com pontos de melhoria — otimizações simples podem gerar resultados rápidos.`,
      impactPhrase: IMPACT_PHRASES[phraseIdx],
      problems, competition, growthPotential,
    };
  }
  return {
    total: score, level: "forte",
    color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950/40",
    label: "Forte", emoji: "🟢",
    opportunity: `Perfil competitivo — foque em diferenciação e fidelização de clientes.`,
    impactPhrase: IMPACT_PHRASES[phraseIdx],
    problems, competition, growthPotential,
  };
}

interface Props {
  lead: Lead;
  compact?: boolean;
}

const COMP_CONFIG = {
  alta: { emoji: "🔴", label: "Alta", color: "text-red-600" },
  media: { emoji: "🟡", label: "Média", color: "text-yellow-600" },
  baixa: { emoji: "🟢", label: "Baixa", color: "text-green-600" },
};

export default function GmbAnalysis({ lead, compact = false }: Props) {
  const score = calculateGmbScore(lead);
  const rating = lead.google_rating;
  const reviews = lead.google_reviews_count;
  const hasPhotos = lead.photos && lead.photos.length > 0;
  const hasSite = lead.site_status !== "nao_criado";
  const hasDescription = lead.description && lead.description.length > 20;
  const comp = COMP_CONFIG[score.competition];

  if (compact) {
    return (
      <Badge className={`text-[10px] px-1.5 py-0 ${score.bgColor} ${score.color} border-0 gap-0.5`}>
        {score.emoji} {score.total}pts
      </Badge>
    );
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Report header */}
      <div className={`px-4 py-3 border-b ${score.bgColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-foreground" />
            <h3 className="text-sm font-bold text-foreground">Relatório de Presença Digital</h3>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${score.color} bg-background/90 border`}>
            {score.emoji} {score.total}/100
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">{lead.company_name} · {lead.niche} · {lead.city}</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Score bar + classification */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground font-medium">Score de presença</span>
            <span className={`font-bold ${score.color}`}>{score.label}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                score.level === "fraco" ? "bg-red-500" :
                score.level === "medio" ? "bg-yellow-500" : "bg-green-500"
              }`}
              style={{ width: `${score.total}%` }}
            />
          </div>
        </div>

        {/* Key indicators */}
        <div className="grid grid-cols-3 gap-2">
          <MiniStat
            icon={<Target className="w-3.5 h-3.5" />}
            label="Score"
            value={`${score.total}`}
            sub="/100"
            ok={score.total > 70}
          />
          <MiniStat
            icon={<Users className="w-3.5 h-3.5" />}
            label="Concorrência"
            value={comp.label}
            emoji={comp.emoji}
          />
          <MiniStat
            icon={<TrendingUp className="w-3.5 h-3.5" />}
            label="Potencial"
            value={`${score.growthPotential}%`}
            ok={score.growthPotential > 50}
          />
        </div>

        {/* Detailed metrics */}
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Diagnóstico detalhado</p>
          <div className="grid grid-cols-1 gap-1.5">
            <MetricRow icon="⭐" label="Nota média" value={rating != null ? rating.toFixed(1) : "—"} ok={rating != null && rating >= 4.0} />
            <MetricRow icon="💬" label="Avaliações" value={`${reviews ?? 0}`} ok={reviews != null && reviews >= 10} />
            <MetricRow icon="🌐" label="Site profissional" value={hasSite ? "Sim" : "Não"} ok={hasSite} />
            <MetricRow icon="📸" label="Fotos" value={hasPhotos ? `${lead.photos!.length} fotos` : "Nenhuma"} ok={hasPhotos} />
            <MetricRow icon="📝" label="Descrição" value={hasDescription ? "Completa" : "Incompleta"} ok={!!hasDescription} />
          </div>
        </div>

        {/* Diagnostic block */}
        {score.problems.length > 0 && (
          <div className="rounded-lg border border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/20 p-3 space-y-2">
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-orange-500" />
              Oportunidades identificadas
            </p>
            {score.problems.map((p, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 mt-0.5 ${
                  p.impact === "alto" ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                }`}>
                  {p.impact === "alto" ? "ALTO" : "MÉDIO"}
                </span>
                <p className="text-[11px] text-muted-foreground leading-snug">{p.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Impact phrase */}
        <div className={`rounded-lg p-3 border-l-4 ${
          score.level === "fraco" ? "border-l-red-500 bg-red-50/50 dark:bg-red-950/20" :
          score.level === "medio" ? "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20" :
          "border-l-green-500 bg-green-50/50 dark:bg-green-950/20"
        }`}>
          <p className="text-xs font-semibold text-foreground mb-1">💡 Resumo consultivo</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{score.opportunity}</p>
          <p className="text-[11px] font-medium text-foreground mt-1.5 italic">"{score.impactPhrase}"</p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value, sub, ok, emoji }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; ok?: boolean; emoji?: string;
}) {
  return (
    <div className="text-center bg-muted/50 rounded-lg p-2 border">
      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">{icon}<span className="text-[9px] font-medium">{label}</span></div>
      <p className="text-sm font-bold text-foreground">
        {emoji && <span className="mr-0.5">{emoji}</span>}
        {value}
        {sub && <span className="text-[10px] font-normal text-muted-foreground">{sub}</span>}
      </p>
    </div>
  );
}

function MetricRow({ icon, label, value, ok }: {
  icon: string; label: string; value: string; ok: boolean;
}) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${ok ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900" : "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900"}`}>
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-foreground">{value}</span>
        {ok ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
      </div>
    </div>
  );
}
