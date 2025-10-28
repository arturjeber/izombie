// auth.ts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { getPrisma } from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { EmailClient } from '@azure/communication-email';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import type { Session } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import authConfig from './auth.config';
import { throwTRPCError } from './utilsTRPC';

const ACCESS_TOKEN_LIFETIME = 60 * 15; // 15 min
const REFRESH_TOKEN_LIFETIME = 60 * 60 * 24 * 7; // 7 dias

const emailClient = new EmailClient(process.env.AZURE_EMAIL_CONNECTION_STRING ?? '');

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
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
          throw throwTRPCError('Email e senha são obrigatórios.');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw throwTRPCError('Usuário não encontrado.');
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        if (!isValid) throw throwTRPCError('Senha incorreta.');

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
        name: { label: 'Nome', type: 'text' },
        pass: { label: 'Senha', type: 'password' },
      },
      async authorize({ email, name, pass, code }) {
        const prisma = getPrisma();

        const record = await prisma.verificationToken.findFirst({
          where: { identifier: email as string },
          orderBy: { expires: 'desc' },
        });

        if (!record) return null;
        const isValid = await bcrypt.compare(code as string, record.token);
        if (!isValid) throw throwTRPCError('Código inválido.');

        let user = await prisma.user.findUnique({ where: { email: email as string } });
        if (user) throw throwTRPCError('Usuário já existe.');

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
        if (!email) throw throwTRPCError('Email é obrigatório');
        const prisma = getPrisma();

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.verificationToken.create({
          data: {
            identifier: email as string,
            token: await bcrypt.hash(code, 10),
            expires: new Date(Date.now() + 10 * 60 * 1000),
          },
        });

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
    async jwt({ token, user, trigger, session }) {
      const now = Math.floor(Date.now() / 1000);

      if (user) {
        const typedUser = user as typeof user & {
          tokenVersion: number;
          emailVerified: Date | null;
        };

        const prisma = getPrisma();
        const player = await prisma.player.findUnique({
          where: { userId: user.id },
          select: { id: true },
        });

        token.userId = typedUser.id!;
        token.name = typedUser.name;
        token.accessToken = randomUUID();
        token.refreshToken = randomUUID();
        token.accessTokenExpires = now + ACCESS_TOKEN_LIFETIME;
        token.refreshTokenExpires = now + REFRESH_TOKEN_LIFETIME;

        token.tokenVersion = typedUser.tokenVersion ?? 0;
        token.emailVerified = typedUser.emailVerified ?? null;
        token.playerId = player?.id ?? null;
      }

      if (trigger === 'update' && session?.user) {
        token.name = session.user.name ?? token.name;
      }

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

      return {
        user: {
          id: token.userId as string,
          name: token.name ?? null,
          email: token.email ?? null,
          image: session.user?.image ?? null,
          emailVerified: (token.emailVerified as Date) ?? null,
          tokenVersion: (token.tokenVersion as number) ?? 0,
          playerId: (token.playerId as number) ?? null,
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
