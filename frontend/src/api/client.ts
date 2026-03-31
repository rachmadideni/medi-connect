const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
