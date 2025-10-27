const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (init?.headers) {
    if (init.headers instanceof Headers) {
      init.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, init.headers as Record<string, string>);
    }
  }
  if (!headers['x-user-email'] && process.env.NEXT_PUBLIC_TEST_USER) {
    headers['x-user-email'] = process.env.NEXT_PUBLIC_TEST_USER;
  }
  const res = await fetch(`${API_URL}${input}`, {
    ...init,
    headers,
    cache: init?.cache ?? 'no-store',
    next: { revalidate: init?.next?.revalidate ?? 30 },
  });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }
  return res.json();
}

export async function listApps(params: { search?: string; locale?: string; email?: string } = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  const headers: Record<string, string> = {};
  if (params.email) headers['x-user-email'] = params.email;
  const qs = query.toString();
  const endpoint = qs ? `/apps?${qs}` : '/apps';
  const json = await fetchJson<{ items: any[] }>(endpoint, { headers });
  return json.items;
}

export async function getApp(slug: string) {
  return fetchJson(`/apps/${slug}`);
}

export async function listDevices(email: string) {
  return fetchJson(`/devices`, {
    headers: { 'x-user-email': email },
  });
}

export async function createCheckout(email: string, appId: string, deviceId?: string) {
  return fetchJson(`/checkout/session`, {
    method: 'POST',
    body: JSON.stringify({ appId, deviceId }),
    headers: { 'x-user-email': email },
  });
}

export async function claimDevice(email: string) {
  return fetchJson(`/devices/claim`, {
    method: 'POST',
    headers: { 'x-user-email': email },
  });
}

export async function createDeployment(email: string, deviceId: string, appVersionId: string) {
  return fetchJson(`/devices/${deviceId}/deploy`, {
    method: 'POST',
    body: JSON.stringify({ appVersionId }),
    headers: { 'x-user-email': email },
  });
}

export async function getReviewQueue(email: string) {
  const { items } = await fetchJson<{ items: any[] }>(`/admin/review-queue`, {
    headers: { 'x-user-email': email },
  });
  return items;
}
