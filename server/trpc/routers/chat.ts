import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

type Message = {
  id: string;
  user: string;
  text: string;
  timestamp: number;
};

const messages: Message[] = [];

export const chatRouter = createTRPCRouter({
  send: publicProcedure
    .input(
      z.object({
        user: z.string(),
        text: z.string().min(1).max(200),
      })
    )
    .mutation(({ input }) => {
      const now = Date.now();
      const lastMessage = messages
        .filter((m) => m.user === input.user)
        .sort((a, b) => b.timestamp - a.timestamp)[0];

      if (lastMessage && now - lastMessage.timestamp < 5000) {
        throw new Error("Espere 5 segundos antes de enviar outra mensagem");
      }

      const message: Message = {
        id: Math.random().toString(36).substring(2),
        user: input.user,
        text: input.text,
        timestamp: now,
      };

      messages.push(message);

      // Remove mensagens com mais de 20s
      const twentySecondsAgo = now - 20_000;
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].timestamp < twentySecondsAgo) {
          messages.splice(i, 1);
        }
      }

      return message;
    }),

  getMessages: publicProcedure.query(() => {
    const now = Date.now();
    return messages.filter((m) => now - m.timestamp <= 20_000);
  }),
});
