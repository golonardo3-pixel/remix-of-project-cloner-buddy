import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { availableNiches } from "@/lib/niche-content";
import LeadSiteActions from "./LeadSiteActions";
import { Upload, X, ImageIcon } from "lucide-react";

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

function phoneToWhatsApp(phone: string): string {
  return "55" + phone.replace(/\D/g, "");
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddLeadDialog = ({ open, onOpenChange }: Props) => {
  const [companyName, setCompanyName] = useState("");
  const [niche, setNiche] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [instagram, setInstagram] = useState("");
  const [servicesList, setServicesList] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 10) {
      toast({ title: "Máximo de 10 fotos", variant: "destructive" });
      return;
    }
    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadPhotos = async (slug: string): Promise<string[]> => {
    const urls: string[] = [];
    for (let i = 0; i < photos.length; i++) {
      const file = photos[i];
      const ext = file.name.split(".").pop();
      const path = `${slug}/${Date.now()}-${i}.${ext}`;
      const { error } = await supabase.storage
        .from("lead-photos")
        .upload(path, file);
      if (error) {
        console.error("Upload error:", error);
        continue;
      }
      const { data: urlData } = supabase.storage
        .from("lead-photos")
        .getPublicUrl(path);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const slug = slugify(companyName);
      const whatsappPhone = phoneToWhatsApp(phone);
      setUploading(true);

      // Upload photos if any
      let photoUrls: string[] = [];
      if (photos.length > 0) {
        photoUrls = await uploadPhotos(slug);
      }

      const servicesArray = servicesList
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const { error } = await supabase.from("leads").insert({
        company_name: companyName.trim(),
        niche: niche.trim(),
        city: city.trim(),
        phone: whatsappPhone,
        slug,
        google_maps_url: googleMapsUrl.trim() || null,
        instagram: instagram.trim() || null,
        services_list: servicesArray.length > 0 ? servicesArray : null,
        description: description.trim() || null,
        photos: photoUrls.length > 0 ? photoUrls : null,
      } as any);
      if (error) throw error;
      setUploading(false);
      return slug;
    },
    onSuccess: (slug) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: "Site gerado com sucesso!" });
      setCreatedSlug(slug);
    },
    onError: (err: Error) => {
      setUploading(false);
      toast({
        title: "Erro ao gerar site",
        description: err.message.includes("duplicate")
          ? "Já existe um lead com esse nome."
          : err.message,
        variant: "destructive",
      });
    },
  });

  const handleClose = (val: boolean) => {
    if (!val) {
      setCompanyName("");
      setNiche("");
      setCity("");
      setPhone("");
      setGoogleMapsUrl("");
      setInstagram("");
      setServicesList("");
      setDescription("");
      photoPreviews.forEach((p) => URL.revokeObjectURL(p));
      setPhotos([]);
      setPhotoPreviews([]);
      setCreatedSlug(null);
    }
    onOpenChange(val);
  };

  const isValid = companyName.trim() && niche && city.trim() && phone.replace(/\D/g, "").length >= 10;

  if (createdSlug) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Site Gerado! 🎉</DialogTitle>
          </DialogHeader>
          <LeadSiteActions slug={createdSlug} companyName={companyName} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Novo Lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {/* Required fields */}
          <div>
            <Label htmlFor="company">Nome da empresa *</Label>
            <Input
              id="company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Studio Élise"
            />
          </div>
          <div>
            <Label htmlFor="niche">Nicho *</Label>
            <Select value={niche} onValueChange={setNiche}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nicho" />
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
          <div>
            <Label htmlFor="city">Cidade *</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Campinas, SP"
            />
          </div>
          <div>
            <Label htmlFor="phone">WhatsApp *</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(11) 99999-9999"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-3">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">Campos opcionais</p>
          </div>

          {/* Optional fields */}
          <div>
            <Label htmlFor="gmb">Link do Google Meu Negócio</Label>
            <Input
              id="gmb"
              value={googleMapsUrl}
              onChange={(e) => setGoogleMapsUrl(e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@seuinstagram"
            />
          </div>
          <div>
            <Label htmlFor="services">Serviços principais</Label>
            <Input
              id="services"
              value={servicesList}
              onChange={(e) => setServicesList(e.target.value)}
              placeholder="Ex: Corte, Escova, Coloração (separados por vírgula)"
            />
            <p className="text-xs text-muted-foreground mt-1">Separe os serviços por vírgula</p>
          </div>
          <div>
            <Label htmlFor="description">Descrição do negócio</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conte um pouco sobre o negócio..."
              rows={3}
            />
          </div>

          {/* Photo upload */}
          <div>
            <Label>Fotos do negócio</Label>
            <div className="mt-2">
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {photoPreviews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-border">
                      <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label
                htmlFor="photo-upload"
                className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-muted-foreground/50 transition-colors"
              >
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {photos.length > 0
                    ? `${photos.length}/10 fotos selecionadas`
                    : "Clique para adicionar fotos"}
                </span>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoAdd}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-muted-foreground mt-1">Até 10 fotos. As fotos serão priorizadas na galeria do site.</p>
            </div>
          </div>

          <Button
            onClick={() => mutation.mutate()}
            disabled={!isValid || mutation.isPending || uploading}
            className="w-full bg-gold text-foreground hover:bg-gold/90"
          >
            {uploading ? "Enviando fotos..." : mutation.isPending ? "Gerando site..." : "🚀 Gerar Site"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadDialog;
