import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Send, Globe, Briefcase, MessageSquare, Star, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const { data: leads } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, lead_status, site_status")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const total = leads?.length ?? 0;
  const contacted = leads?.filter((l) => l.lead_status === "respondeu").length ?? 0;
  const interested = leads?.filter((l) => l.lead_status === "interessado").length ?? 0;
  const closed = leads?.filter((l) => l.lead_status === "fechado").length ?? 0;

  const stats = [
    { label: "Total", value: total, icon: Users, color: "text-primary" },
    { label: "Contatados", value: contacted, icon: MessageSquare, color: "text-yellow-500" },
    { label: "Interessados", value: interested, icon: Star, color: "text-orange-500" },
    { label: "Fechados", value: closed, icon: CheckCircle, color: "text-green-500" },
  ];

  const menu = [
    { label: "Leads", icon: Users, path: "/crm", desc: "Gerenciar leads" },
    { label: "Disparo", icon: Send, path: "/crm/disparo", desc: "Enviar mensagens" },
    { label: "Sites", icon: Globe, path: "/crm", desc: "Sites dos leads" },
    { label: "Produção", icon: Briefcase, path: "/crm", desc: "Acompanhar entregas" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-foreground">
            Clientes no <span className="text-accent">Google</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Painel de vendas</p>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5 space-y-6">
        {/* Stats */}
        <section className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
            >
              <div className="rounded-lg bg-muted p-2.5">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground leading-none">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Menu */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Ações</h2>
          <div className="grid grid-cols-2 gap-3">
            {menu.map((m) => (
              <button
                key={m.label}
                onClick={() => navigate(m.path)}
                className="bg-card border border-border rounded-xl p-5 flex flex-col items-center gap-2 hover:bg-accent/10 active:scale-[0.97] transition-all"
              >
                <div className="rounded-lg bg-accent/10 p-3">
                  <m.icon className="w-6 h-6 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground">{m.label}</span>
                <span className="text-[11px] text-muted-foreground">{m.desc}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
