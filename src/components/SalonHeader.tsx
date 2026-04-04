import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "5511999999999";
const WHATSAPP_MSG = encodeURIComponent("Olá! Gostaria de agendar um horário.");

const SalonHeader = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
    <div className="flex items-center justify-center px-5 py-3 max-w-5xl mx-auto">
      <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
        Studio <span className="text-gold">Élise</span>
      </h1>
    </div>
  </header>
);

export default SalonHeader;
