/**
 * @deprecated Substituído por src/lib/premium-prospecting.ts.
 * Mantido apenas como stub vazio para evitar quebras em imports legados.
 * Todas as variações antigas foram REMOVIDAS conforme exigido pelo cliente.
 */

export interface ConversationStage {
  id: string;
  label: string;
  description: string;
  templates: string[];
}

export const CONVERSATION_STAGES: ConversationStage[] = [];

export function getRandomTemplate(_stageId: string): string {
  return "";
}

export function buildFullFlowMessage(_stageIds: string[]): string {
  return "";
}
