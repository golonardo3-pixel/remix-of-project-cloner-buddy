const DEFAULT_PUBLISHED_URL = "https://clientesnogoogle.lovable.app";

const normalizeBaseUrl = (url: string) => url.replace(/\/$/, "");

export const getPublishedBaseUrl = () => {
  const envUrl = import.meta.env.VITE_PUBLIC_SITE_URL;
  const configuredBaseUrl = normalizeBaseUrl(envUrl || DEFAULT_PUBLISHED_URL);

  if (typeof window !== "undefined") {
    const currentOrigin = normalizeBaseUrl(window.location.origin);
    if (currentOrigin && currentOrigin !== configuredBaseUrl) {
      return currentOrigin;
    }
  }

  return configuredBaseUrl;
};

export const getPublicLeadSiteUrl = (slug: string) => `${getPublishedBaseUrl()}/site/${slug}`;