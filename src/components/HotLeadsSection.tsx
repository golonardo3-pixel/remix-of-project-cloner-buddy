import { Phone, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/components/KanbanBoard";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface Props {
  leads: Lead[];
}

const HotLeadsSection = ({ leads }: Props) => {
  const hotLeads = leads
    .filter((l) => l.lead_status === "respondeu")
    .sort((a, b) => {
      const da = a.last_interaction ? new Date(a.last_interaction).getTime() : 0;
      const db = b.last_interaction ? new Date(b.last_interaction).getTime() : 0;
      return db - da;
    });

  if (hotLeads.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Flame className="w-5 h-5 text-orange-500" />
        <h2 className="text-sm font-semibold text-foreground">
          Leads quentes ({hotLeads.length})
        </h2>
        <span className="text-[10px] text-muted-foreground">responderam recentemente</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {hotLeads.map((lead) => (
          <div
            key={lead.id}
            className="flex items-center justify-between gap-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{lead.company_name}</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {lead.niche} · {lead.city}
              </p>
            </div>
            <Button
              size="sm"
              className="shrink-0 gap-1.5 bg-green-600 hover:bg-green-700 text-white h-9"
              onClick={() => {
                window.open(buildWhatsAppUrl(lead.phone), "_blank");
              }}
            >
              <Phone className="w-4 h-4" />
              Responder
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotLeadsSection;
