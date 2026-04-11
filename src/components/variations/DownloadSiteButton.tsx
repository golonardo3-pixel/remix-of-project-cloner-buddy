import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { downloadStaticHTML } from "@/lib/site-export";
import { toast } from "@/hooks/use-toast";

interface Props {
  lead: any;
  accent?: string;
}

const DownloadSiteButton = ({ lead, accent = "#25D366" }: Props) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadStaticHTML(lead);
      toast({ title: "Download iniciado!" });
    } catch {
      toast({ title: "Erro ao baixar", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-wait"
      style={{
        background: accent,
        color: "#fff",
        boxShadow: `0 4px 16px ${accent}44`,
      }}
    >
      {downloading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {downloading ? "Preparando..." : "Baixar Site"}
    </button>
  );
};

export default DownloadSiteButton;
