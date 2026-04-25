const API_URL = import.meta.env.VITE_API_URL as string

async function request<T>(path: string, options: RequestInit, token: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Error inesperado')
  }
  return res.json()
}

export const api = {
  createMaterial: (body: unknown, token: string) =>
    request('/materials/create', { method: 'POST', body: JSON.stringify(body) }, token),

  evaluateMaterial: (body: unknown, token: string) =>
    request('/materials/evaluate', { method: 'POST', body: JSON.stringify(body) }, token),

  getSources: (token: string) =>
    request('/sources', { method: 'GET' }, token),
}
