import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getNicheContent, professionalizeName } from "@/lib/niche-content";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus, Trash2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { getPublicLeadSiteUrl } from "@/lib/public-site-url";
import type { SiteContentOverrides } from "@/lib/site-content-types";

const SiteEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: lead, isLoading } = useQuery({
    queryKey: ["lead-editor", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as any;
    },
    enabled: !!id,
  });

  const [form, setForm] = useState<SiteContentOverrides>({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!lead || initialized) return;
    const displayName = professionalizeName(lead.company_name, lead.niche);
    const defaults = getNicheContent(lead.niche, lead.city, displayName);
    const saved: SiteContentOverrides = lead.site_content || {};

    setForm({
      heroTitle: saved.heroTitle || displayName,
      heroSubtitle: saved.heroSubtitle || defaults.heroSubtitle,
      urgencyBadge: saved.urgencyBadge || defaults.urgencyBadge.replace("⚡ ", ""),
      ctaText: saved.ctaText || defaults.ctaText,
      whatsappMessage: saved.whatsappMessage || defaults.whatsappMessage,
      servicesTitle: saved.servicesTitle || "O que oferecemos",
      servicesSubtitle: saved.servicesSubtitle || "Toque no botão e pergunte sobre qualquer serviço",
      services: saved.services || (
        lead.services_list?.length > 0
          ? lead.services_list
          : defaults.services.map((s: any) => typeof s === "string" ? s : s.title)
      ),
      reviewsTitle: saved.reviewsTitle || "O que dizem nossos clientes",
      reviews: saved.reviews || defaults.reviews.map((r: any) => ({
        name: r.name,
        text: r.text,
        rating: r.rating,
      })),
      contactTitle: saved.contactTitle || `Fale diretamente com ${displayName}`,
      contactSubtitle: saved.contactSubtitle || "Sem formulário, sem espera. Atendimento direto e pessoal.",
      finalCtaTitle: saved.finalCtaTitle || "Não perca tempo!",
      finalCtaSubtitle: saved.finalCtaSubtitle || `Clique no botão abaixo e fale agora com ${displayName} em ${lead.city}. Atendimento imediato via WhatsApp.`,
      workingHours: saved.workingHours || "Seg a Sex: 9h às 20h · Sáb: 9h às 18h",
      benefits: saved.benefits || [
        { title: "Atendimento Imediato", desc: "Resposta na hora pelo WhatsApp" },
        { title: "Equipe Preparada", desc: `Profissionais de confiança em ${lead.city}` },
        { title: "Não Espere Piorar", desc: "Resolva hoje, não amanhã" },
        { title: "Serviço com Garantia", desc: "Trabalho profissional e seguro" },
      ],
    });
    setInitialized(true);
  }, [lead, initialized]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("leads")
        .update({ site_content: form } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead-editor", id] });
      queryClient.invalidateQueries({ queryKey: ["lead-site-conversion"] });
      toast({ title: "Site salvo com sucesso!" });
    },
    onError: () => toast({ title: "Erro ao salvar", variant: "destructive" }),
  });

  const updateField = (key: keyof SiteContentOverrides, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateService = (idx: number, value: string) => {
    const next = [...(form.services || [])];
    next[idx] = value;
    updateField("services", next);
  };

  const addService = () => updateField("services", [...(form.services || []), ""]);
  const removeService = (idx: number) => updateField("services", (form.services || []).filter((_, i) => i !== idx));

  const updateReview = (idx: number, key: string, value: any) => {
    const next = [...(form.reviews || [])];
    next[idx] = { ...next[idx], [key]: value };
    updateField("reviews", next);
  };

  const addReview = () => updateField("reviews", [...(form.reviews || []), { name: "", text: "", rating: 5 }]);
  const removeReview = (idx: number) => updateField("reviews", (form.reviews || []).filter((_, i) => i !== idx));

  const updateBenefit = (idx: number, key: string, value: string) => {
    const next = [...(form.benefits || [])];
    next[idx] = { ...next[idx], [key]: value };
    updateField("benefits", next);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse">Carregando editor...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Lead não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate("/crm")} className="gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>
          <h1 className="text-sm font-semibold text-foreground truncate mx-2">
            Editar: {lead.company_name}
          </h1>
          <div className="flex gap-2">
            <a href={getPublicLeadSiteUrl(lead.slug)} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> Preview
              </Button>
            </a>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              <Save className="w-3.5 h-3.5" />
              {saveMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {/* Hero */}
        <Section title="🎯 Hero Principal">
          <Field label="Título principal">
            <Input value={form.heroTitle || ""} onChange={(e) => updateField("heroTitle", e.target.value)} />
          </Field>
          <Field label="Subtítulo">
            <Textarea value={form.heroSubtitle || ""} onChange={(e) => updateField("heroSubtitle", e.target.value)} rows={2} />
          </Field>
          <Field label="Badge de urgência">
            <Input value={form.urgencyBadge || ""} onChange={(e) => updateField("urgencyBadge", e.target.value)} />
          </Field>
        </Section>

        {/* CTA */}
        <Section title="📱 Botão WhatsApp">
          <Field label="Texto do botão">
            <Input value={form.ctaText || ""} onChange={(e) => updateField("ctaText", e.target.value)} />
          </Field>
          <Field label="Mensagem automática do WhatsApp">
            <Textarea value={form.whatsappMessage || ""} onChange={(e) => updateField("whatsappMessage", e.target.value)} rows={3} />
          </Field>
        </Section>

        {/* Benefits */}
        <Section title="⭐ Benefícios">
          {(form.benefits || []).map((b, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start">
              <Input placeholder="Título" value={b.title} onChange={(e) => updateBenefit(i, "title", e.target.value)} />
              <Input placeholder="Descrição" value={b.desc} onChange={(e) => updateBenefit(i, "desc", e.target.value)} />
            </div>
          ))}
        </Section>

        {/* Services */}
        <Section title="🔧 Serviços">
          <Field label="Título da seção">
            <Input value={form.servicesTitle || ""} onChange={(e) => updateField("servicesTitle", e.target.value)} />
          </Field>
          <Field label="Subtítulo">
            <Input value={form.servicesSubtitle || ""} onChange={(e) => updateField("servicesSubtitle", e.target.value)} />
          </Field>
          <div className="space-y-2">
            {(form.services || []).map((s, i) => (
              <div key={i} className="flex gap-2">
                <Input value={s} onChange={(e) => updateService(i, e.target.value)} className="flex-1" />
                <Button variant="ghost" size="icon" className="shrink-0 text-destructive" onClick={() => removeService(i)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addService} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Adicionar serviço
            </Button>
          </div>
        </Section>

        {/* Reviews */}
        <Section title="💬 Depoimentos">
          <Field label="Título da seção">
            <Input value={form.reviewsTitle || ""} onChange={(e) => updateField("reviewsTitle", e.target.value)} />
          </Field>
          <div className="space-y-4">
            {(form.reviews || []).map((r, i) => (
              <div key={i} className="p-3 border border-border rounded-lg space-y-2 bg-card">
                <div className="flex gap-2">
                  <Input placeholder="Nome" value={r.name} onChange={(e) => updateReview(i, "name", e.target.value)} className="flex-1" />
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={r.rating}
                    onChange={(e) => updateReview(i, "rating", parseInt(e.target.value) || 5)}
                    className="w-16"
                  />
                  <Button variant="ghost" size="icon" className="shrink-0 text-destructive" onClick={() => removeReview(i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea placeholder="Texto do depoimento" value={r.text} onChange={(e) => updateReview(i, "text", e.target.value)} rows={2} />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addReview} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Adicionar depoimento
            </Button>
          </div>
        </Section>

        {/* Contact */}
        <Section title="📞 Contato">
          <Field label="Título">
            <Input value={form.contactTitle || ""} onChange={(e) => updateField("contactTitle", e.target.value)} />
          </Field>
          <Field label="Subtítulo">
            <Input value={form.contactSubtitle || ""} onChange={(e) => updateField("contactSubtitle", e.target.value)} />
          </Field>
          <Field label="Horário de funcionamento">
            <Input value={form.workingHours || ""} onChange={(e) => updateField("workingHours", e.target.value)} />
          </Field>
        </Section>

        {/* Final CTA */}
        <Section title="🚀 CTA Final">
          <Field label="Título">
            <Input value={form.finalCtaTitle || ""} onChange={(e) => updateField("finalCtaTitle", e.target.value)} />
          </Field>
          <Field label="Subtítulo">
            <Textarea value={form.finalCtaSubtitle || ""} onChange={(e) => updateField("finalCtaSubtitle", e.target.value)} rows={2} />
          </Field>
        </Section>

        {/* Save button at bottom */}
        <div className="pt-4 pb-8">
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
          >
            <Save className="w-5 h-5" />
            {saveMutation.isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </main>
    </div>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

export default SiteEditor;
