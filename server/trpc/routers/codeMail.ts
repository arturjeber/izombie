import { throwTRPCError } from '@/lib/utilsTRPC';
import { EmailClient } from '@azure/communication-email';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const emailRouter = createTRPCRouter({
  sendEmail: publicProcedure.input(z.object({ to: z.email() })).mutation(async ({ ctx, input }) => {
    try {
      const client = new EmailClient(process.env.AZURE_EMAIL_CONNECTION_STRING!);

      const emailMessage = {
        senderAddress: `"iZombie Central" <${process.env.AZURE_EMAIL_SENDER}>`,
        content: {
          subject: 'iZombie activation code',
          plainText: 'Your code is: ',
          html: `<p>Your code is: </p>`,
        },
        recipients: { to: [{ address: input.to }] },
      };

      //const poller = await client.beginSend(emailMessage);
      const result = { status: 'Succeeded' }; ///await poller.pollUntilDone();

      if (result.status !== 'Succeeded') {
        throw throwTRPCError(`Falha no envio: ${result.status}`);
      }

      return { success: true };
    } catch (e) {
      console.log('error', e);
      throw throwTRPCError('Falha ao enviar o email');
    }
  }),
});
