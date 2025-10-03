// app/api/users/route.ts
import { prisma } from "@/lib/prisma";
import { sanitizeObject } from "@/lib/sanitize";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cleanData = sanitizeObject(body);

    const user = await prisma.user.create({
      data: cleanData,
    });

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro ao criar usuário" }), { status: 500 });
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro ao buscar usuários" }), { status: 500 });
  }
}
