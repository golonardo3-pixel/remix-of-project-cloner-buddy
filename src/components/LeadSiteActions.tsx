import { ExternalLink, Copy, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { getPublicLeadSiteUrl } from "@/lib/public-site-url";

interface Props {
  slug: string;
  companyName: string;
}

const LeadSiteActions = ({ slug, companyName }: Props) => {
  const [copied, setCopied] = useState(false);
  const siteUrl = getPublicLeadSiteUrl(slug);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    toast({ title: "Link copiado!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Olá! Preparei o site da ${companyName} para você conferir: ${siteUrl}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-3 pt-2">
      <p className="text-sm text-muted-foreground">
        O site de <strong>{companyName}</strong> está pronto!
      </p>
      <div className="grid gap-2">
        <Button asChild className="w-full gap-2 bg-gold text-foreground hover:bg-gold/90">
          <a href={siteUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
            Abrir site
          </a>
        </Button>
        <Button variant="outline" className="w-full gap-2" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copiado!" : "Copiar link"}
        </Button>
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleWhatsApp}
          style={{ borderColor: "#25D366", color: "#25D366" }}
        >
          <MessageCircle className="w-4 h-4" />
          Enviar no WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default LeadSiteActions;
