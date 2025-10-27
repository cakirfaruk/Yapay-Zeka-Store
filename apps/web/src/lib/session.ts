import { cookies } from 'next/headers';

function readCookie(fallback: string) {
  const store = cookies();
  return store.get('market-user')?.value ?? fallback;
}

export function getBuyerEmail() {
  return readCookie(process.env.NEXT_PUBLIC_TEST_USER ?? 'buyer@example.com');
}

export function getDeveloperEmail() {
  return process.env.NEXT_PUBLIC_DEV_USER ?? 'dev@example.com';
}

export function getAdminEmail() {
  return process.env.NEXT_PUBLIC_ADMIN_USER ?? 'admin@example.com';
}
