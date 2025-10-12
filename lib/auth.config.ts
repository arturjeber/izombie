// auth.config.ts
import type { NextAuthConfig } from "next-auth"
//import crypto from "crypto";



export default {
	providers: [],
  session: { strategy: "jwt" },
	secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig










/*
// auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { JWT, Session } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
//import crypto from "crypto";
import Nodemailer from "next-auth/providers/nodemailer";
import { EmailClient } from "@azure/communication-email";

const ACCESS_TOKEN_LIFETIME = 60 * 15; // 15 min
const REFRESH_TOKEN_LIFETIME = 60 * 60 * 24 * 7; // 7 dias

export function generateUUID(): string {
  let d = new Date().getTime(); // timestamp em ms
  let d2 = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0; // microsegundos no browser

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16; // pseudo-random
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// lib/auth.config.ts
import type AuthOptions  from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";

export const authConfig: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, 
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@exemplo.com" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new Error("Usuário não encontrado.");
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password);

        if (!isValid) {
          throw new Error("Senha incorreta.");
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
		Nodemailer({
			id: "codeMail",
			server: {
				host: process.env.EMAIL_SERVER_HOST,
				port: Number(process.env.EMAIL_SERVER_PORT),
				auth: {
					user: process.env.EMAIL_SERVER_USER,
					pass: process.env.EMAIL_SERVER_PASSWORD,
				},
			},
			from: `"iZombie Central" <${process.env.EMAIL_FROM}>`,
			maxAge: 10 * 60, // Código expira em 10 minutos
		}),		
  ],
  callbacks: {
    async jwt({ token, user }) {
      const now = Math.floor(Date.now() / 1000);

      if (user) {
        const typedUser = user as typeof user & { tokenVersion: number; emailVerified: Date | null  };

        token.userId = typedUser.id;
        token.accessToken = generateUUID();
        token.refreshToken = generateUUID();
        token.accessTokenExpires = now + ACCESS_TOKEN_LIFETIME;
        token.refreshTokenExpires = now + REFRESH_TOKEN_LIFETIME;

				//campos adicionais
				token.tokenVersion = typedUser.tokenVersion ?? 0;
				token.emailVerified = typedUser.emailVerified ?? null;

      }

      // Refresh do token se expirou
      const accessTokenExpires = token.accessTokenExpires as number;
      if (accessTokenExpires && now > accessTokenExpires) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.userId as string },
          select: { tokenVersion: true },
        });

        if (!dbUser || dbUser.tokenVersion !== token.tokenVersion) {
          throw new Error("Sessão inválida");
        }

        token.accessToken = generateUUID();
        token.accessTokenExpires = now + ACCESS_TOKEN_LIFETIME;
      }

      return token;
    },

    async session({ session, token }): Promise<Session> {
      // Retorna um objeto literal tipado para evitar problemas de TS
      return {
        user: {
          id: token.userId as string,
          name: session.user?.name ?? null,
          email: session.user?.email ?? null,
          image: session.user?.image ?? null,
					emailVerified: token.emailVerified as string ?? null,
          tokenVersion: token.tokenVersion as number ?? 0 ,
        },
        accessToken: token.accessToken as string,
        accessTokenExpires: token.accessTokenExpires as number,
        refreshToken: token.refreshToken as string,
        expires: session.expires,
      };
    },
  },
});


/** */