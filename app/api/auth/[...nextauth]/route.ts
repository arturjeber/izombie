import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
export const runtime = 'nodejs'; // garante Node runtime
export const dynamic = "force-dynamic";
