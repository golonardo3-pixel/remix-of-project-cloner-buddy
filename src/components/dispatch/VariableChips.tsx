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
  { key: "{link}", label: "Link do site", fallback: "" },
  { key: "{cidade}", label: "Cidade", fallback: "" },
  { key: "{nicho}", label: "Nicho", fallback: "" },
];

function stripSpintaxBlocks(template: string): string {
  let result = template;
  let previous = "";

  while (result !== previous) {
    previous = result;
    result = result.replace(/\{[^{}]*\|[^{}]*\}/g, " ");
  }

  return result;
}

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

export function isSpintax(token: string): boolean {
  return /\|/.test(token);
}

export function validateTemplate(template: string): string[] {
  const warnings: string[] = [];
  const sanitizedTemplate = stripSpintaxBlocks(template);
  const found = sanitizedTemplate.match(/\{[^{}]+\}/g) || [];
  const validKeys = new Set(DISPATCH_VARIABLES.map((v) => v.key.toLowerCase()));
  const ignoredLegacyKeys = new Set(["{telefone}"]);

  for (const match of found) {
    if (ignoredLegacyKeys.has(match.toLowerCase())) continue;
    if (validKeys.has(match.toLowerCase())) continue;
    const inner = match.slice(1, -1).toLowerCase();
    const containsVar = DISPATCH_VARIABLES.some((v) => inner.includes(v.key.slice(1, -1).toLowerCase()));
    if (containsVar) continue;
    warnings.push(`Variável desconhecida: ${match}`);
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
