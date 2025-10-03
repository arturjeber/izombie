import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-protect";

export async function GET(req: Request) {
	return withAuth(req, async (token) => {
		try {
			
				const users = await prisma.user.findMany();
				return NextResponse.json(users);
			
			
		} catch (error) {
			console.error("Erro ao buscar usuários:", error);
			return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
		}

	});
}
