import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import AddLeadDialog from "@/components/AddLeadDialog";
import KanbanBoard from "@/components/KanbanBoard";
import type { Lead } from "@/components/KanbanBoard";
import CrmDashboard from "@/components/CrmDashboard";
import CrmFilters, { EMPTY_FILTERS, type CrmFilterValues } from "@/components/CrmFilters";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CrmLeads = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<CrmFilterValues>({ ...EMPTY_FILTERS });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const { data: leads, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Lead[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("leads").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setSelectedIds(new Set());
      toast({ title: "Leads apagados com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao apagar leads", variant: "destructive" });
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      const ids = leads?.map((l) => l.id) || [];
      if (!ids.length) return;
      const { error } = await supabase.from("leads").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setSelectedIds(new Set());
      toast({ title: "Todos os leads foram apagados!" });
    },
    onError: () => {
      toast({ title: "Erro ao limpar lista", variant: "destructive" });
    },
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const niches = useMemo(() => {
    if (!leads) return [];
    return [...new Set(leads.map((l) => l.niche))].sort();
  }, [leads]);

  const cities = useMemo(() => {
    if (!leads) return [];
    return [...new Set(leads.map((l) => l.city))].sort();
  }, [leads]);

  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    return leads.filter((l) => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (
          !l.company_name.toLowerCase().includes(s) &&
          !l.niche.toLowerCase().includes(s) &&
          !l.city.toLowerCase().includes(s)
        )
          return false;
      }
      if (filters.niche && l.niche !== filters.niche) return false;
      if (filters.city && l.city !== filters.city) return false;
      if (filters.status && l.lead_status !== filters.status) return false;
      if (filters.payment && l.payment_status !== filters.payment) return false;
      if (filters.siteStatus && l.site_status !== filters.siteStatus) return false;
      if (filters.temperature && l.lead_temperature !== filters.temperature) return false;
      return true;
    });
  }, [leads, filters]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="font-display text-xl md:text-2xl font-semibold text-foreground">
              CRM <span className="text-accent">Leads</span>
            </h1>
            <p className="text-muted-foreground text-xs hidden sm:block">
              Gerencie seus leads e acompanhe cada etapa
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-1.5">
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Apagar</span> ({selectedIds.size})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apagar {selectedIds.size} lead(s)?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMutation.mutate([...selectedIds])}
                    >
                      Apagar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {(leads?.length ?? 0) > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Limpar lista</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Limpar toda a lista?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Todos os {leads?.length} leads serão apagados permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => clearAllMutation.mutate()}
                    >
                      Apagar tudo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <Button
              onClick={() => navigate("/crm/disparo")}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Disparo</span>
            </Button>

            <Button
              onClick={() => setDialogOpen(true)}
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Lead</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 py-4">
        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Carregando leads...</div>
        ) : !leads?.length ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Nenhum lead cadastrado ainda.</p>
            <Button onClick={() => setDialogOpen(true)} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Cadastrar primeiro lead
            </Button>
          </div>
        ) : (
          <>
            <CrmDashboard leads={leads} />
            <CrmFilters filters={filters} onChange={setFilters} niches={niches} cities={cities} />
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum lead encontrado com esses filtros.
              </div>
            ) : (
              <KanbanBoard
                leads={filteredLeads}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
              />
            )}
          </>
        )}
      </main>

      <AddLeadDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default CrmLeads;
