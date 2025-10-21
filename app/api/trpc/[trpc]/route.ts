// app/api/trpc/[trpc]/route.ts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { createContext } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
    responseMeta() {
      return {};
    },
  });
};

export { handler as GET, handler as POST };
