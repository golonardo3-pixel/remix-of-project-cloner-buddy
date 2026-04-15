import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Chrome, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ExtensionDownload = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    fetch("/lovable-helper-pro.zip")
      .then((res) => {
        if (!res.ok) throw new Error(`Download falhou: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "lovable-helper-pro.zip";
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch((err) => alert(err.message));
  };

  const steps = [
    "Baixe o arquivo ZIP clicando no botão acima",
    "Descompacte o arquivo no seu computador",
    "Abra chrome://extensions no Chrome (ou edge://extensions no Edge)",
    "Ative o Modo Desenvolvedor (toggle no canto superior direito)",
    'Clique em "Carregar sem compactação" e selecione a pasta descompactada',
    "A extensão aparecerá na barra do navegador — pronta para usar!",
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-lg font-semibold text-foreground">
              Lovable Helper <span className="text-accent">Pro</span>
            </h1>
            <p className="text-muted-foreground text-xs">Extensão para Chrome e Edge</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader className="text-center pb-4">
            <Chrome className="w-12 h-12 mx-auto text-accent mb-2" />
            <CardTitle className="text-xl">Lovable Helper Pro</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Envie prompts prontos para o Lovable sem precisar digitar tudo no chat.
            </p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={handleDownload} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <Download className="w-4 h-4" />
              Baixar Extensão (.zip)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Como instalar</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recursos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <li>🚀 Envio rápido de prompts</li>
              <li>📋 5 templates prontos</li>
              <li>🕐 Histórico dos últimos 20</li>
              <li>🔄 Botão "usar novamente"</li>
              <li>📋 Copiar prompt</li>
              <li>🌙 Tema escuro</li>
              <li>✅ Feedback visual</li>
              <li>⌨️ Ctrl+Enter para enviar</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ExtensionDownload;