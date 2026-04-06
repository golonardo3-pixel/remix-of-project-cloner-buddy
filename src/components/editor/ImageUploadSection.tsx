import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Trash2, Plus, Image as ImageIcon, Link, Instagram, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImageUploadSectionProps {
  leadId: string;
  heroImage: string | undefined;
  galleryImages: string[];
  onHeroChange: (url: string) => void;
  onGalleryChange: (urls: string[]) => void;
  hasInstagram: boolean;
  hasGoogleMaps: boolean;
}

const ImageUploadSection = ({
  leadId,
  heroImage,
  galleryImages,
  onHeroChange,
  onGalleryChange,
  hasInstagram,
  hasGoogleMaps,
}: ImageUploadSectionProps) => {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${leadId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("lead-photos").upload(path, file);
    if (error) {
      console.error("Upload error:", error);
      return null;
    }
    const { data: pub } = supabase.storage.from("lead-photos").getPublicUrl(path);
    return pub.publicUrl;
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    if (url) {
      onHeroChange(url);
      toast({ title: "Imagem do hero atualizada!" });
    } else {
      toast({ title: "Erro no upload", variant: "destructive" });
    }
    setUploading(false);
    if (heroInputRef.current) heroInputRef.current.value = "";
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadFile(file);
      if (url) newUrls.push(url);
    }
    if (newUrls.length > 0) {
      const existing = new Set(galleryImages);
      const unique = newUrls.filter((u) => !existing.has(u));
      onGalleryChange([...galleryImages, ...unique]);
      toast({ title: `${unique.length} imagem(ns) adicionada(s)!` });
    }
    setUploading(false);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const addImageByUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (galleryImages.includes(url)) {
      toast({ title: "Imagem já existe na galeria", variant: "destructive" });
      return;
    }
    onGalleryChange([...galleryImages, url]);
    setUrlInput("");
    toast({ title: "Imagem adicionada por URL!" });
  };

  const removeGalleryImage = (idx: number) => {
    onGalleryChange(galleryImages.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      {/* Hero Image */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">Imagem do Hero</label>
        {heroImage && (
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img src={heroImage} alt="Hero" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-2 left-2 text-xs text-white/80 bg-black/40 px-2 py-0.5 rounded">
              Preview com máscara escura
            </span>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <input
            ref={heroInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleHeroUpload}
          />
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => heroInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="w-3.5 h-3.5" />
            {uploading ? "Enviando..." : "Upload de imagem"}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 opacity-50" disabled title="Em breve: buscar fotos do Google Maps">
            <MapPin className="w-3.5 h-3.5" />
            Google Maps
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 opacity-50"
            disabled
            title={hasInstagram ? "Em breve: buscar fotos do Instagram" : "Instagram não configurado"}
          >
            <Instagram className="w-3.5 h-3.5" />
            Instagram
          </Button>
        </div>
      </div>

      {/* Gallery */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">
          Galeria de Imagens ({galleryImages.length})
        </label>

        {galleryImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {galleryImages.map((url, i) => (
              <div key={i} className="relative group rounded overflow-hidden border border-border aspect-square">
                <img src={url} alt={`Galeria ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeGalleryImage(i)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleGalleryUpload}
          />
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploading}
          >
            <Plus className="w-3.5 h-3.5" />
            {uploading ? "Enviando..." : "Upload múltiplo"}
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Colar URL de imagem..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addImageByUrl()}
            className="flex-1"
          />
          <Button variant="outline" size="sm" onClick={addImageByUrl} className="gap-1.5 shrink-0">
            <Link className="w-3.5 h-3.5" /> Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadSection;
