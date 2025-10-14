import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { messageRouter } from "./routers/message";
import { authRouter } from "./routers/auth";
import { emailRouter } from "./routers/codeMail";
import { mapRouter } from "./routers/map";

export const appRouter = createTRPCRouter({
  user: userRouter,
	message: messageRouter,
	auth: authRouter,
	email: emailRouter,
	map: mapRouter

});

export type AppRouter = typeof appRouter;
