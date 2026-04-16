/**
 * Persistent message history stored in localStorage.
 */

const HISTORY_KEY = "dispatch_message_history";
const MAX_HISTORY = 50;

export interface MessageHistoryEntry {
  id: string;
  text: string;
  leadName: string;
  timestamp: string;
}

export function getMessageHistory(): MessageHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToMessageHistory(entry: Omit<MessageHistoryEntry, "id">) {
  const history = getMessageHistory();
  const newEntry: MessageHistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
  };
  history.unshift(newEntry);
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearMessageHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
