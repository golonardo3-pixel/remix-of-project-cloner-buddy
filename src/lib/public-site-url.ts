const DEFAULT_PUBLISHED_URL = "https://clientesnogoogle.lovable.app";

const normalizeBaseUrl = (url: string) => url.replace(/\/$/, "");

export const getPublishedBaseUrl = () => {
  const envUrl = import.meta.env.VITE_PUBLIC_SITE_URL;
  return normalizeBaseUrl(envUrl || DEFAULT_PUBLISHED_URL);
};

export const getPublicLeadSiteUrl = (slug: string) => `${getPublishedBaseUrl()}/site/${slug}`;