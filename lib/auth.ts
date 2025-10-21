// auth.ts
export const dynamic = 'force-dynamic';


import { getPrisma } from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { EmailClient } from '@azure/communication-email';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import type { Session } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import authConfig from './auth.config';

const ACCESS_TOKEN_LIFETIME = 60 * 15; // 15 min
const REFRESH_TOKEN_LIFETIME = 60 * 60 * 24 * 7; // 7 dias

const emailClient = new EmailClient(process.env.AZURE_EMAIL_CONNECTION_STRING ?? '');

export const { auth, handlers, signIn, signOut } = NextAuth({
	trustHost: true, // importante para Azure
  adapter: process.env.DATABASE_URL ? PrismaAdapter(getPrisma()) : undefined,
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@exemplo.com' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const prisma = getPrisma();

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios.');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new Error('Usuário não encontrado.');
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password);

        if (!isValid) throw new Error('Senha incorreta.');

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
          tokenVersion: user.tokenVersion ?? 0,
        };
      },
    }),
    Credentials({
      id: 'email-code',
      name: 'Email + Código',
      credentials: {
        email: { label: 'Email', type: 'email' },
        code: { label: 'Código', type: 'text' },
        name: { label: 'Código', type: 'text' },
        pass: { label: 'Código', type: 'password' },
      },
      async authorize({ email, name, pass, code }) {
        const prisma = getPrisma();

        const record = await prisma.verificationToken.findFirst({
          where: { identifier: email as string },
          orderBy: { expires: 'desc' }, // ← pega o mais recente
        });

        if (!record) return null;

        const isValid = await bcrypt.compare(code as string, record.token);

        if (!isValid) throw new Error('Invalid code');

        let user = await prisma.user.findUnique({ where: { email: email as string } });

        if (user) throw new Error('User exists');

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: email as string,
              name: name as string,
              password: await bcrypt.hash(pass as string, 10),
              emailVerified: new Date(),
            },
          });

          await prisma.player.create({ data: { userId: user.id } });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
          tokenVersion: user.tokenVersion ?? 0,
        };
      },
    }),
    Credentials({
      id: 'email-request',
      name: 'Email request code',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize({ email }) {
        if (!email) throw new Error('Email é obrigatório');
        const prisma = getPrisma();

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.verificationToken.create({
          data: {
            identifier: email as string,
            token: await bcrypt.hash(code, 10),
            expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos
          },
        });

        // envia o e-mail via Azure
        const message = {
          senderAddress: process.env.EMAIL_FROM ?? '',
          content: {
            subject: 'iZombie - Validation code',
            plainText: `Your validation code is: ${code}\nExpires in 10 minutes.`,
            html: `<p>Your validation code is: <b>${code}</b></p><p>Expires in 10 minutes.</p>`,
          },
          recipients: { to: [{ address: email as string }] },
        };

        const poller = await emailClient.beginSend(message);
        await poller.pollUntilDone();

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const now = Math.floor(Date.now() / 1000);

      if (user) {
        const typedUser = user as typeof user & {
          tokenVersion: number;
          emailVerified: Date | null;
        };

        token.userId = typedUser.id;
        token.accessToken = randomUUID();
        token.refreshToken = randomUUID();
        token.accessTokenExpires = now + ACCESS_TOKEN_LIFETIME;
        token.refreshTokenExpires = now + REFRESH_TOKEN_LIFETIME;

        //campos adicionais
        token.tokenVersion = typedUser.tokenVersion ?? 0;
        token.emailVerified = typedUser.emailVerified ?? null;
      }

      // Refresh do token se expirou
      const accessTokenExpires = token.accessTokenExpires as number;
      if (accessTokenExpires && now > accessTokenExpires) {
        const prisma = getPrisma();
        const dbUser = await prisma.user.findUnique({
          where: { id: token.userId as string },
          select: { tokenVersion: true },
        });

        if (!dbUser || dbUser.tokenVersion !== token.tokenVersion) {
          token.error = 'InvalidSession';
          return token;
          //throw new Error("Sessão inválida");
        }

        token.accessToken = randomUUID();
        token.accessTokenExpires = now + ACCESS_TOKEN_LIFETIME;
      }

      return token;
    },

    async session({ session, token }): Promise<Session> {
      if (token?.error === 'InvalidSession') {
        session.error = 'InvalidSession';
      }

      // Retorna um objeto literal tipado para evitar problemas de TS
      return {
        user: {
          id: token.userId as string,
          name: session.user?.name ?? null,
          email: session.user?.email ?? null,
          image: session.user?.image ?? null,
          emailVerified: (token.emailVerified as string) ?? null,
          tokenVersion: (token.tokenVersion as number) ?? 0,
        },
        accessToken: token.accessToken as string,
        accessTokenExpires: token.accessTokenExpires as number,
        refreshToken: token.refreshToken as string,
        expires: session.expires,
        error: token?.error === 'InvalidSession' ? 'InvalidSession' : null,
      };
    },
  },
});
