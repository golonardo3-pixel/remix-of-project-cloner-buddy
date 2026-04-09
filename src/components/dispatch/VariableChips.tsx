import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export interface VariableInfo {
  key: string;
  label: string;
  fallback: string;
}

export const DISPATCH_VARIABLES: VariableInfo[] = [
  { key: "{nome}", label: "Nome", fallback: "tudo bem" },
  { key: "{empresa}", label: "Empresa", fallback: "seu negócio" },
  { key: "{telefone}", label: "Telefone", fallback: "" },
  { key: "{link}", label: "Link do site", fallback: "" },
  { key: "{cidade}", label: "Cidade", fallback: "" },
  { key: "{nicho}", label: "Nicho", fallback: "" },
];

export function applyVariables(
  template: string,
  values: Record<string, string>
): string {
  let result = template;
  for (const v of DISPATCH_VARIABLES) {
    const raw = values[v.key] ?? "";
    const value = raw.trim() || v.fallback;
    result = result.replace(new RegExp(v.key.replace(/[{}]/g, "\\$&"), "gi"), value);
  }
  return result;
}

export function validateTemplate(template: string): string[] {
  const warnings: string[] = [];
  const found = template.match(/\{[^}]+\}/g) || [];
  const validKeys = new Set(DISPATCH_VARIABLES.map((v) => v.key.toLowerCase()));
  for (const match of found) {
    if (!validKeys.has(match.toLowerCase())) {
      warnings.push(`Variável desconhecida: ${match}`);
    }
  }
  return warnings;
}

interface Props {
  onInsert: (variable: string) => void;
  disabled?: boolean;
}

const VariableChips = ({ onInsert, disabled }: Props) => {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">
        Toque para inserir variável:
      </Label>
      <div className="flex flex-wrap gap-1.5">
        {DISPATCH_VARIABLES.map((v) => (
          <Badge
            key={v.key}
            variant="secondary"
            className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors select-none text-xs"
            onClick={() => !disabled && onInsert(v.key)}
          >
            {v.key}
            {v.fallback && (
              <span className="ml-1 opacity-50">→ {v.fallback}</span>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default VariableChips;
