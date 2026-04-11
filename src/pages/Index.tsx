import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Send, Globe, Briefcase, MessageSquare, Star, CheckCircle, Search, TrendingUp, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-agency.jpg";

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
    { label: "Total Leads", value: total, icon: Users, gradient: "from-blue-500 to-indigo-600" },
    { label: "Contatados", value: contacted, icon: MessageSquare, gradient: "from-amber-500 to-orange-600" },
    { label: "Interessados", value: interested, icon: Star, gradient: "from-purple-500 to-pink-600" },
    { label: "Fechados", value: closed, icon: CheckCircle, gradient: "from-emerald-500 to-teal-600" },
  ];

  const menu = [
    { label: "Leads", icon: Users, path: "/crm", desc: "Gerenciar pipeline" },
    { label: "Mineração", icon: Search, path: "/crm/mineracao", desc: "Encontrar leads" },
    { label: "Disparo", icon: Send, path: "/crm/disparo", desc: "Enviar mensagens" },
    { label: "Sites", icon: Globe, path: "/crm", desc: "Sites dos leads" },
    { label: "Produção", icon: Briefcase, path: "/crm", desc: "Acompanhar entregas" },
    { label: "Relatórios", icon: TrendingUp, path: "/crm", desc: "Métricas e dados" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Hero with background image */}
      <div className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Agency dashboard"
          className="absolute inset-0 w-full h-full object-cover"
          width={1280}
          height={720}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/70 to-[#0a0a0f]" />

        <div className="relative z-10 px-5 pt-10 pb-8 max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400/80 text-[11px] font-medium tracking-widest uppercase">
              Sistema ativo
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Clientes no <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Google</span>
          </h1>
          <p className="text-white/50 text-sm mt-1">Painel de vendas • Agência</p>
        </div>
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 -mt-2 pb-8 space-y-6 relative z-20">
        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm p-4 group hover:border-white/[0.15] transition-all duration-300"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${s.gradient} opacity-[0.08] rounded-bl-[40px] group-hover:opacity-[0.15] transition-opacity`} />
              <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${s.gradient} mb-3`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-white leading-none">{s.value}</p>
              <p className="text-[11px] text-white/40 mt-1 font-medium tracking-wide uppercase">{s.label}</p>
            </div>
          ))}
        </section>

        {/* Menu Grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-white/30 tracking-widest uppercase">Ações rápidas</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {menu.map((m) => (
              <button
                key={m.label}
                onClick={() => navigate(m.path)}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left hover:bg-white/[0.06] hover:border-white/[0.15] active:scale-[0.97] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/10">
                    <m.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-amber-400/60 group-hover:translate-x-0.5 transition-all" />
                </div>
                <span className="text-sm font-semibold text-white block">{m.label}</span>
                <span className="text-[11px] text-white/35 mt-0.5 block">{m.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Footer */}
        <p className="text-center text-[10px] text-white/20 pt-4">
          © {new Date().getFullYear()} • Clientes no Google
        </p>
      </main>
    </div>
  );
};

export default Index;
