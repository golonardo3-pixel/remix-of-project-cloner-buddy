import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, Play, Square, MessageSquare, CheckCircle2, AlertCircle,
  ShieldAlert, Info, Eye, Send, Copy, History, Layers, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { Lead } from "@/components/KanbanBoard";
import VariableChips, { DISPATCH_VARIABLES, validateTemplate } from "@/components/dispatch/VariableChips";
import { resolveSpintax, resetSpintaxMemory } from "@/lib/spintax";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import GoogleSheetsImport from "@/components/dispatch/GoogleSheetsImport";
import { CONVERSATION_STAGES, getRandomTemplate } from "@/lib/conversation-flows";
import { getMessageHistory, addToMessageHistory, clearMessageHistory, type MessageHistoryEntry } from "@/lib/message-history";
import { pickFollowup, PREMIUM_OPENINGS, getNicheTone } from "@/lib/premium-prospecting";

type DispatchStatus = "idle" | "running" | "done";

interface LogEntry {
  leadId: string;
  name: string;
  phone: string;
  status: "sent" | "error" | "skipped";
  time: string;
  message?: string;
}

// --- Anti-ban config ---
const DAILY_LIMIT_MIN = 140;
const DAILY_LIMIT_MAX = 160;
const MAX_LEADS_PER_ROUND = 160;
const MIN_CLICK_INTERVAL_SEC = 30;
const MAX_CLICK_INTERVAL_SEC = 90;

const DAILY_KEY = "dispatch_daily_count";
const DAILY_DATE_KEY = "dispatch_daily_date";
const INVALID_CITY_VALUES = ["não informada", "não informado", "n/a", "sem dados"];
const PHONE_LIKE_PATTERN = /(?:\+?\d[\d\s().-]{7,}\d)/g;

function getDailyCount(): number {
  const today = new Date().toDateString();
  const saved = localStorage.getItem(DAILY_DATE_KEY);
  if (saved !== today) {
    localStorage.setItem(DAILY_DATE_KEY, today);
    localStorage.setItem(DAILY_KEY, "0");
    return 0;
  }
  return parseInt(localStorage.getItem(DAILY_KEY) || "0", 10);
}

function incrementDailyCount() {
  const count = getDailyCount() + 1;
  localStorage.setItem(DAILY_KEY, String(count));
  return count;
}

function getDailyLimit(): number {
  const key = "dispatch_daily_limit";
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("dispatch_daily_limit_date");
  if (savedDate === today) {
    return parseInt(localStorage.getItem(key) || "150", 10);
  }
  const limit = DAILY_LIMIT_MIN + Math.floor(Math.random() * (DAILY_LIMIT_MAX - DAILY_LIMIT_MIN + 1));
  localStorage.setItem(key, String(limit));
  localStorage.setItem("dispatch_daily_limit_date", today);
  return limit;
}

/** Random cooldown between MIN and MAX to simulate human timing */
function getRandomCooldown(): number {
  return MIN_CLICK_INTERVAL_SEC + Math.floor(Math.random() * (MAX_CLICK_INTERVAL_SEC - MIN_CLICK_INTERVAL_SEC + 1));
}

const DEFAULT_MESSAGE =
  "{Oi|Olá|Fala|E aí|Tudo bem|Bom dia|Boa tarde}, tudo {bem|certo|tranquilo}?\n\n{Vi|Dei uma olhada em|Analisei rapidamente|Passei pelo} {seu perfil|seu negócio|sua empresa} no Google {hoje|agora pouco|esses dias|recentemente} e {me chamou atenção|achei interessante|curti|notei algumas coisas}.\n\n{Acho que dá pra melhorar algumas coisas|Percebi algumas oportunidades simples|Notei alguns pontos que podem melhorar} {no perfil de vocês|por aí}.\n\n{Posso te mostrar rapidinho?|Quer que eu te explique?|Te mostro em 1 minuto?}";

const FALLBACKS: Record<string, string> = {};
DISPATCH_VARIABLES.forEach((v) => {
  FALLBACKS[v.key] = v.fallback;
});

function sanitizeText(value?: string | null): string {
  return (value ?? "")
    .replace(PHONE_LIKE_PATTERN, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeCompanyName(value?: string | null): string {
  const base = (value ?? "").split(",")[0] ?? "";
  return sanitizeText(base);
}

function normalizeMessage(text: string): string {
  return text
    .replace(PHONE_LIKE_PATTERN, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/^[ \t]+/gm, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
}

function buildMessageForLead(template: string, lead: Lead, previousMessage?: string): string {
  const companyName = sanitizeCompanyName(lead.company_name) || FALLBACKS["{empresa}"];
  const cityName = sanitizeText(lead.city);
  const nicheName = sanitizeText(lead.niche);
  const cityValid = Boolean(cityName) && !INVALID_CITY_VALUES.includes(cityName.toLowerCase());

  const values: Record<string, string> = {
    "{nome}": companyName || FALLBACKS["{nome}"],
    "{empresa}": companyName,
    "{link}": "",
    "{cidade}": cityValid ? cityName : "",
    "{nicho}": nicheName || FALLBACKS["{nicho}"],
  };

  let interpolated = template
    .replace(/\{telefone\}/gi, "")
    .replace(/\{link\}/gi, "")
    .trim();

  if (!cityValid) {
    interpolated = interpolated.replace(/\s*em\s*\{cidade\}/gi, "");
  }

  for (const [key, val] of Object.entries(values)) {
    interpolated = interpolated.replace(new RegExp(key.replace(/[{}]/g, "\\$&"), "gi"), val);
  }

  const hasSpintax = /\{[^{}]*\|[^{}]*\}/.test(interpolated);
  let result = normalizeMessage(resolveSpintax(interpolated));
  let attempts = 0;

  // Try up to 10 times to avoid repeating the previous message
  while (hasSpintax && previousMessage && result === previousMessage && attempts < 10) {
    resetSpintaxMemory();
    result = normalizeMessage(resolveSpintax(interpolated));
    attempts += 1;
  }

  return result;
}

function buildMessageSequence(template: string, leads: Lead[]): string[] {
  let previousMessage = "";
  return leads.map((lead) => {
    const nextMessage = buildMessageForLead(template, lead, previousMessage);
    previousMessage = nextMessage;
    return nextMessage;
  });
}

/**
 * Modo Premium: cada lead recebe uma das 8 aberturas adaptadas ao nicho dele.
 * Evita repetir os últimos 3 templates escolhidos (dedupe entre leads próximos).
 */
function buildPremiumSequence(leads: Lead[]): string[] {
  const recentRaw: string[] = [];
  return leads.map((lead) => {
    const rawTemplate = pickRawOpening(lead.niche, recentRaw);
    recentRaw.push(rawTemplate);
    if (recentRaw.length > 3) recentRaw.shift();
    // Aplica spintax + interpolação como template normal
    return buildMessageForLead(rawTemplate, lead);
  });
}

/** Escolhe o template cru (com placeholders nicho_*) já adaptado ao tom do nicho. */
function pickRawOpening(niche: string, recentRaw: string[]): string {
  const available = PREMIUM_OPENINGS.filter((t) => !recentRaw.includes(t));
  const pool = available.length > 0 ? available : PREMIUM_OPENINGS;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  const tone = getNicheTone(niche);
  return chosen
    .replace(/\{nicho_noun\}/g, tone.noun)
    .replace(/\{nicho_action\}/g, tone.customerAction)
    .replace(/\{nicho_hook\}/g, tone.hook.replace(/\{nicho\}/g, niche || "negócios"));
}

const MessageDispatch = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [status, setStatus] = useState<DispatchStatus>("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [cooldown, setCooldown] = useState(0);
  const [previewMessages, setPreviewMessages] = useState<string[]>([]);
  const [queueMessages, setQueueMessages] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<MessageHistoryEntry[]>(() => getMessageHistory());
  const [showStages, setShowStages] = useState(false);

  const dailyCount = getDailyCount();
  const dailyLimit = getDailyLimit();
  const remainingToday = Math.max(0, dailyLimit - dailyCount);

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

  const eligibleLeads = (leads?.filter((l) => l.lead_status === "novo") ?? [])
    .slice(0, Math.min(MAX_LEADS_PER_ROUND, remainingToday));

  const templateWarnings = validateTemplate(message);

  const antiBanWarnings: string[] = [];
  if (/https?:\/\/|www\.|\.com|\.br|\{link\}/i.test(message)) {
    antiBanWarnings.push("⚠️ Evite links na primeira mensagem — risco de ban no WhatsApp");
  }

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

  const handleUseStage = (stageId: string) => {
    const template = getRandomTemplate(stageId);
    setMessage(template);
    setShowStages(false);
    toast({ title: "Template aplicado!" });
  };

  const handleAppendStage = (stageId: string) => {
    const template = getRandomTemplate(stageId);
    setMessage((prev) => (prev ? prev + "\n\n" + template : template));
    toast({ title: "Etapa adicionada!" });
  };

  const handleCopyMessage = () => {
    const sampleLead = eligibleLeads[0] ?? ({
      company_name: "Negócio Teste",
      phone: "11999999999",
      city: "São Paulo",
      niche: "serviços",
    } as Lead);
    const resolved = buildMessageForLead(message, sampleLead);
    navigator.clipboard.writeText(resolved);
    toast({ title: "Mensagem copiada!" });
  };

  const handleStartQueue = () => {
    if (templateWarnings.length > 0) {
      toast({
        title: "Corrija as variáveis antes de disparar",
        description: templateWarnings.join(", "),
        variant: "destructive",
      });
      return;
    }
    if (remainingToday <= 0) {
      toast({
        title: "Limite diário atingido",
        description: `Você já enviou ${dailyCount} mensagens hoje. Limite: ${dailyLimit}. Tente novamente amanhã.`,
        variant: "destructive",
      });
      return;
    }
    setStatus("running");
    setCurrentIndex(0);
    setLog([]);
    setCooldown(0);
    resetSpintaxMemory();
    setQueueMessages(buildMessageSequence(message, eligibleLeads));
  };

  const handleSendCurrent = async () => {
    if (currentIndex >= eligibleLeads.length) return;
    if (cooldown > 0) return;

    const lead = eligibleLeads[currentIndex];
    const text = queueMessages[currentIndex] ?? buildMessageForLead(message, lead, queueMessages[currentIndex - 1]);
    const safeLeadName = sanitizeCompanyName(lead.company_name) || "Lead sem nome";

    window.open(buildWhatsAppUrl(lead.phone, text), "_blank", "noopener,noreferrer");

    // Save to history
    addToMessageHistory({
      text,
      leadName: safeLeadName,
      timestamp: new Date().toISOString(),
    });
    setHistory(getMessageHistory());

    try {
      incrementDailyCount();
      await supabase
        .from("leads")
        .update({ lead_status: "respondeu", last_interaction: new Date().toISOString() } as any)
        .eq("id", lead.id);

      setLog((prev) => [
        ...prev,
        { leadId: lead.id, name: safeLeadName, phone: lead.phone, status: "sent", time: new Date().toLocaleTimeString(), message: text },
      ]);
    } catch {
      setLog((prev) => [
        ...prev,
        { leadId: lead.id, name: safeLeadName, phone: lead.phone, status: "error", time: new Date().toLocaleTimeString() },
      ]);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= eligibleLeads.length) {
      setStatus("done");
      setCurrentIndex(nextIndex);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: "Disparo finalizado!", description: `${log.length + 1} mensagens enviadas.` });
      return;
    }

    setCurrentIndex(nextIndex);

    // Random cooldown between 30-90s for human-like behavior
    const cd = getRandomCooldown();
    setCooldown(cd);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSkipCurrent = () => {
    if (currentIndex >= eligibleLeads.length) return;
    const lead = eligibleLeads[currentIndex];
    const safeLeadName = sanitizeCompanyName(lead.company_name) || "Lead sem nome";
    setLog((prev) => [
      ...prev,
      { leadId: lead.id, name: safeLeadName, phone: lead.phone, status: "skipped", time: new Date().toLocaleTimeString() },
    ]);
    const nextIndex = currentIndex + 1;
    if (nextIndex >= eligibleLeads.length) {
      setStatus("done");
      setCurrentIndex(nextIndex);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      return;
    }
    setCurrentIndex(nextIndex);
  };

  const stopDispatch = () => {
    setStatus("idle");
    setCooldown(0);
    setQueueMessages([]);
    toast({ title: "Disparo interrompido" });
  };

  const handleCopyCurrentPreview = () => {
    if (currentPreview) {
      navigator.clipboard.writeText(currentPreview);
      toast({ title: "Mensagem copiada!" });
    }
  };

  const handleClearHistory = () => {
    clearMessageHistory();
    setHistory([]);
    toast({ title: "Histórico limpo!" });
  };

  const sentCount = log.filter((l) => l.status === "sent").length;
  const progress = eligibleLeads.length > 0 ? Math.round((sentCount / eligibleLeads.length) * 100) : 0;
  const currentLead = status === "running" && currentIndex < eligibleLeads.length ? eligibleLeads[currentIndex] : null;
  const currentPreview = currentLead ? queueMessages[currentIndex] ?? null : null;

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
              {eligibleLeads.length} leads · {remainingToday} restantes hoje (limite: {dailyLimit})
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Anti-ban tips */}
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Proteção anti-bloqueio ativa</p>
                <ul className="text-[11px] text-muted-foreground space-y-0.5">
                  <li>• Cada envio exige seu clique (simula comportamento humano)</li>
                  <li>• Intervalo variável de {MIN_CLICK_INTERVAL_SEC}s a {MAX_CLICK_INTERVAL_SEC}s entre envios</li>
                  <li>• Limite diário: {dailyLimit} msgs ({dailyCount} enviadas hoje)</li>
                  <li>• Variação automática de texto a cada envio</li>
                  <li>• Alternância entre mensagens curtas e médias</li>
                  <li>• Nunca repete mensagem consecutiva</li>
                  <li>• Links bloqueados na 1ª mensagem</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily limit warnings */}
        {remainingToday <= 10 && remainingToday > 0 && (
          <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Restam apenas {remainingToday} mensagens no limite diário.
              </p>
            </CardContent>
          </Card>
        )}

        {remainingToday <= 0 && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Limite diário atingido ({dailyLimit} mensagens). Tente novamente amanhã.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Conversation flow stages */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4" /> Fluxo de Conversa
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={() => setShowStages(!showStages)}
              >
                {showStages ? "Fechar" : "Ver etapas"}
              </Button>
            </div>
          </CardHeader>
          {showStages && (
            <CardContent className="pt-0 space-y-2">
              {CONVERSATION_STAGES.map((stage) => (
                <div key={stage.id} className="bg-muted/50 border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-xs font-semibold text-foreground">{stage.label}</span>
                      <span className="text-[10px] text-muted-foreground ml-2">{stage.description}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] px-2"
                        onClick={() => handleAppendStage(stage.id)}
                        disabled={status === "running"}
                      >
                        + Adicionar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 text-[10px] px-2"
                        onClick={() => handleUseStage(stage.id)}
                        disabled={status === "running"}
                      >
                        Usar só esta
                      </Button>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed whitespace-pre-line mt-1">
                    {stage.templates[0].substring(0, 120)}...
                  </p>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Message config */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Mensagem (com variação automática)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                disabled={status === "running"}
                placeholder="Use {opção1|opção2} para variar automaticamente..."
              />
              <p className="text-[10px] text-muted-foreground">
                💡 Use <code className="bg-muted px-1 rounded">{"{Oi|Olá|Fala}"}</code> para variar saudações automaticamente. Nunca repete a mesma mensagem consecutiva.
              </p>
              {templateWarnings.length > 0 && (
                <div className="flex items-start gap-2 text-xs text-destructive">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{templateWarnings.join(", ")}</span>
                </div>
              )}
              {antiBanWarnings.length > 0 && (
                <div className="space-y-1">
                  {antiBanWarnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-orange-600 dark:text-orange-400">
                      <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <VariableChips onInsert={insertVariable} disabled={status === "running"} />

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                disabled={status === "running"}
                onClick={() => {
                  const sampleLead = eligibleLeads[0] ?? ({ company_name: "Barbearia Teste", phone: "11999999999", city: "São Paulo", niche: "barbearia" } as Lead);
                  const previews = buildMessageSequence(message, Array.from({ length: 5 }, () => sampleLead));
                  setPreviewMessages(previews);
                }}
              >
                <Eye className="w-3.5 h-3.5" />
                Preview 5 variações
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                disabled={status === "running"}
                onClick={handleCopyMessage}
              >
                <Copy className="w-3.5 h-3.5" />
                Copiar mensagem
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="w-3.5 h-3.5" />
                Histórico ({history.length})
              </Button>
            </div>

            {/* Preview */}
            {previewMessages.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-muted-foreground">Variações geradas (cada envio será diferente):</p>
                {previewMessages.map((msg, i) => (
                  <div key={i} className="text-xs bg-muted/60 rounded-md p-2 border border-border whitespace-pre-line">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-muted-foreground">#{i + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 px-1.5 text-[10px]"
                        onClick={() => {
                          navigator.clipboard.writeText(msg);
                          toast({ title: "Variação copiada!" });
                        }}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-foreground">{msg}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message History */}
        {showHistory && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="w-4 h-4" /> Histórico de mensagens
                </CardTitle>
                {history.length > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs text-destructive gap-1" onClick={handleClearHistory}>
                    <Trash2 className="w-3 h-3" /> Limpar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Nenhuma mensagem enviada ainda.</p>
              ) : (
                <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                  {history.slice(0, 20).map((entry) => (
                    <div key={entry.id} className="bg-muted/50 rounded-lg p-2.5 border border-border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold text-muted-foreground">{entry.leadName}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-1"
                            onClick={() => {
                              navigator.clipboard.writeText(entry.text);
                              toast({ title: "Copiada!" });
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-[11px] text-foreground whitespace-pre-line leading-relaxed">{entry.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Google Sheets import */}
        <GoogleSheetsImport />

        {/* Start queue */}
        {status === "idle" && (
          <Button
            onClick={handleStartQueue}
            disabled={eligibleLeads.length === 0 || remainingToday <= 0}
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 w-full"
          >
            <Play className="w-4 h-4" />
            Iniciar Fila de Envio ({eligibleLeads.length} leads)
          </Button>
        )}

        {/* Current lead to send */}
        {status === "running" && currentLead && (
          <Card className="border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/20">
            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{currentLead.company_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentLead.niche} · {currentLead.city} · Lead {currentIndex + 1} de {eligibleLeads.length}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={stopDispatch} className="text-xs text-destructive">
                  <Square className="w-3.5 h-3.5 mr-1" /> Parar
                </Button>
              </div>

              {/* Message preview */}
              <div className="bg-muted/60 rounded-lg p-3 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground font-medium">Mensagem que será enviada:</p>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1" onClick={handleCopyCurrentPreview}>
                    <Copy className="w-3 h-3" /> Copiar
                  </Button>
                </div>
                <p className="text-sm text-foreground whitespace-pre-line">{currentPreview}</p>
              </div>

              {cooldown > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />
                  <span>Aguardando {cooldown}s para simular comportamento humano...</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleSendCurrent}
                  disabled={cooldown > 0}
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white flex-1"
                >
                  <Send className="w-4 h-4" />
                  {cooldown > 0 ? `Aguarde ${cooldown}s` : "Enviar no WhatsApp"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleSkipCurrent} className="text-xs">
                  Pular
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress */}
        {(status === "running" || status === "done") && (
          <Card>
            <CardContent className="pt-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">{sentCount}/{eligibleLeads.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
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
                  <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                    <div className="flex items-center gap-2 min-w-0">
                      {entry.status === "sent" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      ) : entry.status === "skipped" ? (
                        <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                      )}
                      <span className="truncate text-xs">
                        {entry.name}
                        {entry.status === "skipped" && " (pulado)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {entry.message && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-1"
                          onClick={() => {
                            navigator.clipboard.writeText(entry.message!);
                            toast({ title: "Copiada!" });
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground">{entry.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {status === "done" && (
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="pt-4 pb-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Disparo finalizado!</p>
              <p className="text-xs text-muted-foreground">{sentCount} mensagens enviadas · {getDailyCount()}/{dailyLimit} hoje</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => { setStatus("idle"); setLog([]); }}>
                Novo disparo
              </Button>
            </CardContent>
          </Card>
        )}

        {eligibleLeads.length === 0 && remainingToday > 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum lead disponível para disparo.
          </div>
        )}
      </main>
    </div>
  );
};

export default MessageDispatch;
