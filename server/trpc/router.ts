import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { messageRouter } from "./routers/message";

export const appRouter = createTRPCRouter({
  user: userRouter,
	message: messageRouter,
});

export type AppRouter = typeof appRouter;
