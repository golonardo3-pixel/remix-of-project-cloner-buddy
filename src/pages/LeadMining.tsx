import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Search, Plus, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { availableNiches } from "@/lib/niche-content";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

interface MinedLead {
  id: string;
  company_name: string;
  phone: string;
  city: string;
  niche: string;
}

const LeadMining = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [minedLeads, setMinedLeads] = useState<MinedLead[]>([]);

  // Form for adding a new mined lead
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [niche, setNiche] = useState("");

  const isFormValid = name.trim() && phone.replace(/\D/g, "").length >= 10 && city.trim() && niche;

  const addToList = () => {
    if (!isFormValid) return;
    setMinedLeads((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        company_name: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        niche,
      },
    ]);
    setName("");
    setPhone("");
    toast({ title: "Lead adicionado à lista!" });
  };

  const removeFromList = (id: string) => {
    setMinedLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const addToCrmMutation = useMutation({
    mutationFn: async (leads: MinedLead[]) => {
      const rows = leads.map((l) => ({
        company_name: l.company_name,
        phone: "55" + l.phone.replace(/\D/g, ""),
        city: l.city,
        niche: l.niche,
        slug: slugify(l.company_name) + "-" + Date.now().toString(36),
      }));
      const { error } = await supabase.from("leads").insert(rows as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setMinedLeads([]);
      toast({ title: `Leads adicionados ao CRM!` });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao adicionar leads", description: err.message, variant: "destructive" });
    },
  });

  const addSingleToCrm = useMutation({
    mutationFn: async (lead: MinedLead) => {
      const { error } = await supabase.from("leads").insert({
        company_name: lead.company_name,
        phone: "55" + lead.phone.replace(/\D/g, ""),
        city: lead.city,
        niche: lead.niche,
        slug: slugify(lead.company_name) + "-" + Date.now().toString(36),
      } as any);
      if (error) throw error;
      return lead.id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setMinedLeads((prev) => prev.filter((l) => l.id !== id));
      toast({ title: "Lead adicionado ao CRM!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao adicionar", description: err.message, variant: "destructive" });
    },
  });

  // Filter mined leads by search
  const filtered = searchQuery
    ? minedLeads.filter(
        (l) =>
          l.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.niche.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : minedLeads;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/crm")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-lg font-semibold text-foreground">
              Mineração de <span className="text-accent">Leads</span>
            </h1>
            <p className="text-muted-foreground text-xs">
              Pesquise e adicione leads ao CRM
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Search hint */}
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-start gap-2">
              <Search className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Como minerar leads</p>
                <ul className="text-[11px] text-muted-foreground space-y-0.5">
                  <li>1. Pesquise no Google Maps: ex. "salão de beleza em Campinas"</li>
                  <li>2. Anote nome, telefone, cidade e nicho</li>
                  <li>3. Adicione os leads abaixo e envie ao CRM</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick add form */}
        <Card>
          <CardContent className="pt-5 space-y-3">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> Adicionar lead
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Empresa *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Studio Élise"
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs">Telefone *</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="(19) 99999-9999"
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs">Cidade *</Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Campinas"
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs">Nicho *</Label>
                <Select value={niche} onValueChange={setNiche}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableNiches.map((n) => (
                      <SelectItem key={n} value={n} className="capitalize">
                        {n.charAt(0).toUpperCase() + n.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={addToList}
              disabled={!isFormValid}
              className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              Adicionar à lista
            </Button>
          </CardContent>
        </Card>

        {/* Search in mined list */}
        {minedLeads.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar na lista..."
              className="pl-9 h-9"
            />
          </div>
        )}

        {/* Mined leads list */}
        {minedLeads.length > 0 && (
          <Card>
            <CardContent className="pt-4 pb-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-foreground">
                  Lista ({minedLeads.length} leads)
                </p>
                <Button
                  size="sm"
                  className="gap-1.5 bg-green-600 hover:bg-green-700 text-white h-8 text-xs"
                  onClick={() => addToCrmMutation.mutate(minedLeads)}
                  disabled={addToCrmMutation.isPending}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar todos ao CRM
                </Button>
              </div>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {filtered.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between gap-2 p-2.5 bg-muted/50 rounded-lg border border-border"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{lead.company_name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {lead.niche} · {lead.city} · {lead.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px] gap-1"
                        onClick={() => addSingleToCrm.mutate(lead)}
                        disabled={addSingleToCrm.isPending}
                      >
                        <Plus className="w-3 h-3" />
                        CRM
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromList(lead.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {minedLeads.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Nenhum lead na lista. Adicione leads usando o formulário acima.
          </div>
        )}
      </main>
    </div>
  );
};

export default LeadMining;
