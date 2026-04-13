/**
 * Formats a phone number for WhatsApp wa.me links.
 * Ensures the number starts with country code 55 (Brazil) and contains only digits.
 */
export function formatWhatsAppNumber(phone: string): string {
  const clean = phone.replace(/\D/g, "");
  return clean.startsWith("55") ? clean : `55${clean}`;
}

/**
 * Builds a full WhatsApp wa.me URL with properly encoded message.
 */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const num = formatWhatsAppNumber(phone);
  if (message) {
    return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${num}`;
}
