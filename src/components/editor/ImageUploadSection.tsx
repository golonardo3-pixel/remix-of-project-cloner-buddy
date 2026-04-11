import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Trash2, Plus, Image as ImageIcon, Link, Instagram, MapPin, Star, GripVertical, ArrowUp } from "lucide-react";
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

  const setAsHero = (idx: number) => {
    onHeroChange(galleryImages[idx]);
    toast({ title: "Foto definida como principal!" });
  };

  const moveImage = (idx: number, direction: -1 | 1) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= galleryImages.length) return;
    const arr = [...galleryImages];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    onGalleryChange(arr);
  };

  return (
    <div className="space-y-6">
      {/* Hero Image */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">📸 Foto Principal (Hero)</label>
        {heroImage && (
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img src={heroImage} alt="Hero" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-2 left-2 text-xs text-white/80 bg-black/40 px-2 py-0.5 rounded">
              Foto principal do site
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
            {uploading ? "Enviando..." : "Trocar foto principal"}
          </Button>
        </div>
      </div>

      {/* Gallery */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">
          🖼️ Fotos do Negócio ({galleryImages.length})
        </label>
        <p className="text-xs text-muted-foreground">
          Adicione de 4 a 8 fotos para um site profissional. Você pode reordenar e definir a foto principal.
        </p>

        {galleryImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {galleryImages.map((url, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-border aspect-square bg-muted">
                <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => setAsHero(i)}
                    className="p-1.5 rounded-full bg-white/90 text-amber-600 hover:bg-white transition-colors"
                    title="Definir como foto principal"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                  {i > 0 && (
                    <button
                      onClick={() => moveImage(i, -1)}
                      className="p-1.5 rounded-full bg-white/90 text-foreground hover:bg-white transition-colors"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => removeGalleryImage(i)}
                    className="p-1.5 rounded-full bg-white/90 text-destructive hover:bg-white transition-colors"
                    title="Remover foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Position badge */}
                <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {i + 1}
                </span>
                {heroImage === url && (
                  <span className="absolute top-1.5 right-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5" /> Principal
                  </span>
                )}
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
            {uploading ? "Enviando..." : "Adicionar fotos"}
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
