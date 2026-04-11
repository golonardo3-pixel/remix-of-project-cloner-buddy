import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layers, Eye, Loader2, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { generateAllVariations } from "@/lib/site-variations";
import { getPublicLeadSiteUrl } from "@/lib/public-site-url";
import type { Lead } from "@/components/KanbanBoard";
import { canonicalizeBusinessNiche } from "@/lib/niche-normalization";

interface Props {
  lead: Lead;
}

export default function SiteVariationGenerator({ lead }: Props) {
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const savedVariations = (lead as any).site_variations as any[] | null;
  const [localVariations, setLocalVariations] = useState<any[] | null>(null);
  const existingVariations = localVariations || savedVariations;

  const generateMutation = useMutation({
    mutationFn: async () => {
      setGenerating(true);
      const safeCity = (lead.city || "").replace(/n[aã]o\s+informad[ao]/gi, "").trim();
      const safeNiche = canonicalizeBusinessNiche(lead.niche) || lead.niche;
      const variations = generateAllVariations(lead.company_name, safeCity, safeNiche);
      const { error } = await supabase
        .from("leads")
        .update({
          site_variations: variations,
          site_status: lead.site_status === "nao_criado" ? "criado" : lead.site_status,
          last_interaction: new Date().toISOString(),
        } as any)
        .eq("id", lead.id);
      if (error) throw error;
      return variations;
    },
    onSuccess: (variations) => {
      setLocalVariations(variations);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: "5 variações de site geradas!" });
      setGenerating(false);
    },
    onError: () => {
      toast({ title: "Erro ao gerar variações", variant: "destructive" });
      setGenerating(false);
    },
  });

  const baseUrl = getPublicLeadSiteUrl(lead.slug);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Layers className="w-4 h-4" /> Variações de site
        </p>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-[11px] gap-1"
          onClick={() => generateMutation.mutate()}
          disabled={generating}
        >
          {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Layers className="w-3 h-3" />}
          {existingVariations ? "Regerar" : "Gerar variações"}
        </Button>
      </div>

      {existingVariations && existingVariations.length > 0 && (
        <div className="grid gap-2">
          {existingVariations.map((v: any, index: number) => {
            const url = `${baseUrl}?v=${v.id}`;
            return (
              <div
                key={v.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: `hsl(${v.colors.accent})` }}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{v.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {v.contentOverrides?.heroTitle || `Versão ${index + 1}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-[11px]"
                    onClick={() => {
                      navigator.clipboard.writeText(url);
                      toast({ title: `Link da versão \"${v.label}\" copiado!` });
                    }}
                  >
                    <Copy className="w-3 h-3" />
                    Copiar link
                  </Button>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-[11px]">
                      <Eye className="w-3 h-3" />
                      Ver site
                    </Button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
