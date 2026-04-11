import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import ImageUploadSection from "@/components/editor/ImageUploadSection";
import type { Lead } from "@/components/KanbanBoard";

interface Props {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VariationEditorSheet({ lead, open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const existingContent = (lead as any).site_content as any | null;

  const [companyName, setCompanyName] = useState(lead.company_name);
  const [city, setCity] = useState(lead.city);
  const [phone, setPhone] = useState(lead.phone);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState<{ title: string; desc: string }[]>([]);
  const [heroImage, setHeroImage] = useState<string | undefined>(undefined);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setCompanyName(lead.company_name);
    setCity(lead.city);
    setPhone(lead.phone);

    const c = existingContent || {};
    setHeroTitle(c.heroTitle || "");
    setHeroSubtitle(c.heroSubtitle || "");
    setDescription(c.aboutText || c.description || "");
    setServices(
      c.services && c.services.length > 0
        ? c.services.map((s: any) => ({ title: s.title || "", desc: s.desc || s.description || "" }))
        : [{ title: "", desc: "" }]
    );
    setHeroImage(c.heroImage || undefined);
    setGalleryImages(c.galleryImages || (lead as any).photos || []);
  }, [open, lead]);

  const updateService = (idx: number, field: "title" | "desc", value: string) => {
    setServices((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const addService = () => setServices((prev) => [...prev, { title: "", desc: "" }]);
  const removeService = (idx: number) => setServices((prev) => prev.filter((_, i) => i !== idx));

  const saveMutation = useMutation({
    mutationFn: async () => {
      const siteContent = {
        ...(existingContent || {}),
        heroTitle: heroTitle || undefined,
        heroSubtitle: heroSubtitle || undefined,
        aboutText: description || undefined,
        services: services.filter((s) => s.title.trim()),
        heroImage: heroImage || undefined,
        galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
      };

      const { error } = await supabase
        .from("leads")
        .update({
          company_name: companyName,
          city,
          phone,
          site_content: siteContent,
          photos: galleryImages.length > 0 ? galleryImages : null,
          last_interaction: new Date().toISOString(),
        } as any)
        .eq("id", lead.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: "Site atualizado com sucesso!" });
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-lg">Editar Site — {lead.company_name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 mt-4">
          {/* Basic info */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Dados do negócio</h3>
            <div>
              <Label>Nome do negócio</Label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div>
              <Label>Cidade</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </section>

          <Separator />

          {/* Content */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Textos do site</h3>
            <div>
              <Label>Título principal</Label>
              <Input
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Ex: Transforme seu visual hoje"
              />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Input
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Ex: Atendimento premium na sua cidade"
              />
            </div>
            <div>
              <Label>Descrição / Sobre</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição do negócio..."
                rows={3}
              />
            </div>
          </section>

          <Separator />

          {/* Services */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Serviços</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={addService}>
                <Plus className="w-3 h-3" /> Adicionar
              </Button>
            </div>
            {services.map((s, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="Nome do serviço"
                    value={s.title}
                    onChange={(e) => updateService(i, "title", e.target.value)}
                  />
                  <Input
                    placeholder="Descrição curta"
                    value={s.desc}
                    onChange={(e) => updateService(i, "desc", e.target.value)}
                  />
                </div>
                {services.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive shrink-0 mt-1"
                    onClick={() => removeService(i)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </section>

          <Separator />

          {/* Photos */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Fotos do site</h3>
            <p className="text-xs text-muted-foreground">
              Mínimo 5 imagens recomendadas. As fotos aparecem em todas as 5 variações.
            </p>
            <ImageUploadSection
              leadId={lead.id}
              heroImage={heroImage}
              galleryImages={galleryImages}
              onHeroChange={setHeroImage}
              onGalleryChange={setGalleryImages}
              hasInstagram={!!lead.instagram}
              hasGoogleMaps={!!lead.google_maps_url}
            />
          </section>

          <Separator />

          {/* Save */}
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saveMutation.isPending ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
