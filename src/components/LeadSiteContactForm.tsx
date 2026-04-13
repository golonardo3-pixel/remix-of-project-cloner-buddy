import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface LeadSiteContactFormProps {
  phone: string;
  companyName: string;
  services?: string[];
  colors: {
    primary: string;
    primaryForeground: string;
    accent: string;
    secondary: string;
  };
}

const LeadSiteContactForm = ({ phone, companyName, services, colors }: LeadSiteContactFormProps) => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parts = [
      `Olá! Me chamo ${name.trim()}.`,
      service ? `Tenho interesse no serviço: ${service}.` : "",
      message.trim() ? message.trim() : "",
      `Meu WhatsApp: ${whatsapp}`,
      `Encontrei vocês pelo site.`,
    ].filter(Boolean);

    window.open(buildWhatsAppUrl(phone, parts.join("\n")), "_blank");
  };

  const isValid = name.trim() && whatsapp.replace(/\D/g, "").length >= 10;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Nome *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          required
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 text-sm"
          style={{ ["--tw-ring-color" as string]: `hsl(${colors.accent})` }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">WhatsApp *</label>
        <input
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="(11) 99999-9999"
          required
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 text-sm"
          style={{ ["--tw-ring-color" as string]: `hsl(${colors.accent})` }}
        />
      </div>
      {services && services.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Serviço desejado</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 text-sm"
            style={{ ["--tw-ring-color" as string]: `hsl(${colors.accent})` }}
          >
            <option value="">Selecione um serviço</option>
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Mensagem</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Como podemos ajudar?"
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 text-sm resize-none"
          style={{ ["--tw-ring-color" as string]: `hsl(${colors.accent})` }}
        />
      </div>
      <button
        type="submit"
        disabled={!isValid}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold rounded-lg transition-all hover:brightness-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "#25D366",
          color: "#fff",
        }}
      >
        <MessageCircle className="w-5 h-5" />
        Chamar no WhatsApp agora
      </button>
    </form>
  );
};

export default LeadSiteContactForm;
