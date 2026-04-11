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
  Download,
  FileCode,
  MessageCircle,
} from "lucide-react";
import { downloadStaticHTML, downloadReactProject } from "@/lib/site-export";
import { getPublicLeadSiteUrl } from "@/lib/public-site-url";
import { KANBAN_COLUMNS, type Lead } from "@/components/KanbanBoard";
import { resolveSpintax } from "@/lib/spintax";

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
    `{Oi|Olá}, {tudo bem|tudo certo}?\n\n{Dei uma olhada|Analisei} o perfil da ${lead.company_name} e {vi que dá pra melhorar bastante|achei que tem espaço pra crescer} a presença online de vocês.\n\n{Se fizer sentido pra você|Se gostar da ideia}, consigo deixar isso pronto com tudo configurado:\n\n- site profissional\n- botão direto pro WhatsApp\n- estrutura pronta pra receber clientes\n\n{Consigo te explicar rapidinho|Quer que eu te mostre como funciona?}`,
    `{Oi|Olá|E aí}, {tudo certo|tudo bem}?\n\nVi a ${lead.company_name} em ${lead.city} e {percebi que vocês têm potencial|achei o trabalho de vocês muito bom}, mas {talvez estejam perdendo clientes|dá pra atrair mais gente} por não ter uma página {profissional|bem feita} online.\n\n{Se quiser|Se fizer sentido}, monto pra você:\n\n- página bonita e rápida\n- contato direto pelo WhatsApp\n- tudo pronto pra usar\n\n{Te explico em 1 minuto?|Posso te mostrar como fica?}`,
    `{Oi|Olá}, {tudo bem|tudo certo}?\n\n{Estudei|Analisei} como a ${lead.company_name} aparece no Google e {tenho uma sugestão|vi uma oportunidade} que pode {trazer mais clientes|facilitar o contato com clientes novos}.\n\nO que eu faço:\n\n- site profissional pro seu negócio\n- botão direto pro WhatsApp\n- pronto pra funcionar\n\n{Se curtir a ideia|Se fizer sentido pra você}, {te mostro rapidinho|posso te explicar como funciona}.`,
    `{Fala|Oi|Olá}, {tudo bem|tudo certo}?\n\nTava {pesquisando|olhando} negócios em ${lead.city} e a ${lead.company_name} {me chamou atenção|se destacou}.\n\n{Acho que|Acredito que} um site simples com botão pro WhatsApp pode {fazer diferença|ajudar bastante} pra vocês receberem mais contatos.\n\nInclui tudo:\n\n- página profissional\n- WhatsApp integrado\n- estrutura completa\n\n{Quer saber mais?|Posso te mostrar como fica?}`,
  ];

  const followUpMessages = [
    `{Oi|Olá}, consegui dar uma olhada melhor no seu perfil e vi alguns pontos que podem melhorar.\n\n{Se ainda fizer sentido|Se quiser}, posso te mostrar rapidinho.`,
    `{Oi|Olá|E aí}, {tudo bem|tudo certo}?\n\nDei mais uma olhada na ${lead.company_name} e {tive umas ideias|vi umas oportunidades} que acho que podem te ajudar.\n\n{Quer que eu te mostre?|Posso te explicar em 1 minuto?}`,
    `{Oi|Olá}! Passando aqui de novo porque {achei mais umas coisas legais|vi mais detalhes} sobre como a ${lead.company_name} pode {aparecer melhor no Google|atrair mais clientes}.\n\n{Se tiver um minutinho|Se fizer sentido pra você}, te explico rapidinho.`,
    `{Oi|Fala}, {tudo certo|tudo bem}?\n\nLembrei de você porque {analisei melhor|revi} o perfil da ${lead.company_name} e {tem coisa que dá pra melhorar fácil|vi oportunidade boa}.\n\n{Posso te mandar|Quer ver}?`,
  ];

  const handleSendProposal = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getPublicLeadSiteUrl(lead.slug);
    const template = proposalMessages[Math.floor(Math.random() * proposalMessages.length)];
    const msg = encodeURIComponent(resolveSpintax(template));
    window.open(`https://wa.me/${lead.phone}?text=${msg}`, "_blank");
  };

  const handleFollowUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const template = followUpMessages[Math.floor(Math.random() * followUpMessages.length)];
    const msg = encodeURIComponent(resolveSpintax(template));
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

        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-medium"
          onClick={(e) => {
            e.stopPropagation();
            const msg = encodeURIComponent(
              resolveSpintax(`{Oi|Olá|Fala} {tudo bem|tudo certo}?\n\nVi ${lead.company_name} em ${lead.city} e {achei interessante|me chamou atenção|resolvi te chamar} porque muitos negócios {não aparecem bem no Google|estão perdendo clientes online}.\n\n{Posso te mostrar uma ideia rápida?|Quer ver uma sugestão rápida?|Te explico em 1 minuto?}`)
            );
            window.open(`https://wa.me/${lead.phone}?text=${msg}`, "_blank");
          }}
        >
          <MessageCircle className="w-4 h-4" />
          Iniciar Conversa
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

      {/* Edit / Duplicate — only when site exists */}
      {siteExists && (
        <div className="grid grid-cols-3 gap-1.5 mt-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-2 gap-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-xs font-medium"
            onClick={handleEditSite}
          >
            <Pencil className="w-4 h-4" />
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-2 gap-1.5 text-slate-600 hover:text-slate-700 hover:bg-slate-50 text-xs font-medium"
            onClick={handleDuplicate}
          >
            <Copy className="w-4 h-4" />
            Duplicar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-2 gap-1.5 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 text-xs font-medium"
            onClick={(e) => {
              e.stopPropagation();
              const url = getPublicLeadSiteUrl(lead.slug);
              navigator.clipboard.writeText(url);
              toast({ title: "Link copiado!" });
            }}
          >
            <ExternalLink className="w-4 h-4" />
            Copiar Link
          </Button>
        </div>
      )}

      {/* Export buttons */}
      {siteExists && (
        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-2 gap-1.5 text-teal-600 hover:text-teal-700 hover:bg-teal-50 text-xs font-medium"
            onClick={(e) => {
              e.stopPropagation();
              downloadStaticHTML(lead);
              toast({ title: "Download do HTML iniciado!" });
            }}
          >
            <Download className="w-4 h-4" />
            Baixar HTML
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-2 gap-1.5 text-violet-600 hover:text-violet-700 hover:bg-violet-50 text-xs font-medium"
            onClick={(e) => {
              e.stopPropagation();
              downloadReactProject(lead);
              toast({ title: "Download do projeto React iniciado!" });
            }}
          >
            <FileCode className="w-4 h-4" />
            Baixar React
          </Button>
        </div>
      )}
      <div className="flex items-center justify-between mt-2">
        <Button
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
