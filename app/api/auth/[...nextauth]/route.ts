//api/auth/[...nextauth]/route.ts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // garante Node runtime

import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
