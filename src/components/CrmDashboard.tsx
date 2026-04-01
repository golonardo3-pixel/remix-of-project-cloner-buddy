import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, MessageSquare, Star, CheckCircle } from "lucide-react";

interface Lead {
  id: string;
  lead_status: string;
  service_value: number | null;
  payment_status: string;
  created_at: string;
}

interface Props {
  leads: Lead[];
}

const CrmDashboard = ({ leads }: Props) => {
  const today = new Date().toDateString();
  const leadsToday = leads.filter((l) => new Date(l.created_at).toDateString() === today).length;
  const novo = leads.filter((l) => l.lead_status === "novo").length;
  const responded = leads.filter((l) => l.lead_status === "respondeu").length;
  const interested = leads.filter((l) => l.lead_status === "interessado").length;
  const closed = leads.filter((l) => l.lead_status === "fechado").length;
  const totalRevenue = leads
    .filter((l) => l.payment_status === "pago" && l.service_value)
    .reduce((sum, l) => sum + (l.service_value || 0), 0);

  const metrics = [
    { label: "Novos", value: novo, icon: Users, color: "text-blue-500" },
    { label: "Respondidos", value: responded, icon: MessageSquare, color: "text-yellow-500" },
    { label: "Interessados", value: interested, icon: Star, color: "text-orange-500" },
    { label: "Fechados", value: closed, icon: CheckCircle, color: "text-green-500" },
    {
      label: "Faturamento",
      value: `R$ ${totalRevenue.toLocaleString("pt-BR")}`,
      icon: DollarSign,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 mb-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-card border border-border rounded-lg p-3 flex flex-col items-center gap-1"
        >
          <m.icon className={`w-5 h-5 ${m.color}`} />
          <span className="text-lg md:text-xl font-bold text-foreground">{m.value}</span>
          <span className="text-[10px] md:text-xs text-muted-foreground text-center">{m.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CrmDashboard;
