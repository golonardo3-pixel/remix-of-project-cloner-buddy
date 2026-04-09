import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileSpreadsheet, Download, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface SheetRow {
  nome?: string;
  empresa?: string;
  telefone?: string;
  cidade?: string;
  nicho?: string;
  link?: string;
  [key: string]: string | undefined;
}

const COLUMN_MAP: Record<string, string> = {
  nome: "company_name",
  name: "company_name",
  empresa: "company_name",
  company: "company_name",
  telefone: "phone",
  phone: "phone",
  whatsapp: "phone",
  cel: "phone",
  celular: "phone",
  cidade: "city",
  city: "city",
  nicho: "niche",
  niche: "niche",
  segmento: "niche",
  categoria: "niche",
  link: "slug",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractSheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  return match?.[1] ?? null;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(current.trim());
        current = "";
      } else if (ch === "\n" || (ch === "\r" && text[i + 1] === "\n")) {
        row.push(current.trim());
        if (row.some((c) => c)) rows.push(row);
        row = [];
        current = "";
        if (ch === "\r") i++;
      } else {
        current += ch;
      }
    }
  }
  row.push(current.trim());
  if (row.some((c) => c)) rows.push(row);
  return rows;
}

const GoogleSheetsImport = () => {
  const queryClient = useQueryClient();
  const [sheetUrl, setSheetUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<SheetRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const fetchSheet = async () => {
    setError(null);
    const sheetId = extractSheetId(sheetUrl);
    if (!sheetId) {
      setError("Link inválido. Cole o link completo da planilha do Google Sheets.");
      return;
    }

    setLoading(true);
    try {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      const res = await fetch(csvUrl);
      if (!res.ok) {
        throw new Error("Não foi possível acessar a planilha. Verifique se ela está pública.");
      }
      const text = await res.text();
      const rows = parseCSV(text);
      if (rows.length < 2) {
        throw new Error("A planilha está vazia ou tem apenas cabeçalho.");
      }

      const rawHeaders = rows[0].map((h) => h.toLowerCase().trim());
      setHeaders(rawHeaders);

      const dataRows = rows.slice(1).map((row) => {
        const obj: SheetRow = {};
        rawHeaders.forEach((h, i) => {
          obj[h] = row[i] || "";
        });
        return obj;
      });

      setParsedRows(dataRows);
      setPreviewOpen(true);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar planilha.");
    } finally {
      setLoading(false);
    }
  };

  const importMutation = useMutation({
    mutationFn: async (rows: SheetRow[]) => {
      const leads = rows
        .filter((r) => {
          const phone = findField(r, ["telefone", "phone", "whatsapp", "cel", "celular"]);
          return phone && phone.replace(/\D/g, "").length >= 8;
        })
        .map((r) => {
          const name = findField(r, ["nome", "name", "empresa", "company"]) || "Lead Importado";
          const phone = findField(r, ["telefone", "phone", "whatsapp", "cel", "celular"]) || "";
          const city = findField(r, ["cidade", "city"]) || "Não informada";
          const niche = findField(r, ["nicho", "niche", "segmento", "categoria"]) || "Outro";
          return {
            company_name: name,
            phone,
            city,
            niche,
            slug: slugify(name),
          };
        });

      if (!leads.length) throw new Error("Nenhum lead válido encontrado (telefone obrigatório).");

      const { error } = await supabase.from("leads").insert(leads);
      if (error) throw error;
      return leads.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setPreviewOpen(false);
      setParsedRows([]);
      setSheetUrl("");
      toast({ title: `${count} leads importados com sucesso!` });
    },
    onError: (err: any) => {
      toast({
        title: "Erro ao importar",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const findField = (row: SheetRow, keys: string[]): string => {
    for (const k of keys) {
      for (const h of headers) {
        if (h.includes(k) && row[h]) return row[h]!;
      }
    }
    return "";
  };

  const validCount = parsedRows.filter((r) => {
    const phone = findField(r, ["telefone", "phone", "whatsapp", "cel", "celular"]);
    return phone && phone.replace(/\D/g, "").length >= 8;
  }).length;

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" /> Importar do Google Sheets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs">Cole o link da planilha (deve estar pública)</Label>
            <div className="flex gap-2">
              <Input
                value={sheetUrl}
                onChange={(e) => {
                  setSheetUrl(e.target.value);
                  setError(null);
                }}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="text-sm"
              />
              <Button
                onClick={fetchSheet}
                disabled={!sheetUrl.trim() || loading}
                size="sm"
                className="shrink-0 gap-1.5"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Carregar
              </Button>
            </div>
          </div>
          {error && (
            <div className="flex items-start gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Colunas reconhecidas: nome, empresa, telefone, cidade, nicho
          </p>
        </CardContent>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Pré-visualização ({parsedRows.length} linhas)
            </DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {validCount} válidos
            </Badge>
            {parsedRows.length - validCount > 0 && (
              <Badge variant="destructive">
                <AlertCircle className="w-3 h-3 mr-1" />
                {parsedRows.length - validCount} sem telefone
              </Badge>
            )}
          </div>

          <div className="overflow-auto flex-1 border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.slice(0, 6).map((h) => (
                    <TableHead key={h} className="text-xs whitespace-nowrap">
                      {h}
                      {COLUMN_MAP[h] && (
                        <span className="text-accent ml-1">→ {COLUMN_MAP[h]}</span>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedRows.slice(0, 20).map((row, i) => (
                  <TableRow key={i}>
                    {headers.slice(0, 6).map((h) => (
                      <TableCell key={h} className="text-xs py-1.5">
                        {row[h] || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {parsedRows.length > 20 && (
                  <TableRow>
                    <TableCell
                      colSpan={Math.min(headers.length, 6)}
                      className="text-center text-xs text-muted-foreground"
                    >
                      ... e mais {parsedRows.length - 20} linhas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => importMutation.mutate(parsedRows)}
              disabled={validCount === 0 || importMutation.isPending}
              className="gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {importMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Importar {validCount} leads
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoogleSheetsImport;
