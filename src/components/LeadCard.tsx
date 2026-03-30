import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Phone,
  ChevronRight,
  ChevronLeft,
  Globe,
  Send,
  Clock,
  Loader2,
} from "lucide-react";
import { getPublicLeadSiteUrl } from "@/lib/public-site-url";
import { KANBAN_COLUMNS, type Lead } from "@/components/KanbanBoard";

const PAYMENT_LABELS: Record<string, string> = {
  pendente: "Pendente",
  pago: "Pago",
};

const SITE_STATUS_LABELS: Record<string, string> = {
  nao_criado: "Não criado",
  criado: "Criado",
  enviado: "Enviado",
  aprovado: "Aprovado",
};

const TEMP_CONFIG: Record<string, { emoji: string; label: string; className: string }> = {
  quente: { emoji: "🔥", label: "Quente", className: "bg-red-100 text-red-700 border-red-200" },
  morno: { emoji: "🌤", label: "Morno", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  frio: { emoji: "❄️", label: "Frio", className: "bg-blue-100 text-blue-700 border-blue-200" },
};

interface Props {
  lead: Lead;
  onSelect: () => void;
  onMove: (dir: "prev" | "next") => void;
  onWhatsApp: () => void;
}

export default function LeadCard({ lead, onSelect, onMove, onWhatsApp }: Props) {
  const queryClient = useQueryClient();
  const [generatingSite, setGeneratingSite] = useState(false);
  const currentIdx = KANBAN_COLUMNS.findIndex((c) => c.id === lead.lead_status);
  const temp = TEMP_CONFIG[lead.lead_temperature] || TEMP_CONFIG.morno;
  const siteExists = lead.site_status !== "nao_criado";

  const handleGenerateSite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setGeneratingSite(true);
    try {
      const { error } = await supabase
        .from("leads")
        .update({
          site_status: "criado",
          lead_status: "interessado",
          last_interaction: new Date().toISOString(),
        } as any)
        .eq("id", lead.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      const url = getPublicLeadSiteUrl(lead.slug);
      await navigator.clipboard.writeText(url);
      toast({
        title: "Site gerado com sucesso!",
        description: "Link copiado para a área de transferência.",
      });
    } catch {
      toast({ title: "Erro ao gerar site", variant: "destructive" });
    } finally {
      setGeneratingSite(false);
    }
  };

  const handleSendProposal = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getPublicLeadSiteUrl(lead.slug);
    const msg = encodeURIComponent(
      `Olá! Sou da equipe Clientes no Google. Preparei uma demonstração do site da ${lead.company_name} para você conferir:\n\n${url}\n\nPosso te explicar como funciona?`
    );
    window.open(`https://wa.me/${lead.phone}?text=${msg}`, "_blank");
  };

  const handleFollowUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Olá! Tudo bem? Estou passando para saber se conseguiu ver a demonstração do site da ${lead.company_name}. Posso te ajudar com algo?`
    );
    window.open(`https://wa.me/${lead.phone}?text=${msg}`, "_blank");
  };

  return (
    <div
      className="bg-card rounded-md border border-border p-3 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-foreground truncate flex-1">
          {lead.company_name}
        </h4>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full border shrink-0 ${temp.className}`}
        >
          {temp.emoji} {temp.label}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-0.5 truncate">
        {lead.niche} · {lead.city}
      </p>

      {/* Badges */}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        {lead.service_value != null && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            R$ {Number(lead.service_value).toLocaleString("pt-BR")}
          </Badge>
        )}
        <Badge
          variant={lead.payment_status === "pago" ? "default" : "secondary"}
          className="text-[10px] px-1.5 py-0"
        >
          {PAYMENT_LABELS[lead.payment_status] || lead.payment_status}
        </Badge>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          {SITE_STATUS_LABELS[lead.site_status] || lead.site_status}
        </Badge>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 text-[10px]"
          onClick={(e) => {
            e.stopPropagation();
            onWhatsApp();
          }}
        >
          <Phone className="w-3 h-3" />
          WhatsApp
        </Button>

        {!siteExists ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-[10px]"
            disabled={generatingSite}
            onClick={handleGenerateSite}
          >
            {generatingSite ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Globe className="w-3 h-3" />
            )}
            Gerar Site
          </Button>
        ) : (
          <a
            href={getPublicLeadSiteUrl(lead.slug)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-[10px] w-full"
            >
              <ExternalLink className="w-3 h-3" />
              Ver Site
            </Button>
          </a>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 text-[10px]"
          onClick={handleSendProposal}
        >
          <Send className="w-3 h-3" />
          Proposta
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50 text-[10px]"
          onClick={handleFollowUp}
        >
          <Clock className="w-3 h-3" />
          Follow-up
        </Button>
      </div>

      {/* Navigation arrows */}
      <div className="flex items-center justify-between mt-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          disabled={currentIdx === 0}
          onClick={(e) => {
            e.stopPropagation();
            onMove("prev");
          }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button>
        <span className="text-[9px] text-muted-foreground">
          {KANBAN_COLUMNS[currentIdx]?.label}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          disabled={currentIdx === KANBAN_COLUMNS.length - 1}
          onClick={(e) => {
            e.stopPropagation();
            onMove("next");
          }}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
