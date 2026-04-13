import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import LeadDetailSheet from "./LeadDetailSheet";
import LeadCard from "./LeadCard";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const KANBAN_COLUMNS = [
  { id: "novo", label: "Novo Lead", color: "bg-blue-500" },
  { id: "respondeu", label: "Respondeu", color: "bg-yellow-500" },
  { id: "interessado", label: "Interessado", color: "bg-orange-500" },
  { id: "fechado", label: "Fechado", color: "bg-green-500" },
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
  site_content: any;
  google_rating: number | null;
  google_reviews_count: number | null;
  site_variations: any;
}

interface Props {
  leads: Lead[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
}

const KanbanBoard = ({ leads, selectedIds, onToggleSelect }: Props) => {
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
          .update({ lead_status: "respondeu", last_interaction: new Date().toISOString() } as any)
          .eq("id", lead.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const handleWhatsApp = (lead: Lead) => {
    window.open(buildWhatsAppUrl(lead.phone), "_blank");
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
      {/* Desktop: horizontal kanban */}
      <div className="hidden md:block overflow-x-auto pb-4">
        <div className="grid grid-cols-4 gap-3">
          {KANBAN_COLUMNS.map((col) => {
            const colLeads = getColumnLeads(col.id);
            return (
              <div key={col.id} className="bg-muted/50 rounded-lg border border-border">
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
                      selected={selectedIds.has(lead.id)}
                      onToggleSelect={() => onToggleSelect(lead.id)}
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
                    selected={selectedIds.has(lead.id)}
                    onToggleSelect={() => onToggleSelect(lead.id)}
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

export default KanbanBoard;
