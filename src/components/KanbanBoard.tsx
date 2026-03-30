import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LeadDetailSheet from "./LeadDetailSheet";
import LeadCard from "./LeadCard";

export const KANBAN_COLUMNS = [
  { id: "novo", label: "Novo Lead", color: "bg-blue-500" },
  { id: "chamado", label: "Chamado", color: "bg-sky-500" },
  { id: "respondeu", label: "Respondeu", color: "bg-yellow-500" },
  { id: "interessado", label: "Interessado", color: "bg-orange-500" },
  { id: "em_negociacao", label: "Em Negociação", color: "bg-purple-500" },
  { id: "fechado", label: "Fechado", color: "bg-green-500" },
  { id: "site_entregue", label: "Site Entregue", color: "bg-emerald-600" },
  { id: "perdido", label: "Perdido", color: "bg-red-500" },
] as const;

export type LeadStatus = (typeof KANBAN_COLUMNS)[number]["id"];


export interface Lead {
  id: string;
  company_name: string;
  niche: string;
  city: string;
  phone: string;
  slug: string;
  lead_status: string;
  lead_temperature: string;
  service_value: number | null;
  payment_status: string;
  site_status: string;
  last_interaction: string | null;
  notes: string | null;
  created_at: string;
  description: string | null;
  google_maps_url: string | null;
  instagram: string | null;
  services_list: string[] | null;
  photos: string[] | null;
}

interface Props {
  leads: Lead[];
}

const KanbanBoard = ({ leads }: Props) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const queryClient = useQueryClient();

  const moveMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("leads")
        .update({ lead_status: status, last_interaction: new Date().toISOString() } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const whatsappMutation = useMutation({
    mutationFn: async (lead: Lead) => {
      if (lead.lead_status === "novo") {
        const { error } = await supabase
          .from("leads")
          .update({ lead_status: "chamado", last_interaction: new Date().toISOString() } as any)
          .eq("id", lead.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const handleWhatsApp = (lead: Lead) => {
    window.open(`https://wa.me/${lead.phone}`, "_blank");
    whatsappMutation.mutate(lead);
  };

  const moveLeadToColumn = (lead: Lead, direction: "prev" | "next") => {
    const currentIdx = KANBAN_COLUMNS.findIndex((c) => c.id === lead.lead_status);
    const newIdx = direction === "next" ? currentIdx + 1 : currentIdx - 1;
    if (newIdx < 0 || newIdx >= KANBAN_COLUMNS.length) return;
    moveMutation.mutate({ id: lead.id, status: KANBAN_COLUMNS[newIdx].id });
  };

  const getColumnLeads = (columnId: string) =>
    leads.filter((l) => l.lead_status === columnId);

  return (
    <>
      {/* Desktop: horizontal scroll kanban */}
      <div className="hidden md:block overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-max">
          {KANBAN_COLUMNS.map((col) => {
            const colLeads = getColumnLeads(col.id);
            return (
              <div key={col.id} className="w-[270px] shrink-0 bg-muted/50 rounded-lg border border-border">
                <div className="p-3 border-b border-border flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                  <Badge variant="secondary" className="ml-auto text-xs">{colLeads.length}</Badge>
                </div>
                <div className="p-2 space-y-2 min-h-[120px] max-h-[calc(100vh-300px)] overflow-y-auto">
                  {colLeads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onSelect={() => setSelectedLead(lead)}
                      onMove={(dir) => moveLeadToColumn(lead, dir)}
                      onWhatsApp={() => handleWhatsApp(lead)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: stacked columns */}
      <div className="md:hidden space-y-4">
        {KANBAN_COLUMNS.map((col) => {
          const colLeads = getColumnLeads(col.id);
          if (colLeads.length === 0) return null;
          return (
            <div key={col.id}>
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                <Badge variant="secondary" className="text-xs">{colLeads.length}</Badge>
              </div>
              <div className="space-y-2">
                {colLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onSelect={() => setSelectedLead(lead)}
                    onMove={(dir) => moveLeadToColumn(lead, dir)}
                    onWhatsApp={() => handleWhatsApp(lead)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <LeadDetailSheet
        lead={selectedLead}
        open={!!selectedLead}
        onOpenChange={(open) => !open && setSelectedLead(null)}
      />
    </>
  );
};

function LeadCard({
  lead,
  onSelect,
  onMove,
  onWhatsApp,
}: {
  lead: Lead;
  onSelect: () => void;
  onMove: (dir: "prev" | "next") => void;
  onWhatsApp: () => void;
}) {
  const currentIdx = KANBAN_COLUMNS.findIndex((c) => c.id === lead.lead_status);
  const temp = TEMP_CONFIG[lead.lead_temperature] || TEMP_CONFIG.morno;

  return (
    <div
      className="bg-card rounded-md border border-border p-3 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-foreground truncate flex-1">{lead.company_name}</h4>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border shrink-0 ${temp.className}`}>
          {temp.emoji} {temp.label}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-0.5 truncate">
        {lead.niche} · {lead.city}
      </p>

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

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          disabled={currentIdx === 0}
          onClick={(e) => { e.stopPropagation(); onMove("prev"); }}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={(e) => { e.stopPropagation(); onWhatsApp(); }}
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">WhatsApp</span>
          </Button>
          <a
            href={getPublicLeadSiteUrl(lead.slug)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          disabled={currentIdx === KANBAN_COLUMNS.length - 1}
          onClick={(e) => { e.stopPropagation(); onMove("next"); }}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default KanbanBoard;
