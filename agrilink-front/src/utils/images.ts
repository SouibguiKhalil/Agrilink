const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const apiOrigin = apiBase.replace(/\/api\/?$/, '');

export const resolveUploadUrl = (url?: string | null, fallback?: string) => {
  if (!url) return fallback;
  const normalized = url.startsWith('http')
    ? url
    : url.startsWith('/')
      ? url
      : `/${url}`;
  if (normalized.startsWith('/uploads')) return `${apiOrigin}${normalized}`;
  return normalized;
};
