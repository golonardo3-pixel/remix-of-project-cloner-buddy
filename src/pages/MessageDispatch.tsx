import { useState, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Play, Square, MessageSquare, Clock, CheckCircle2, AlertCircle, ShieldAlert, Info, Pause, Coffee, Eye } from "lucide-react";
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
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import GoogleSheetsImport from "@/components/dispatch/GoogleSheetsImport";

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
const MIN_CLICK_INTERVAL_SEC = 25;

const DAILY_KEY = "dispatch_daily_count";
const DAILY_DATE_KEY = "dispatch_daily_date";

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

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

  const progress =
    eligibleLeads.length > 0
      ? Math.round((log.filter(l => l.status === "sent").length / eligibleLeads.length) * 100)
      : 0;

  const sentCount = log.filter(l => l.status === "sent").length;

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
                <p className="text-sm font-medium text-foreground">Proteção anti-ban ativa</p>
                <ul className="text-[11px] text-muted-foreground space-y-0.5">
                  <li>• Lotes de {BATCH_SIZE} contatos com pausa de {BATCH_PAUSE_MIN_SEC/60}–{BATCH_PAUSE_MAX_SEC/60} min</li>
                  <li>• Delay aleatório de {MSG_DELAY_MIN_SEC}–{MSG_DELAY_MAX_SEC}s entre mensagens</li>
                  <li>• Pausa de {BIG_PAUSE_MIN_SEC/60}–{BIG_PAUSE_MAX_SEC/60} min a cada {BIG_PAUSE_EVERY} envios</li>
                  <li>• Limite diário: {dailyLimit} msgs ({dailyCount} enviadas hoje)</li>
                  <li>• Variação automática de saudação e texto</li>
                  <li>• Links bloqueados na 1ª mensagem</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily limit warning */}
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
                rows={5}
                disabled={status === "running"}
                placeholder="Use {opção1|opção2} para variar automaticamente..."
              />
              <p className="text-[10px] text-muted-foreground">
                💡 Use <code className="bg-muted px-1 rounded">{"{Oi|Olá|Fala}"}</code> para variar saudações automaticamente
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

            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={status === "running"}
                onClick={() => {
                  const sampleLeads = eligibleLeads.length > 0
                    ? eligibleLeads.slice(0, 5)
                    : [{ company_name: "Barbearia Teste", phone: "11999999999", city: "São Paulo", niche: "barbearia" } as Lead];
                  const previews = sampleLeads.map((lead) => buildMessageForLead(message, lead));
                  setPreviewMessages(previews);
                }}
              >
                <Eye className="w-3.5 h-3.5" />
                Pré-visualizar 5 variações
              </Button>
              {previewMessages.length > 0 && (
                <div className="space-y-1.5">
                  {previewMessages.map((msg, i) => (
                    <div key={i} className="text-xs bg-muted/60 rounded-md p-2 border border-border">
                      <span className="font-medium text-muted-foreground">#{i + 1}:</span>{" "}
                      <span className="text-foreground">{msg}</span>
                    </div>
                  ))}
                </div>
              )}
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
              disabled={eligibleLeads.length === 0 || remainingToday <= 0}
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 flex-1"
            >
              <Play className="w-4 h-4" />
              Iniciar Disparo ({eligibleLeads.length} leads)
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

        {/* Countdown */}
        {countdown > 0 && (
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-3">
                <Coffee className="w-5 h-5 text-blue-500 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-foreground">{countdownLabel}</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatDuration(countdown)}</p>
                </div>
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
                <span className="font-medium">
                  {sentCount}/{eligibleLeads.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              {status === "running" && countdown === 0 && (
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
                    className={`flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0 ${entry.status === "pause" ? "bg-muted/30" : ""}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {entry.status === "sent" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      ) : entry.status === "pause" ? (
                        <Pause className="w-4 h-4 text-blue-500 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                      )}
                      <span className="truncate text-xs">
                        {entry.message || entry.name}
                      </span>
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
