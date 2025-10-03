// auth.ts (na raiz do projeto)
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { JWT, Session } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import Credentials from "next-auth/providers/credentials";
import crypto from "crypto";

const ACCESS_TOKEN_LIFETIME = 60 * 15; // 15 min
const REFRESH_TOKEN_LIFETIME = 60 * 60 * 24 * 7; // 7 dias

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // ou "database" se suportado
	secret: process.env.NEXTAUTH_SECRET, 
  providers: [
		Credentials({
      name: "Credentials",
      credentials: {
				email: { label: "Email", type: "email", placeholder: "email@exemplo.com" },
				password: { label: "Senha", type: "password" },
			},
			async authorize(credentials) {
				//não está usando as tabelas do prisma
				
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email e senha são obrigatórios.");
				}

				// 🔎 Busca usuário pelo email
				const user = await prisma.user.findUnique({
					where: { email: credentials.email as string },
				});
		
				if (!user || !user.password) {
					throw new Error("Usuário não encontrado.");
				}

				// 🔐 Compara senha enviada com a hash do banco
				const isValid = await bcrypt.compare(credentials.password as string, user.password);

				if (!isValid) {
					throw new Error("Senha incorreta.");
				}

				// Retorna apenas os campos que serão expostos
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          tokenVersion: user.tokenVersion ?? 0,
        };
			},
    }),
	],
  callbacks: {
    async jwt({ token, user }) {
			
      const now = Math.floor(Date.now() / 1000);

      // Primeiro login
      if (user) {
				const typedUser = user as typeof user & { tokenVersion?: number };

        token.userId = typedUser.id;
        token.tokenVersion = typedUser.tokenVersion ?? 0;
        token.accessToken = crypto.randomUUID();
        token.refreshToken = crypto.randomUUID();
        token.accessTokenExpires = now + ACCESS_TOKEN_LIFETIME;
        token.refreshTokenExpires = now + REFRESH_TOKEN_LIFETIME;
      }

      // Refresh token se accessToken expirou
			const accessTokenExpires = token.accessTokenExpires as number;
      if (accessTokenExpires && now > accessTokenExpires) {
        // Verifica tokenVersion no DB
        const dbUser = await prisma.user.findUnique({
          where: { id: token.userId as string},
          select: { tokenVersion: true },
        });

        if (!dbUser || dbUser.tokenVersion !== token.tokenVersion) {
          throw new Error("Sessão inválida");
        }

        // Refresh válido → emite novo accessToken
        token.accessToken = crypto.randomUUID();
        token.accessTokenExpires = now + ACCESS_TOKEN_LIFETIME;
      }

      return token;
    },

    async session({ session, token }) {
			const myToken = token as unknown as JWT;
			const mySession = session as unknown as Session; // tipa a session

      mySession.user.id = myToken.userId;
      mySession.accessToken = myToken.accessToken;
      mySession.accessTokenExpires = myToken.accessTokenExpires;
      mySession.refreshToken = myToken.refreshToken;
      return mySession;
    },
  },
});
