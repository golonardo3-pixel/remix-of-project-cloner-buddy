const DEFAULT_PUBLISHED_URL = "https://clientesnogoogle.lovable.app";

const normalizeBaseUrl = (url: string) => url.replace(/\/$/, "");

const isBlockedRuntimeUrl = (url: string) => {
  const normalized = url.trim().toLowerCase();

  return (
    !normalized ||
    normalized.includes("id-preview--") ||
    normalized.includes("localhost") ||
    normalized.includes("127.0.0.1")
  );
};

export const getPublishedBaseUrl = () => {
  const envUrl = import.meta.env.VITE_PUBLIC_SITE_URL;

  if (envUrl && !isBlockedRuntimeUrl(envUrl)) {
    return normalizeBaseUrl(envUrl);
  }

  return DEFAULT_PUBLISHED_URL;
};

export const getPublicLeadSiteUrl = (slug: string) => `${getPublishedBaseUrl()}/site/${slug}`;