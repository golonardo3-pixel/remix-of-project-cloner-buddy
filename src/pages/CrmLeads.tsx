import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Plus, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddLeadDialog from "@/components/AddLeadDialog";
import { toast } from "@/hooks/use-toast";
import { getPublicLeadSiteUrl } from "@/lib/public-site-url";

const CrmLeads = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: leads, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: "Lead removido com sucesso" });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              CRM <span className="text-gold">Leads</span>
            </h1>
            <p className="text-muted-foreground text-sm">Gerencie seus leads e gere sites automaticamente</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2 bg-gold text-foreground hover:bg-gold/90">
            <Plus className="w-4 h-4" />
            Novo Lead
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8">
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
          <div className="grid gap-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between bg-card rounded-lg border border-border p-5 hover:shadow-md transition-shadow"
              >
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold text-foreground truncate">
                    {lead.company_name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {lead.niche} · {lead.city} · {lead.phone}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <Link to={getPublicLeadSiteUrl(lead.slug)} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Ver Site
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(lead.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AddLeadDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default CrmLeads;
