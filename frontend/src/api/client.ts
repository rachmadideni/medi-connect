const API_BASE = import.meta.env.VITE_API_BASE_URL 
  || 'https://medi-connect-backend-236850333192.us-central1.run.app';

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
