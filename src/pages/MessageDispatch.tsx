import { useState, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Play, Square, MessageSquare, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { Lead } from "@/components/KanbanBoard";
import VariableChips, { DISPATCH_VARIABLES, validateTemplate } from "@/components/dispatch/VariableChips";
import { resolveSpintax } from "@/lib/spintax";
import GoogleSheetsImport from "@/components/dispatch/GoogleSheetsImport";

type DispatchStatus = "idle" | "running" | "paused" | "done";

interface LogEntry {
  leadId: string;
  name: string;
  phone: string;
  status: "sent" | "error";
  time: string;
}

const MAX_LEADS_PER_ROUND = 20;
const MIN_INTERVAL_SEC = 60;

const DEFAULT_MESSAGE =
  "{Oi|Olá} {nome}, {tudo bem|tudo certo}? Vi seu negócio em {cidade} e {achei interessante|me chamou atenção}. {Posso te mostrar uma ideia rápida?|Te explico em 1 minuto?}";

const FALLBACKS: Record<string, string> = {};
DISPATCH_VARIABLES.forEach((v) => {
  FALLBACKS[v.key] = v.fallback;
});

function buildMessageForLead(template: string, lead: Lead): string {
  const values: Record<string, string> = {
    "{nome}": lead.company_name || FALLBACKS["{nome}"],
    "{empresa}": lead.company_name || FALLBACKS["{empresa}"],
    "{telefone}": lead.phone || FALLBACKS["{telefone}"],
    "{link}": "",
    "{cidade}": lead.city || FALLBACKS["{cidade}"],
    "{nicho}": lead.niche || FALLBACKS["{nicho}"],
  };

  // Strip any {link} from dispatch messages (safety rule)
  let result = template.replace(/\{link\}/gi, "").replace(/\s{2,}/g, " ").trim();
  for (const [key, val] of Object.entries(values)) {
    result = result.replace(new RegExp(key.replace(/[{}]/g, "\\$&"), "gi"), val);
  }
  return resolveSpintax(result);
}

const MessageDispatch = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [interval, setIntervalSec] = useState(MIN_INTERVAL_SEC);
  const [status, setStatus] = useState<DispatchStatus>("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);

  const abortRef = useRef(false);
  const runningRef = useRef(false);

  const { data: leads } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Lead[];
    },
  });

  const eligibleLeads = (leads?.filter((l) => l.lead_status === "novo") ?? []).slice(0, MAX_LEADS_PER_ROUND);

  const templateWarnings = validateTemplate(message);

  const insertVariable = (variable: string) => {
    const ta = textareaRef.current;
    if (!ta) {
      setMessage((prev) => prev + variable);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = message.slice(0, start);
    const after = message.slice(end);
    const newMsg = before + variable + after;
    setMessage(newMsg);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + variable.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  const openWhatsApp = (phone: string, text: string) => {
    const clean = phone.replace(/\D/g, "");
    const num = clean.startsWith("55") ? clean : `55${clean}`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const startDispatch = useCallback(async () => {
    if (runningRef.current) return;

    if (templateWarnings.length > 0) {
      toast({
        title: "Corrija as variáveis antes de disparar",
        description: templateWarnings.join(", "),
        variant: "destructive",
      });
      return;
    }

    runningRef.current = true;
    abortRef.current = false;
    setStatus("running");
    setLog([]);
    setCurrentIndex(0);

    for (let i = 0; i < eligibleLeads.length; i++) {
      if (abortRef.current) break;
      setCurrentIndex(i);

      const lead = eligibleLeads[i];
      const text = buildMessageForLead(message, lead);

      try {
        openWhatsApp(lead.phone, text);
        await supabase
          .from("leads")
          .update({ lead_status: "respondeu", last_interaction: new Date().toISOString() } as any)
          .eq("id", lead.id);

        setLog((prev) => [
          ...prev,
          { leadId: lead.id, name: lead.company_name, phone: lead.phone, status: "sent", time: new Date().toLocaleTimeString() },
        ]);
      } catch {
        setLog((prev) => [
          ...prev,
          { leadId: lead.id, name: lead.company_name, phone: lead.phone, status: "error", time: new Date().toLocaleTimeString() },
        ]);
      }

      if (i < eligibleLeads.length - 1 && !abortRef.current) {
        await sleep(interval * 1000);
      }
    }

    runningRef.current = false;
    setStatus("done");
    queryClient.invalidateQueries({ queryKey: ["leads"] });
    toast({ title: "Disparo finalizado!" });
  }, [eligibleLeads, message, interval, queryClient, templateWarnings]);

  const stopDispatch = () => {
    abortRef.current = true;
    runningRef.current = false;
    setStatus("idle");
    toast({ title: "Disparo interrompido" });
  };

  const progress =
    eligibleLeads.length > 0
      ? Math.round((log.length / eligibleLeads.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/crm")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-lg font-semibold text-foreground">
              Disparo de <span className="text-accent">Mensagens</span>
            </h1>
            <p className="text-muted-foreground text-xs">
              {eligibleLeads.length} leads disponíveis
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Message config */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Mensagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                disabled={status === "running"}
                placeholder="Digite sua mensagem..."
              />
              {templateWarnings.length > 0 && (
                <div className="flex items-start gap-2 text-xs text-destructive">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{templateWarnings.join(", ")}</span>
                </div>
              )}
            </div>

            <VariableChips onInsert={insertVariable} disabled={status === "running"} />

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" /> Intervalo (segundos)
              </Label>
              <Input
                type="number"
                min={MIN_INTERVAL_SEC}
                max={300}
                value={interval}
                onChange={(e) => setIntervalSec(Math.max(MIN_INTERVAL_SEC, Number(e.target.value)))}
                disabled={status === "running"}
                className="w-32"
              />
              <p className="text-[10px] text-muted-foreground">Mínimo {MIN_INTERVAL_SEC}s · Máximo {MAX_LEADS_PER_ROUND} leads por rodada · Links bloqueados</p>
            </div>
          </CardContent>
        </Card>

        {/* Google Sheets import */}
        <GoogleSheetsImport />

        {/* Actions */}
        <div className="flex gap-3">
          {status !== "running" ? (
            <Button
              onClick={startDispatch}
              disabled={eligibleLeads.length === 0}
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 flex-1"
            >
              <Play className="w-4 h-4" />
              Iniciar Disparo ({eligibleLeads.length})
            </Button>
          ) : (
            <Button
              onClick={stopDispatch}
              variant="destructive"
              className="gap-2 flex-1"
            >
              <Square className="w-4 h-4" />
              Parar
            </Button>
          )}
        </div>

        {/* Progress */}
        {(status === "running" || status === "done") && (
          <Card>
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">
                  {log.length}/{eligibleLeads.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              {status === "running" && (
                <p className="text-xs text-muted-foreground animate-pulse">
                  Enviando para: {eligibleLeads[currentIndex]?.company_name}...
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Log */}
        {log.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Registro de envio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                {log.map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {entry.status === "sent" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                      )}
                      <span className="truncate">{entry.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {entry.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {eligibleLeads.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum lead disponível para disparo.
          </div>
        )}
      </main>
    </div>
  );
};

export default MessageDispatch;
