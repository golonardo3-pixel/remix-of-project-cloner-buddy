import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ExternalLink,
  Phone,
  ChevronRight,
  ChevronLeft,
  Globe,
  Send,
  Clock,
  Loader2,
  Rocket,
  Pencil,
  Copy,
} from "lucide-react";
import { getPublicLeadSiteUrl } from "@/lib/public-site-url";
import { KANBAN_COLUMNS, type Lead } from "@/components/KanbanBoard";

const TEMP_CONFIG: Record<string, { emoji: string; label: string; className: string }> = {
  quente: { emoji: "🔥", label: "Quente", className: "bg-red-100 text-red-700 border-red-200" },
  morno: { emoji: "🌤", label: "Morno", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  frio: { emoji: "❄️", label: "Frio", className: "bg-blue-100 text-blue-700 border-blue-200" },
};

interface Props {
  lead: Lead;
  selected: boolean;
  onToggleSelect: () => void;
  onSelect: () => void;
  onMove: (dir: "prev" | "next") => void;
  onWhatsApp: () => void;
}

export default function LeadCard({ lead, selected, onToggleSelect, onSelect, onMove, onWhatsApp }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [generatingSite, setGeneratingSite] = useState(false);
  const currentIdx = KANBAN_COLUMNS.findIndex((c) => c.id === lead.lead_status);
  const temp = TEMP_CONFIG[lead.lead_temperature] || TEMP_CONFIG.morno;
  const siteExists = lead.site_status !== "nao_criado";
  const isPublished = lead.site_status === "publicado";

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

  const handlePublishSite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from("leads")
        .update({
          site_status: "publicado",
          last_interaction: new Date().toISOString(),
        } as any)
        .eq("id", lead.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      const url = getPublicLeadSiteUrl(lead.slug);
      await navigator.clipboard.writeText(url);
      toast({
        title: "Site publicado!",
        description: "Link final copiado para a área de transferência.",
      });
    } catch {
      toast({ title: "Erro ao publicar site", variant: "destructive" });
    }
  };

  const proposalMessages = [
    `Oi, tudo bem? 😊\n\nSou o Hugo aqui de Campinas.\n\nVi seu negócio no Google e notei que vocês já atendem bem, mas pode dar pra receber mais chamados direto no WhatsApp.\n\nMontei um modelo simples pra você ver como ficaria, quer que eu te mostre?`,
    `Oi! Tudo certo? 😊\n\nMe chamo Hugo, sou aqui de Campinas.\n\nEstava pesquisando no Google e encontrei a ${lead.company_name}. Vi que vocês têm ótimas avaliações!\n\nFiz uma página rápida que pode ajudar a trazer mais clientes pelo WhatsApp. Posso te mandar o link pra dar uma olhada?`,
    `Olá! Tudo bem? 😊\n\nAqui é o Hugo, de Campinas.\n\nEncontrei a ${lead.company_name} no Google e achei o trabalho de vocês muito bom.\n\nTenho uma ideia simples que pode ajudar a receber mais contatos. Posso te mostrar rapidinho?`,
    `Oi! 😊\n\nSou o Hugo, aqui de Campinas.\n\nVi a ${lead.company_name} no Google e percebi que vocês são bem avaliados na região.\n\nCriei um modelo de página que pode facilitar o contato dos clientes com vocês. Quer dar uma olhada?`,
    `E aí, tudo bem? 😊\n\nHugo aqui, de Campinas.\n\nVi a ${lead.company_name} no Google e curti bastante. Vocês têm uma boa reputação!\n\nFiz algo simples que pode ajudar a trazer mais movimento. Te mando pra você ver?`,
    `Oi, tudo certo? 😊\n\nMe chamo Hugo, sou de Campinas.\n\nPesquisando aqui na região encontrei a ${lead.company_name} e vi que o pessoal fala muito bem de vocês.\n\nMontei uma coisa rápida que acho que pode te interessar. Posso compartilhar?`,
  ];

  const followUpMessages = [
    `Oi! Tudo bem? 😊\n\nHugo aqui. Te mandei uma mensagem uns dias atrás sobre a ${lead.company_name}.\n\nConseguiu dar uma olhada? Se quiser posso te explicar rapidinho como funciona.`,
    `E aí, tudo certo? 😊\n\nSou o Hugo, te mandei uma mensagem recentemente.\n\nSó passando pra saber se viu aquele modelo que fiz pra ${lead.company_name}. Quer que eu te mostre?`,
    `Oi! Hugo aqui 😊\n\nTe escrevi uns dias atrás sobre algo que montei pra ${lead.company_name}.\n\nAinda tem interesse em dar uma olhada? É rapidinho!`,
  ];

  const handleSendProposal = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getPublicLeadSiteUrl(lead.slug);
    const template = proposalMessages[Math.floor(Math.random() * proposalMessages.length)];
    const msg = encodeURIComponent(template);
    window.open(`https://wa.me/${lead.phone}?text=${msg}`, "_blank");
  };

  const handleFollowUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const template = followUpMessages[Math.floor(Math.random() * followUpMessages.length)];
    const msg = encodeURIComponent(template);
    window.open(`https://wa.me/${lead.phone}?text=${msg}`, "_blank");
  };

  const handleEditSite = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/crm/editor/${lead.id}`);
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newSlug = `${lead.slug}-v${Date.now().toString(36)}`;
      const { error } = await supabase.from("leads").insert({
        company_name: `${lead.company_name} (cópia)`,
        niche: lead.niche,
        city: lead.city,
        phone: lead.phone,
        slug: newSlug,
        site_status: lead.site_status,
        lead_status: lead.lead_status,
        lead_temperature: lead.lead_temperature,
        services_list: lead.services_list,
        description: lead.description,
        google_maps_url: lead.google_maps_url,
        instagram: lead.instagram,
        site_content: lead.site_content,
      } as any);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: "Lead duplicado com sucesso!" });
    } catch {
      toast({ title: "Erro ao duplicar", variant: "destructive" });
    }
  };

  return (
    <div
      className={`bg-card rounded-lg border p-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.98] ${
        selected ? "border-accent ring-2 ring-accent/30" : "border-border"
      }`}
      onClick={onSelect}
    >
      {/* Header with checkbox */}
      <div className="flex items-start gap-2">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggleSelect()}
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5 shrink-0"
        />
        <div className="flex-1 min-w-0">
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
        </div>
      </div>

      {/* Status badges */}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        {lead.service_value != null && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            R$ {Number(lead.service_value).toLocaleString("pt-BR")}
          </Badge>
        )}
        {isPublished && (
          <Badge className="text-[10px] px-1.5 py-0 bg-green-600 text-white">
            ✓ Publicado
          </Badge>
        )}
        {siteExists && !isPublished && (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            Site criado
          </Badge>
        )}
      </div>

      {/* Action buttons — bigger for mobile */}
      <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 gap-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 text-xs font-medium"
          onClick={(e) => {
            e.stopPropagation();
            onWhatsApp();
          }}
        >
          <Phone className="w-4 h-4" />
          WhatsApp
        </Button>

        {!siteExists ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-2 gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs font-medium"
            disabled={generatingSite}
            onClick={handleGenerateSite}
          >
            {generatingSite ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
            Gerar Site
          </Button>
        ) : !isPublished ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-2 gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-medium"
            onClick={handlePublishSite}
          >
            <Rocket className="w-4 h-4" />
            Publicar
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
              className="h-9 px-2 gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs font-medium w-full"
            >
              <ExternalLink className="w-4 h-4" />
              Ver Site
            </Button>
          </a>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 gap-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 text-xs font-medium"
          onClick={handleSendProposal}
        >
          <Send className="w-4 h-4" />
          Proposta
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 gap-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50 text-xs font-medium"
          onClick={handleFollowUp}
        >
          <Clock className="w-4 h-4" />
          Follow-up
        </Button>
      </div>

      {/* Navigation arrows */}
      <div className="flex items-center justify-between mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={currentIdx === 0}
          onClick={(e) => {
            e.stopPropagation();
            onMove("prev");
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-[10px] text-muted-foreground font-medium">
          {KANBAN_COLUMNS[currentIdx]?.label}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={currentIdx === KANBAN_COLUMNS.length - 1}
          onClick={(e) => {
            e.stopPropagation();
            onMove("next");
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
