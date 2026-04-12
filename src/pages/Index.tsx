import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Send, Globe, Search, MessageSquare, Star, CheckCircle, ArrowRight, TrendingUp, RotateCcw, DollarSign } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import heroImg from "@/assets/hero-saas.jpg";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const RESET_KEYS = {
  all: "metrics_reset_at",
  revenue: "metrics_reset_revenue_at",
} as const;

function getResetDate(key: string): string | null {
  return localStorage.getItem(key);
}

const Index = () => {
  const navigate = useNavigate();
  const [resetDialog, setResetDialog] = useState<"all" | "revenue" | "counters" | null>(null);
  const [resetTs, setResetTs] = useState(() => ({
    all: getResetDate(RESET_KEYS.all),
    revenue: getResetDate(RESET_KEYS.revenue),
  }));

  const { data: leads } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, lead_status, site_status, service_value, payment_status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const effectiveResetAll = resetTs.all;
  const effectiveResetRevenue = resetTs.revenue;

  const filteredForCounters = useMemo(() => {
    if (!leads) return [];
    const cutoff = effectiveResetAll;
    if (!cutoff) return leads;
    return leads.filter((l) => new Date(l.created_at) >= new Date(cutoff));
  }, [leads, effectiveResetAll]);

  const filteredForRevenue = useMemo(() => {
    if (!leads) return [];
    const cutoff = effectiveResetRevenue || effectiveResetAll;
    if (!cutoff) return leads;
    return leads.filter((l) => new Date(l.created_at) >= new Date(cutoff));
  }, [leads, effectiveResetAll, effectiveResetRevenue]);

  const total = filteredForCounters.length;
  const contacted = filteredForCounters.filter((l) => l.lead_status === "respondeu").length;
  const interested = filteredForCounters.filter((l) => l.lead_status === "interessado").length;
  const closed = filteredForCounters.filter((l) => l.lead_status === "fechado").length;
  const revenue = filteredForRevenue
    .filter((l) => l.payment_status === "pago")
    .reduce((sum, l) => sum + (Number(l.service_value) || 0), 0);

  const handleReset = (type: "all" | "revenue" | "counters") => {
    const now = new Date().toISOString();
    if (type === "all" || type === "counters") {
      localStorage.setItem(RESET_KEYS.all, now);
    }
    if (type === "all" || type === "revenue") {
      localStorage.setItem(RESET_KEYS.revenue, now);
    }
    setResetTs({
      all: getResetDate(RESET_KEYS.all),
      revenue: getResetDate(RESET_KEYS.revenue),
    });
    setResetDialog(null);
    toast.success(
      type === "all"
        ? "Todas as métricas foram zeradas"
        : type === "revenue"
        ? "Faturamento zerado"
        : "Contadores zerados"
    );
  };

  const stats = [
    { label: "Total Leads", value: total, icon: Users, color: "text-primary" },
    { label: "Contatados", value: contacted, icon: MessageSquare, color: "text-amber-500" },
    { label: "Interessados", value: interested, icon: Star, color: "text-purple-500" },
    { label: "Fechados", value: closed, icon: CheckCircle, color: "text-emerald-500" },
    { label: "Faturamento", value: `R$ ${revenue.toLocaleString("pt-BR")}`, icon: DollarSign, color: "text-emerald-600" },
  ];

  const actions = [
    { label: "Leads", icon: Users, path: "/crm", desc: "Gerenciar pipeline de vendas" },
    { label: "Mineração", icon: Search, path: "/crm/mineracao", desc: "Encontrar novos leads" },
    { label: "Disparo", icon: Send, path: "/crm/disparo", desc: "Enviar mensagens em massa" },
    { label: "Sites", icon: Globe, path: "/crm", desc: "Sites dos leads" },
  ];

  const dialogMessages: Record<string, { title: string; desc: string }> = {
    all: { title: "Zerar todas as métricas?", desc: "Os contadores e o faturamento serão zerados. Nenhum lead será apagado." },
    revenue: { title: "Zerar apenas o faturamento?", desc: "Apenas o valor de faturamento será zerado. Contadores e leads não serão afetados." },
    counters: { title: "Zerar apenas os contadores?", desc: "Apenas os contadores (total, contatados, interessados, fechados) serão zerados. Faturamento e leads não serão afetados." },
  };

  return (
    <AppLayout title="Dashboard" subtitle="Visão geral do sistema">
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden min-h-[260px] md:min-h-[320px]">
          <img src={heroImg} alt="Dashboard" className="absolute inset-0 w-full h-full object-cover" width={1280} height={600} />
          <div className="absolute inset-0 bg-foreground/60" />
          <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6 py-14 md:py-20">
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight max-w-lg">
              Mais clientes nas buscas, sem complicação.
            </h2>
            <p className="text-white/75 text-sm md:text-base mt-3 max-w-md">
              Transforme seu perfil em uma máquina de gerar contatos todos os dias.
            </p>
            <button
              onClick={() => navigate("/crm")}
              className="mt-6 inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 py-3 rounded-lg transition-colors text-sm md:text-base"
            >
              Ver Leads <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">Métricas</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground">
                  <RotateCcw className="w-3.5 h-3.5" /> Zerar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setResetDialog("all")}>Zerar tudo</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setResetDialog("counters")}>Zerar contadores</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setResetDialog("revenue")}>Zerar faturamento</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
          </div>
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

      {/* Reset confirmation dialog */}
      <AlertDialog open={!!resetDialog} onOpenChange={(open) => !open && setResetDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{resetDialog && dialogMessages[resetDialog]?.title}</AlertDialogTitle>
            <AlertDialogDescription>{resetDialog && dialogMessages[resetDialog]?.desc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => resetDialog && handleReset(resetDialog)}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Index;
