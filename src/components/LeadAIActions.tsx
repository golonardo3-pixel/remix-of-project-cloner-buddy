import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Copy, Brain, MessageSquareReply } from "lucide-react";
import type { Lead } from "@/components/KanbanBoard";

interface Props {
  lead: Lead;
  compact?: boolean;
}

interface AnalysisResult {
  score: number;
  motivo: string;
  problems: { title: string; severity: "alta" | "media" | "baixa" }[];
  opportunity: string;
  urgencia: "baixa" | "media" | "alta";
}

const SEVERITY_COLORS: Record<string, string> = {
  alta: "bg-red-100 text-red-700 border-red-200",
  media: "bg-yellow-100 text-yellow-700 border-yellow-200",
  baixa: "bg-blue-100 text-blue-700 border-blue-200",
};

function getScoreColor(score: number) {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
}

async function callAI(action: string, lead: Lead, clientMessage?: string) {
  const { data, error } = await supabase.functions.invoke("ai-lead-assistant", {
    body: { action, lead, clientMessage },
  });
  if (error) throw new Error(error.message || "Erro na IA");
  if (data?.error) throw new Error(data.error);
  return data.result as string;
}

export default function LeadAIActions({ lead, compact = false }: Props) {
  const [outreachMsg, setOutreachMsg] = useState("");
  const [outreachLoading, setOutreachLoading] = useState(false);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const [clientMsg, setClientMsg] = useState("");
  const [replyMsg, setReplyMsg] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!" });
  };

  const handleOutreach = async () => {
    setOutreachLoading(true);
    setOutreachMsg("");
    try {
      const result = await callAI("generate_outreach", lead);
      setOutreachMsg(result);
    } catch (e: any) {
      toast({ title: "Erro ao gerar mensagem", description: e.message, variant: "destructive" });
    } finally {
      setOutreachLoading(false);
    }
  };

  const handleAnalysis = async () => {
    setAnalysisLoading(true);
    setAnalysis(null);
    try {
      const result = await callAI("analyze_lead", lead);
      const parsed = JSON.parse(result);
      setAnalysis(parsed);
    } catch (e: any) {
      toast({ title: "Erro ao analisar lead", description: e.message, variant: "destructive" });
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleReply = async () => {
    if (!clientMsg.trim()) {
      toast({ title: "Cole a mensagem do cliente primeiro", variant: "destructive" });
      return;
    }
    setReplyLoading(true);
    setReplyMsg("");
    try {
      const result = await callAI("generate_reply", lead, clientMsg.trim());
      setReplyMsg(result);
    } catch (e: any) {
      toast({ title: "Erro ao gerar resposta", description: e.message, variant: "destructive" });
    } finally {
      setReplyLoading(false);
    }
  };

  // Compact: only outreach button for LeadCard
  if (compact) {
    return (
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 gap-1.5 text-violet-600 hover:text-violet-700 hover:bg-violet-50 text-xs font-medium w-full"
          disabled={outreachLoading}
          onClick={(e) => { e.stopPropagation(); handleOutreach(); }}
        >
          {outreachLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {outreachLoading ? "Gerando..." : "Abordagem IA"}
        </Button>
        {outreachMsg && (
          <div className="bg-violet-50 rounded-md p-2 text-xs text-violet-900 space-y-1.5" onClick={(e) => e.stopPropagation()}>
            <p className="whitespace-pre-wrap">{outreachMsg}</p>
            <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={() => handleCopy(outreachMsg)}>
              <Copy className="w-3 h-3" /> Copiar
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Full view for LeadDetailSheet
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-violet-600" /> Assistente IA
      </h4>

      {/* 1. Generate outreach */}
      <div className="space-y-2">
        <Button size="sm" variant="outline" className="gap-1.5 w-full" disabled={outreachLoading} onClick={handleOutreach}>
          {outreachLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {outreachLoading ? "Gerando com IA..." : "Gerar abordagem com IA"}
        </Button>
        {outreachMsg && (
          <div className="bg-violet-50 rounded-md p-3 text-sm text-violet-900 space-y-2">
            <p className="whitespace-pre-wrap">{outreachMsg}</p>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handleCopy(outreachMsg)}>
              <Copy className="w-3.5 h-3.5" /> Copiar mensagem
            </Button>
          </div>
        )}
      </div>

      {/* 2. Analyze lead */}
      <div className="space-y-2">
        <Button size="sm" variant="outline" className="gap-1.5 w-full" disabled={analysisLoading} onClick={handleAnalysis}>
          {analysisLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          {analysisLoading ? "Analisando com IA..." : "Analisar lead (IA)"}
        </Button>
        {analysis && (
          <div className="bg-muted/50 rounded-md p-3 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Pontuação:</span>
              <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>{analysis.score}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
              {analysis.urgencia && (
                <Badge variant="outline" className={`text-[10px] ml-auto ${
                  analysis.urgencia === "alta" ? "bg-destructive/10 text-destructive border-destructive/20" :
                  analysis.urgencia === "media" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                  "bg-blue-100 text-blue-700 border-blue-200"
                }`}>
                  Urgência: {analysis.urgencia}
                </Badge>
              )}
            </div>
            {analysis.motivo && (
              <p className="text-xs text-muted-foreground italic">{analysis.motivo}</p>
            )}
            {analysis.problems.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Problemas:</span>
                <div className="flex flex-wrap gap-1">
                  {analysis.problems.map((p, i) => (
                    <Badge key={i} variant="outline" className={`text-[10px] ${SEVERITY_COLORS[p.severity] || ""}`}>
                      {p.title}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div>
              <span className="text-xs font-medium text-muted-foreground">Produto recomendado:</span>
              <p className="text-sm mt-0.5">{analysis.opportunity}</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Reply to client */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <MessageSquareReply className="w-3.5 h-3.5" /> Responder cliente com IA
        </span>
        <Textarea
          placeholder="Cole aqui a mensagem do cliente..."
          rows={3}
          value={clientMsg}
          onChange={(e) => setClientMsg(e.target.value)}
          className="text-sm"
        />
        <Button size="sm" variant="outline" className="gap-1.5 w-full" disabled={replyLoading || !clientMsg.trim()} onClick={handleReply}>
          {replyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquareReply className="w-4 h-4" />}
          {replyLoading ? "Gerando com IA..." : "Gerar resposta"}
        </Button>
        {replyMsg && (
          <div className="bg-green-50 rounded-md p-3 text-sm text-green-900 space-y-2">
            <p className="whitespace-pre-wrap">{replyMsg}</p>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handleCopy(replyMsg)}>
              <Copy className="w-3.5 h-3.5" /> Copiar resposta
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
