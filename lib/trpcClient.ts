// lib/trpcClient.ts
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server/trpc/router"; // router raiz
import superjson from "superjson";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({ url: "/api/trpc", transformer: superjson }),
  ],
});
