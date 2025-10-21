// lib/api-protect.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function withAuth(req: Request, handler: (token: any) => Promise<Response>) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return handler(token);
}
