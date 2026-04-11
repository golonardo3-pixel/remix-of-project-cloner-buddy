import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Send, Globe, Search, MessageSquare, Star, CheckCircle, ArrowRight, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import heroImg from "@/assets/hero-saas.jpg";

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
    { label: "Total Leads", value: total, icon: Users, color: "text-primary" },
    { label: "Contatados", value: contacted, icon: MessageSquare, color: "text-amber-500" },
    { label: "Interessados", value: interested, icon: Star, color: "text-purple-500" },
    { label: "Fechados", value: closed, icon: CheckCircle, color: "text-emerald-500" },
  ];

  const actions = [
    { label: "Leads", icon: Users, path: "/crm", desc: "Gerenciar pipeline de vendas" },
    { label: "Mineração", icon: Search, path: "/crm/mineracao", desc: "Encontrar novos leads" },
    { label: "Disparo", icon: Send, path: "/crm/disparo", desc: "Enviar mensagens em massa" },
    { label: "Sites", icon: Globe, path: "/crm", desc: "Sites dos leads" },
  ];

  return (
    <AppLayout title="Dashboard" subtitle="Visão geral do sistema">
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden h-48 md:h-56">
          <img src={heroImg} alt="Dashboard" className="absolute inset-0 w-full h-full object-cover" width={1280} height={600} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
          <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Transforme visitas do Google em clientes
            </h2>
            <p className="text-white/70 text-sm mt-2 max-w-md">
              Gerencie leads, crie sites e automatize abordagens — tudo em um só lugar.
            </p>
            <button
              onClick={() => navigate("/crm")}
              className="mt-4 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg w-fit transition-colors"
            >
              Acessar Leads <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/40" />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </section>

        {/* Actions */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
            Ações rápidas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 text-left hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <a.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-foreground block">{a.label}</span>
                  <span className="text-xs text-muted-foreground mt-0.5 block">{a.desc}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1" />
              </button>
            ))}
          </div>
        </section>

        <p className="text-center text-[11px] text-muted-foreground/50 pt-4">
          © {new Date().getFullYear()} • Clientes no Google
        </p>
      </div>
    </AppLayout>
  );
};

export default Index;
