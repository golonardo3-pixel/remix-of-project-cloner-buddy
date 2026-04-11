import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, ExternalLink, Phone } from "lucide-react";
import { KANBAN_COLUMNS } from "./KanbanBoard";
import type { Lead } from "./KanbanBoard";
import { getPublicLeadSiteUrl } from "@/lib/public-site-url";
import GmbAnalysis from "@/components/GmbAnalysis";
import LeadSuggestions from "@/components/LeadSuggestions";

interface Props {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LeadDetailSheet = ({ lead, open, onOpenChange }: Props) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [temperature, setTemperature] = useState("morno");
  const [serviceValue, setServiceValue] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [siteStatus, setSiteStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (lead) {
      setStatus(lead.lead_status);
      setTemperature(lead.lead_temperature || "morno");
      setServiceValue(lead.service_value != null ? String(lead.service_value) : "");
      setPaymentStatus(lead.payment_status);
      setSiteStatus(lead.site_status);
      setNotes(lead.notes || "");
    }
  }, [lead]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!lead) return;
      const { error } = await supabase
        .from("leads")
        .update({
          lead_status: status,
          lead_temperature: temperature,
          service_value: serviceValue ? Number(serviceValue) : null,
          payment_status: paymentStatus,
          site_status: siteStatus,
          notes: notes.trim() || null,
          last_interaction: new Date().toISOString(),
        } as any)
        .eq("id", lead.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: "Lead atualizado!" });
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao atualizar", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!lead) return;
      const { error } = await supabase.from("leads").delete().eq("id", lead.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: "Lead removido" });
      onOpenChange(false);
    },
  });

  if (!lead) return null;

  const createdDate = new Date(lead.created_at).toLocaleDateString("pt-BR");
  const lastInteraction = lead.last_interaction
    ? new Date(lead.last_interaction).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit",
      })
    : "—";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-lg">{lead.company_name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 mt-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{lead.niche} · {lead.city}</p>
            <p>Criado em: {createdDate}</p>
            <p>Última interação: {lastInteraction}</p>
          </div>

          <div className="flex gap-2">
            <a href={`https://wa.me/${lead.phone}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Phone className="w-3.5 h-3.5" /> WhatsApp
              </Button>
            </a>
            <a href={getPublicLeadSiteUrl(lead.slug)} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> Ver Site
              </Button>
            </a>
          </div>

          <GmbAnalysis lead={lead} />

          <LeadSuggestions lead={lead} />

          <div>
            <Label>Status do Lead</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {KANBAN_COLUMNS.map((col) => (
                  <SelectItem key={col.id} value={col.id}>{col.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Temperatura</Label>
            <Select value={temperature} onValueChange={setTemperature}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="quente">🔥 Quente</SelectItem>
                <SelectItem value="morno">🌤 Morno</SelectItem>
                <SelectItem value="frio">❄️ Frio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Valor do Serviço (R$)</Label>
            <Input
              type="number"
              value={serviceValue}
              onChange={(e) => setServiceValue(e.target.value)}
              placeholder="Ex: 500"
            />
          </div>

          <div>
            <Label>Status do Pagamento</Label>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status do Site</Label>
            <Select value={siteStatus} onValueChange={setSiteStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="nao_criado">Não criado</SelectItem>
                <SelectItem value="criado">Criado</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anotações sobre este lead..."
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm("Remover este lead permanentemente?")) deleteMutation.mutate();
              }}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetailSheet;
