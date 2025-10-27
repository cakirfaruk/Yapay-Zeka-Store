'use server';

import { revalidatePath } from 'next/cache';
import { getAdminEmail, getDeveloperEmail } from '../lib/session';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function callApi(path: string, method: string, email: string, body?: unknown) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-user-email': email,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error ${res.status}`);
  }
  return res.json();
}

function revalidateDashboards() {
  revalidatePath('/tr/developer');
  revalidatePath('/en/developer');
  revalidatePath('/tr/admin');
  revalidatePath('/en/admin');
  revalidatePath('/tr');
  revalidatePath('/en');
}

export async function submitForReview(appId: string) {
  const email = getDeveloperEmail();
  await callApi(`/apps/${appId}/submit-review`, 'POST', email);
  revalidateDashboards();
}

export async function requestChanges(appId: string, notes: string) {
  const email = getAdminEmail();
  await callApi(`/apps/${appId}/request-changes`, 'POST', email, { notes });
  revalidateDashboards();
}

export async function approveApp(appId: string) {
  const email = getAdminEmail();
  await callApi(`/apps/${appId}/approve`, 'POST', email);
  revalidateDashboards();
}
