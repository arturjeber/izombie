import authConfig from "@/lib/auth.config"
import NextAuth from "next-auth"
import type { NextRequest } from "next/server" 
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig)

export default auth(async function middleware(req: NextRequest & { auth?: any }) {
  const path = req.nextUrl.pathname
	const session = await auth(); // ← obtém a sessão do usuário

  const email = req.cookies.get("pendingEmail")?.value;

	

	console.log("jjj", path, email)
	if(session && 
		(
			path == ("/") ||
			path == ("/join") ||
			path == ("/login") ||
			path == ("/onboarding")
		)
	) return NextResponse.redirect(new URL("/status", req.nextUrl.origin));

	if(!email && 	path == ("/onboarding")) return NextResponse.redirect(new URL("/join", req.nextUrl.origin));
  // Exceções manuais
  if (
    path == ("/") ||
    path.startsWith("/login") ||
    path.startsWith("/onboarding") ||
    path.startsWith("/join") ||
    path.startsWith("/open") ||
    path.startsWith("/blog") ||
    path.startsWith("/trpc") ||
    path.startsWith("/_next") ||
    path.startsWith("/sw.js") ||
    path.startsWith("/favicon.ico") ||
		path.startsWith("/manifest.webmanifest") ||
		path.startsWith("/api/auth") ||
		path.startsWith("/api/trpc/message.create") ||
		path.startsWith("/api/trpc/auth.register") || 
		path.startsWith("/api/trpc/email.sendEmail") || 
		path.startsWith("/api/trpc/user.createPlayer") || 
    path.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)
  ) {
    return NextResponse.next()
  }
	else if(!session) return NextResponse.redirect(new URL("/login", req.nextUrl.origin))



	return NextResponse.next()
})


/*
import { auth } from "@/lib/auth"; // seu auth wrapper ou getServerSession/next-auth
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  // Define rotas públicas
  const publicRoutes = ["/login", "/join", "/open", "/blog"];
  
  // Rotas públicas que redirecionam se estiver logado
  const redirectIfLoggedRoutes = ["/login", "/join"];

  // Se a rota é pública
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    if (redirectIfLoggedRoutes.some(route => pathname.startsWith(route)) && req.auth) {
      // Redireciona usuário logado
      return NextResponse.redirect(new URL("/status", req.nextUrl.origin));
    }
    return NextResponse.next(); // deixa passar
  }

  // Rotas privadas
  if (!req.auth) {
    // Se não estiver logado, redireciona para login
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  // Se estiver logado, deixa passar
  return NextResponse.next();
});

// Define matcher se quiser limitar middleware a certas rotas
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};



/*

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const path = req.nextUrl.pathname
	
	if (path == "/" && req.auth) return Response.redirect(new URL("/status", req.nextUrl.origin))

  // Exceções manuais
  if (
    path.startsWith("/login") ||
    path.startsWith("/join") ||
    path.startsWith("/open") ||
    path.startsWith("/blog") ||
    path.startsWith("/trpc") ||
    path.startsWith("/_next") ||
    path.startsWith("/sw.js") ||
    path.startsWith("/favicon.ico") ||
		path.startsWith("/manifest.webmanifest") ||  // <-- ADICIONE ESSA LINHA
		path.startsWith("/api/auth") ||   // <-- LIBERA O NEXTAUTH
		path.startsWith("/api/trpc/message.create") ||   // <-- LIBERA O NEXTAUTH
		path.startsWith("/api/trpc/auth.register") ||   // <-- LIBERA O NEXTAUTH
		path.startsWith("/api/trpc/email.sendEmail") ||   // <-- LIBERA O NEXTAUTH
    path.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)
  ) {
    return
  }

	if (path !== "/" && !req.auth) return Response.redirect(new URL("/", req.nextUrl.origin))
	
	// ✅ Redireciona usuário logado que acessa a raiz "/"
  if (path !== "/onboarding" && req.auth && req.auth.user.emailVerified == null) {
    return Response.redirect(new URL("/onboarding", req.nextUrl.origin))
  }

	if (path == "/onboarding" && req.auth && req.auth.user.emailVerified !== null) {
    return Response.redirect(new URL("/status", req.nextUrl.origin))
  }


})
/** */