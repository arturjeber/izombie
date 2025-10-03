// lib/auth-edge.ts (edge-safe)
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	providers: [], // sem Credentials aqui
})

export default auth((req) => {
  const path = req.nextUrl.pathname

  // Exceções manuais
  if (
    path === "/" ||
    path.startsWith("/login") ||
    path.startsWith("/open") ||
    path.startsWith("/blog") ||
    path.startsWith("/trpc") ||
    path.startsWith("/_next") ||
    path.startsWith("/sw.js") ||
    path.startsWith("/favicon.ico") ||
		path.startsWith("/manifest.webmanifest") ||  // <-- ADICIONE ESSA LINHA
		path.startsWith("/api/auth") ||   // <-- LIBERA O NEXTAUTH
    path.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)
  ) {
    return
  }

  if (!req.auth) {
    return Response.redirect(new URL("/login", req.nextUrl.origin))
  }
})
