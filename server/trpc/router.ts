import { createTRPCRouter } from './trpc';
import { userRouter } from './routers/user';
import { messageRouter } from './routers/message';
import { authRouter } from './routers/auth';
import { emailRouter } from './routers/codeMail';
import { mapRouter } from './routers/map';
import { chatRouter } from './routers/chat';
import { qrRouter } from './routers/qr';

export const appRouter = createTRPCRouter({
  user: userRouter,
  message: messageRouter,
  auth: authRouter,
  email: emailRouter,
  map: mapRouter,
  chat: chatRouter,
	qrRead: qrRouter,
});

export type AppRouter = typeof appRouter;
