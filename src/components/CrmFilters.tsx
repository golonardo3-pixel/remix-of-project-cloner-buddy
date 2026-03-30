import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Search } from "lucide-react";
import { KANBAN_COLUMNS } from "./KanbanBoard";

export interface CrmFilterValues {
  search: string;
  niche: string;
  city: string;
  status: string;
  payment: string;
  siteStatus: string;
  temperature: string;
}

const EMPTY_FILTERS: CrmFilterValues = {
  search: "",
  niche: "",
  city: "",
  status: "",
  payment: "",
  siteStatus: "",
  temperature: "",
};

interface Props {
  filters: CrmFilterValues;
  onChange: (filters: CrmFilterValues) => void;
  niches: string[];
  cities: string[];
}

const CrmFilters = ({ filters, onChange, niches, cities }: Props) => {
  const [open, setOpen] = useState(false);

  const activeCount = Object.values(filters).filter((v) => v && v.length > 0).length;

  const update = (key: keyof CrmFilterValues, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const clear = () => onChange({ ...EMPTY_FILTERS });

  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar lead..."
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button
          variant={open ? "default" : "outline"}
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => setOpen(!open)}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filtros</span>
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {activeCount}
            </Badge>
          )}
        </Button>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clear} className="gap-1 text-muted-foreground">
            <X className="w-3.5 h-3.5" /> Limpar
          </Button>
        )}
      </div>

      {open && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 bg-muted/50 p-3 rounded-lg border border-border">
          <Select value={filters.niche} onValueChange={(v) => update("niche", v === "all" ? "" : v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Nicho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os nichos</SelectItem>
              {niches.map((n) => (
                <SelectItem key={n} value={n}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.city} onValueChange={(v) => update("city", v === "all" ? "" : v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(v) => update("status", v === "all" ? "" : v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {KANBAN_COLUMNS.map((col) => (
                <SelectItem key={col.id} value={col.id}>{col.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.payment} onValueChange={(v) => update("payment", v === "all" ? "" : v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.siteStatus} onValueChange={(v) => update("siteStatus", v === "all" ? "" : v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Site" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="nao_criado">Sem site</SelectItem>
              <SelectItem value="criado">Criado</SelectItem>
              <SelectItem value="enviado">Enviado</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.temperature} onValueChange={(v) => update("temperature", v === "all" ? "" : v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Temperatura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="quente">🔥 Quente</SelectItem>
              <SelectItem value="morno">🌤 Morno</SelectItem>
              <SelectItem value="frio">❄️ Frio</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export { EMPTY_FILTERS };
export default CrmFilters;
