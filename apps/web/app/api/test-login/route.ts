import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const locale = searchParams.get('locale') ?? 'tr';
  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 });
  }
  const response = NextResponse.redirect(new URL(`/${locale}`, request.url));
  response.cookies.set('market-user', email, { path: '/', httpOnly: false });
  return response;
}
